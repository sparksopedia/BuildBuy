"use client";

import { useState } from "react";
import { Card, FieldLabel, TextInput } from "@/components/Primitives";
import Footer from "@/components/Footer";
import { getRubric, getResponses, getRubricsByAuthor } from "@/lib/supabase-data";
import type { Rubric, EvalResponse } from "@/lib/constants";

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onRubricLoaded: (rubric: Rubric, responses?: EvalResponse[]) => void;
}

export default function HomeView({ onNavigate, onRubricLoaded }: HomeViewProps) {
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [homeTab, setHomeTab] = useState<"join" | "mine">("join");
  const [authorLookup, setAuthorLookup] = useState("");
  const [myRubrics, setMyRubrics] = useState<Rubric[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  async function handleJoin(mode: "eval" | "results") {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setJoinError("");
    const r = await getRubric(code);
    if (!r) {
      setJoinError("No rubric found with that code.");
      setLoading(false);
      return;
    }
    if (mode === "results") {
      const resp = await getResponses(code);
      onRubricLoaded(r, resp);
      onNavigate("results");
    } else {
      onRubricLoaded(r);
      onNavigate("evaluate");
    }
    setLoading(false);
  }

  async function handleLookupAuthor() {
    const key = authorLookup.trim();
    if (!key) return;
    setLookupLoading(true);
    const rubrics = await getRubricsByAuthor(key);
    setMyRubrics(rubrics);
    setLookupLoading(false);
  }

  async function goToResults(r: Rubric) {
    setLoading(true);
    const resp = await getResponses(r.id);
    onRubricLoaded(r, resp);
    onNavigate("results");
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F2F5FA 0%, #E8EEF7 100%)",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: 12,
              background: "#1A2744",
              color: "#fff",
              padding: "4px 9px",
              borderRadius: 5,
              letterSpacing: 1,
            }}
          >
            B/B
          </span>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
            Build vs. Buy Decision Tool
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 40,
            fontWeight: 700,
            color: "#1A2744",
            lineHeight: 1.1,
            marginBottom: 14,
          }}
        >
          Evaluate with{" "}
          <span style={{ color: "#C8922A" }}>structured clarity.</span>
        </h1>

        <div className="info-box" style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: "#2D3F72", lineHeight: 1.75 }}>
            This tool helps teams evaluate whether a business or platform capability is better
            addressed through an
            <strong> internally built solution</strong> or a{" "}
            <strong>commercial product</strong>. It&apos;s designed to be simple enough that{" "}
            <strong>Product, Engineering, Operations, and Business</strong> stakeholders can apply
            it consistently — across evaluations, vendors, and teams.
          </p>
          <p style={{ fontSize: 13, color: "#4B61A0", marginTop: 10, lineHeight: 1.65 }}>
            Each rubric is divided into dimensions with specific criteria. Evaluators score each
            dimension —
            <span style={{ color: "#1D4ED8", fontWeight: 600 }}>
              {" "}
              lower scores favor building internally
            </span>
            ;
            <span style={{ color: "#15803D", fontWeight: 600 }}>
              {" "}
              higher scores favor a commercial solution
            </span>
            . N/A is always available when a dimension doesn&apos;t apply.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))",
            gap: 18,
          }}
        >
          {/* Create */}
          <div
            className="home-card"
            style={{ background: "#1A2744", borderRadius: 18, padding: 30, color: "#fff" }}
          >
            <div style={{ fontSize: 22, marginBottom: 14 }}>✦</div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Create a Rubric
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#94A3B8",
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              Define the capability under evaluation, select your dimensions, set the scoring
              scale, and share a 6-character code with your stakeholders.
            </p>
            <button
              className="btn-outline"
              style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => onNavigate("create")}
            >
              Create New Rubric →
            </button>
          </div>

          {/* Join / Mine */}
          <div
            className="home-card"
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 30,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", borderBottom: "1px solid #F3F4F6", marginBottom: 20 }}>
              <button
                className={`tab-btn${homeTab === "join" ? " tab-on" : ""}`}
                onClick={() => setHomeTab("join")}
              >
                Join / Score
              </button>
              <button
                className={`tab-btn${homeTab === "mine" ? " tab-on" : ""}`}
                onClick={() => setHomeTab("mine")}
              >
                My Rubrics
              </button>
            </div>

            {homeTab === "join" && (
              <>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 16 }}>
                  Received a code from a rubric author? Enter it to submit your evaluation or view
                  aggregated results.
                </p>
                <TextInput
                  placeholder="6-character code  e.g. AB3X7K"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 6)
                    );
                    setJoinError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && joinCode.length >= 4 && handleJoin("eval")}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 4,
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                />
                {joinError && (
                  <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 10 }}>{joinError}</p>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    disabled={joinCode.length < 4 || loading}
                    onClick={() => handleJoin("eval")}
                  >
                    {loading ? "Loading…" : "Score It"}
                  </button>
                  <button
                    className="btn-ghost"
                    style={{ flex: 1 }}
                    disabled={joinCode.length < 4 || loading}
                    onClick={() => handleJoin("results")}
                  >
                    View Results
                  </button>
                </div>
              </>
            )}

            {homeTab === "mine" && (
              <>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 16 }}>
                  Retrieve rubrics you&apos;ve created by entering your author name.
                </p>
                <TextInput
                  placeholder="Your name (as entered when creating)"
                  value={authorLookup}
                  onChange={(e) => {
                    setAuthorLookup(e.target.value);
                    setMyRubrics(null);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && authorLookup.trim() && handleLookupAuthor()
                  }
                />
                <button
                  className="btn-primary"
                  style={{ width: "100%", marginTop: -6, marginBottom: 16 }}
                  disabled={!authorLookup.trim() || lookupLoading}
                  onClick={handleLookupAuthor}
                >
                  {lookupLoading ? "Searching…" : "Find My Rubrics"}
                </button>
                {myRubrics !== null &&
                  (myRubrics.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                      No rubrics found for &ldquo;{authorLookup}&rdquo;.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {myRubrics.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            background: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: 10,
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A2744" }}>
                              {r.title}
                            </div>
                            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                              {r.org && <span>{r.org} · </span>}
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {r.id}
                              </span>
                              {" · "}
                              {r.scale.label} · {r.dimensions.length} dims
                            </div>
                          </div>
                          <button
                            className="btn-outline"
                            style={{ padding: "6px 12px", fontSize: 12, flexShrink: 0 }}
                            onClick={() => goToResults(r)}
                            disabled={loading}
                          >
                            Results
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        {/* Donation CTA */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <p style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>
            Find this useful? Help keep it free and ad-free.
          </p>
          <a
            href="https://venmo.com/sparksopedia"
            target="_blank"
            rel="noopener noreferrer"
            className="venmo-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#C8922A",
              color: "#fff",
              borderRadius: 10,
              padding: "11px 22px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            ♥ Support Build or Buy on Venmo
          </a>
        </div>

        <Footer onContact={() => onNavigate("contact")} />
      </div>
    </div>
  );
}
