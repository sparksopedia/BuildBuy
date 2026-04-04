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
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Hero Section ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #1A2744 0%, #243660 50%, #1A2744 100%)",
          padding: "52px 20px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(200,146,42,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: 12,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                padding: "4px 9px",
                borderRadius: 5,
                letterSpacing: 1,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              B/B
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              Build vs. Buy Decision Tool
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 44,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            Evaluate with{" "}
            <span style={{ color: "#C8922A" }}>structured clarity.</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 0,
            }}
          >
            A free tool that helps teams decide whether to{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>build internally</strong> or{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>buy a commercial solution</strong>
            . Structured rubrics. Multi-stakeholder scoring. Exportable results.
          </p>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "36px 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              textAlign: "center",
            }}
          >
            {[
              { num: "1", title: "Create", desc: "Define dimensions and scoring scale" },
              { num: "2", title: "Score", desc: "Share a code with your stakeholders" },
              { num: "3", title: "Decide", desc: "Review aggregated results and export" },
            ].map((step) => (
              <div key={step.num}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#1A2744",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: 10,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1A2744",
                    marginBottom: 4,
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ background: "#F4F6FA", padding: "36px 20px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Scoring info box */}
          <div
            className="info-box"
            style={{ marginBottom: 28, background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, marginBottom: 8 }}>
              Designed for{" "}
              <strong>Product, Engineering, Operations, and Business</strong> stakeholders to apply
              consistently — across evaluations, vendors, and teams.
            </p>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>
              Each rubric is divided into dimensions with specific criteria.
              <span style={{ color: "#1D4ED8", fontWeight: 600 }}>
                {" "}Lower scores favor building internally
              </span>;
              <span style={{ color: "#15803D", fontWeight: 600 }}>
                {" "}higher scores favor a commercial solution
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
              style={{
                background: "#1A2744",
                borderRadius: 18,
                padding: 30,
                color: "#fff",
              }}
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
                style={{
                  background: "transparent",
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
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
              <div
                style={{ display: "flex", borderBottom: "1px solid #F3F4F6", marginBottom: 20 }}
              >
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
                  <p
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
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
                    onKeyDown={(e) =>
                      e.key === "Enter" && joinCode.length >= 4 && handleJoin("eval")
                    }
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: 4,
                      fontSize: 18,
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  />
                  {joinError && (
                    <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 10 }}>
                      {joinError}
                    </p>
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
                  <p
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
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

          {/* ── Contact CTA ── */}
          <div
            style={{
              marginTop: 48,
              background: "linear-gradient(135deg, #1A2744 0%, #2D3F72 100%)",
              borderRadius: 18,
              padding: "36px 30px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(200,146,42,0.1)",
                pointerEvents: "none",
              }}
            />
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 8,
                position: "relative",
              }}
            >
              Questions, feedback, or ideas?
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                maxWidth: 440,
                margin: "0 auto 20px",
                position: "relative",
              }}
            >
              We&apos;d love to hear how you&apos;re using Build or Buy, or how we can make it
              better for your team.
            </p>
            <button
              onClick={() => onNavigate("contact")}
              style={{
                background: "#C8922A",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px 32px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s, transform 0.1s",
                position: "relative",
              }}
              className="venmo-btn"
            >
              Get in Touch →
            </button>
          </div>

          {/* ── Donation ── */}
          <div
            style={{
              marginTop: 32,
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
    </div>
  );
}
