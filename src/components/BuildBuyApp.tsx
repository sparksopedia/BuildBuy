"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import HomeView from "@/components/views/HomeView";
import CreateView from "@/components/views/CreateView";
import EvaluateView from "@/components/views/EvaluateView";
import ResultsView from "@/components/views/ResultsView";
import ContactView from "@/components/views/ContactView";
import { TextInput } from "@/components/Primitives";
import { getRubric, getResponses, verifyRubricPassword } from "@/lib/data";
import type { Rubric, EvalResponse } from "@/lib/constants";

type View = "home" | "create" | "evaluate" | "evaluate-as-author" | "results" | "contact";

function parseHash(hash: string): { view: View; code?: string; tab?: "join" | "mine" } {
  const h = hash.replace(/^#\/?/, "");
  if (h.startsWith("evaluate/")) {
    const code = h.slice(9).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    return code ? { view: "evaluate", code } : { view: "home" };
  }
  if (h.startsWith("results/")) {
    const code = h.slice(8).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    return code ? { view: "results", code } : { view: "home" };
  }
  if (h === "create") return { view: "create" };
  if (h === "my-rubrics") return { view: "home", tab: "mine" };
  if (h === "contact") return { view: "contact" };
  return { view: "home" };
}

function toHash(view: View, rubricId?: string): string {
  switch (view) {
    case "create":
      return "#create";
    case "evaluate":
    case "evaluate-as-author":
      return rubricId ? `#evaluate/${rubricId}` : "";
    case "results":
      return rubricId ? `#results/${rubricId}` : "";
    case "contact":
      return "#contact";
    default:
      return "";
  }
}

export default function BuildBuyApp() {
  const [view, setView] = useState<View>("home");
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [responses, setResponses] = useState<EvalResponse[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [initialTab, setInitialTab] = useState<"join" | "mine">("join");
  const [routeLoading, setRouteLoading] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState<Rubric | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const rubricIdRef = useRef<string | undefined>(undefined);

  const navigateToRoute = useCallback(
    async (route: { view: View; code?: string; tab?: "join" | "mine" }) => {
      if (route.view === "home") {
        setInitialTab(route.tab ?? "join");
        setView("home");
        setRubric(null);
        rubricIdRef.current = undefined;
        setResponses([]);
        setAuthorName("");
        return;
      }

      if (route.code && (route.view === "evaluate" || route.view === "results")) {
        setRouteLoading(true);
        const r = await getRubric(route.code);
        if (r) {
          setRubric(r);
          rubricIdRef.current = r.id;
          if (route.view === "results" && r.hasPassword) {
            setPasswordPrompt(r);
            setPasswordInput("");
            setPasswordError("");
            setRouteLoading(false);
            return;
          }
          if (route.view === "results") {
            const resp = await getResponses(route.code);
            setResponses(resp);
          }
          setView(route.view);
        } else {
          setView("home");
          setRubric(null);
          rubricIdRef.current = undefined;
          setResponses([]);
        }
        setRouteLoading(false);
        return;
      }

      setView(route.view);
    },
    []
  );

  // Parse initial URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code")?.toUpperCase();
    if (code) {
      window.history.replaceState(null, "", `#evaluate/${code}`);
      navigateToRoute({ view: "evaluate", code });
      return;
    }
    const route = parseHash(window.location.hash);
    if (route.view !== "home" || route.tab) {
      navigateToRoute(route);
    }
  }, [navigateToRoute]);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => navigateToRoute(parseHash(window.location.hash));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [navigateToRoute]);

  const handleNavigate = useCallback((target: string) => {
    if (target === "home") {
      setView("home");
      setRubric(null);
      rubricIdRef.current = undefined;
      setResponses([]);
      setAuthorName("");
      setInitialTab("join");
      window.history.pushState(null, "", window.location.pathname);
    } else if (target === "my-rubrics") {
      setView("home");
      setInitialTab("mine");
      window.history.pushState(null, "", "#my-rubrics");
    } else {
      setView(target as View);
      const hash = toHash(target as View, rubricIdRef.current);
      if (hash) window.history.pushState(null, "", hash);
    }
  }, []);

  const handleRubricLoaded = useCallback((r: Rubric, resp?: EvalResponse[]) => {
    setRubric(r);
    rubricIdRef.current = r.id;
    if (resp) setResponses(resp);
  }, []);

  const handleRubricCreated = useCallback((r: Rubric) => {
    setRubric(r);
    rubricIdRef.current = r.id;
    setAuthorName(r.authorName);
    setResponses([]);
  }, []);

  const handleResponsesLoaded = useCallback((resp: EvalResponse[]) => {
    setResponses(resp);
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    if (!passwordPrompt) return;
    setPasswordLoading(true);
    setPasswordError("");
    const valid = await verifyRubricPassword(passwordPrompt.id, passwordInput);
    if (valid) {
      const resp = await getResponses(passwordPrompt.id);
      setResponses(resp);
      setView("results");
      setPasswordPrompt(null);
      setPasswordInput("");
    } else {
      setPasswordError("Incorrect password");
    }
    setPasswordLoading(false);
  }, [passwordPrompt, passwordInput]);

  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt(null);
    setPasswordInput("");
    setPasswordError("");
    setView("home");
    setRubric(null);
    rubricIdRef.current = undefined;
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  if (passwordPrompt) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "var(--font-body)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "32px 28px",
            maxWidth: 380,
            width: "100%",
            margin: "0 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text)",
              margin: "0 0 4px",
            }}
          >
            Password Required
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              margin: "0 0 20px",
            }}
          >
            Enter the password to view results for{" "}
            <strong>{passwordPrompt.title}</strong>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordSubmit();
            }}
          >
            <TextInput
              value={passwordInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              placeholder="Password"
              type="password"
              autoFocus
            />
            {passwordError && (
              <p
                style={{
                  color: "var(--danger, #e53e3e)",
                  fontSize: 13,
                  margin: "8px 0 0",
                }}
              >
                {passwordError}
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={handlePasswordCancel}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!passwordInput.trim() || passwordLoading}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: passwordInput.trim() && !passwordLoading ? "pointer" : "default",
                  opacity: !passwordInput.trim() || passwordLoading ? 0.5 : 1,
                }}
              >
                {passwordLoading ? "Verifying…" : "Unlock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (routeLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "var(--font-body)",
          color: "var(--text-muted)",
          fontSize: 15,
        }}
      >
        Loading…
      </div>
    );
  }

  if (view === "home") {
    return (
      <HomeView
        onNavigate={handleNavigate}
        onRubricLoaded={handleRubricLoaded}
        initialTab={initialTab}
      />
    );
  }

  if (view === "create") {
    return <CreateView onNavigate={handleNavigate} onRubricCreated={handleRubricCreated} />;
  }

  if ((view === "evaluate" || view === "evaluate-as-author") && rubric) {
    return (
      <EvaluateView
        rubric={rubric}
        initialName={view === "evaluate-as-author" ? authorName : ""}
        onNavigate={handleNavigate}
        onResponsesLoaded={handleResponsesLoaded}
      />
    );
  }

  if (view === "results" && rubric) {
    return (
      <ResultsView
        rubric={rubric}
        initialResponses={responses}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "contact") {
    return <ContactView onNavigate={handleNavigate} />;
  }

  return (
    <HomeView
      onNavigate={handleNavigate}
      onRubricLoaded={handleRubricLoaded}
      initialTab={initialTab}
    />
  );
}
