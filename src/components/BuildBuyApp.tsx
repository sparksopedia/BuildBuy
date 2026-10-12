"use client";

import { useState, useCallback, useEffect } from "react";
import HomeView from "@/components/views/HomeView";
import CreateView from "@/components/views/CreateView";
import EvaluateView from "@/components/views/EvaluateView";
import ResultsView from "@/components/views/ResultsView";
import ContactView from "@/components/views/ContactView";
import { getRubric } from "@/lib/data";
import type { Rubric, EvalResponse } from "@/lib/constants";

type View = "home" | "create" | "evaluate" | "evaluate-as-author" | "results" | "contact";

export default function BuildBuyApp() {
  const [view, setView] = useState<View>("home");
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [responses, setResponses] = useState<EvalResponse[]>([]);
  const [authorName, setAuthorName] = useState("");

  // Auto-join if ?code=XXXXXX is in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code")?.toUpperCase();
    if (!code) return;
    getRubric(code).then((r) => {
      if (r) {
        setRubric(r);
        setView("evaluate");
        // Clean the URL without reloading
        window.history.replaceState({}, "", window.location.pathname);
      }
    });
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === "home") {
        setView("home");
        setRubric(null);
        setResponses([]);
        setAuthorName("");
      } else {
        setView(target as View);
      }
    },
    []
  );

  const handleRubricLoaded = useCallback(
    (r: Rubric, resp?: EvalResponse[]) => {
      setRubric(r);
      if (resp) setResponses(resp);
    },
    []
  );

  const handleRubricCreated = useCallback((r: Rubric) => {
    setRubric(r);
    setAuthorName(r.authorName);
    setResponses([]);
  }, []);

  const handleResponsesLoaded = useCallback((resp: EvalResponse[]) => {
    setResponses(resp);
  }, []);

  if (view === "home") {
    return <HomeView onNavigate={handleNavigate} onRubricLoaded={handleRubricLoaded} />;
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

  return <HomeView onNavigate={handleNavigate} onRubricLoaded={handleRubricLoaded} />;
}
