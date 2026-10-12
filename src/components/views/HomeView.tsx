"use client";

import { useState } from "react";
import { Card, FieldLabel, TextInput } from "@/components/Primitives";
import Footer from "@/components/Footer";
import { getRubric, getResponses, getRubricsByAuthor } from "@/lib/data";
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
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Hero Section ── */}
      <div
        style={{
          background: "var(--hero-bg)",
          padding: "52px 20px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "var(--hero-circle-1)",
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
            background: "var(--hero-circle-2)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: 12,
                background: "var(--hero-badge-bg)",
                color: "var(--hero-text)",
                padding: "4px 9px",
                borderRadius: 5,
                letterSpacing: 1,
                border: "1px solid var(--hero-badge-border)",
              }}
            >
              B/B
            </span>
            <span style={{ fontSize: 13, color: "var(--hero-text-faint)", fontWeight: 500 }}>
              Build vs. Buy Decision Tool
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 44,
              fontWeight: 700,
              color: "var(--hero-text)",
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            The free build vs. buy{" "}
            <span style={{ color: "var(--brand-light-blue)" }}>decision framework.</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "var(--hero-text-muted)",
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 0,
            }}
          >
            A free build vs. buy tool that helps product, engineering, and business teams decide
            whether to{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>build internally</strong> or{" "}
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>buy a commercial solution</strong>
            . Structured rubrics. Multi-stakeholder scoring. Exportable results.
          </p>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-light)" }}>
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
                    background: "var(--brand-navy)",
                    color: "var(--bg-card)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    marginBottom: 10,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ background: "var(--bg-page)", padding: "36px 20px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Scoring info box */}
          <div
            className="info-box"
            style={{ marginBottom: 28, background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          >
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 8 }}>
              Designed for{" "}
              <strong>Product, Engineering, Operations, and Business</strong> stakeholders to apply
              consistently — across evaluations, vendors, and teams.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>
              Each rubric is divided into dimensions with specific criteria.
              <span style={{ color: "var(--build-color)", fontWeight: 600 }}>
                {" "}Lower scores favor building internally
              </span>;
              <span style={{ color: "var(--buy-color)", fontWeight: 600 }}>
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
                background: "var(--brand-navy)",
                borderRadius: 18,
                padding: 30,
                color: "var(--bg-card)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 14 }}>✦</div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
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
                  color: "var(--text-body)",
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
                background: "var(--bg-card)",
                borderRadius: 18,
                padding: 30,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{ display: "flex", borderBottom: "1px solid var(--border-light)", marginBottom: 20 }}
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
                      color: "var(--text-muted)",
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
                      fontFamily: "var(--font-mono)",
                      letterSpacing: 4,
                      fontSize: 18,
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  />
                  {joinError && (
                    <p style={{ fontSize: 13, color: "var(--error-text)", marginBottom: 10 }}>
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
                      color: "var(--text-muted)",
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
                      <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center" }}>
                        No rubrics found for &ldquo;{authorLookup}&rdquo;.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {myRubrics.map((r) => (
                          <div
                            key={r.id}
                            style={{
                              background: "var(--bg-card-alt)",
                              border: "1px solid var(--border-default)",
                              borderRadius: 10,
                              padding: "10px 14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                                {r.title}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                                {r.org && <span>{r.org} · </span>}
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
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

          {/* ── SEO content: What is build vs buy? ── */}
          <section
            style={{
              marginTop: 48,
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: 18,
              padding: "36px 30px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              What is a build vs. buy decision?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 14 }}>
              A <strong>build vs. buy decision</strong> (sometimes called a{" "}
              <strong>make or buy analysis</strong>) is the choice between developing a capability
              internally or purchasing a commercial off-the-shelf solution. Teams weigh cost,
              time-to-value, strategic differentiation, maintenance burden, integration complexity,
              and opportunity cost. Without a shared framework, these conversations devolve into
              gut-feel debates — the loudest voice wins and the decision rarely sticks.
            </p>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 0 }}>
              <strong>Build or Buy</strong> gives product, engineering, operations, finance, and
              leadership stakeholders a structured rubric to score each dimension of the decision.
              Scores aggregate across evaluators so you can see where alignment is strong, where
              it&apos;s split, and where the data pushes you toward building in-house or buying from
              a vendor.
            </p>

            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginTop: 32,
                marginBottom: 14,
              }}
            >
              When to use a build vs. buy framework
            </h2>
            <ul
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                paddingLeft: 22,
                marginBottom: 0,
              }}
            >
              <li style={{ marginBottom: 6 }}>
                Evaluating whether to build custom software or license a SaaS platform
              </li>
              <li style={{ marginBottom: 6 }}>
                Choosing between an internal tool and a commercial vendor for a shared workflow
              </li>
              <li style={{ marginBottom: 6 }}>
                Comparing multiple vendors against an in-house build option
              </li>
              <li style={{ marginBottom: 6 }}>
                Running a procurement or technology selection review with multiple stakeholders
              </li>
              <li style={{ marginBottom: 6 }}>
                Documenting the rationale behind a make-or-buy decision for leadership or audit
              </li>
            </ul>

            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginTop: 32,
                marginBottom: 14,
              }}
            >
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  How do you decide whether to build or buy software?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.7 }}>
                  Score dimensions like strategic differentiation, total cost of ownership, speed
                  to value, internal capacity, integration complexity, and risk. Collect input from
                  every affected stakeholder group, then compare aggregated scores. A clear lean
                  toward higher scores favors buying; a lean toward lower scores favors building
                  in-house.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  Is Build or Buy really free?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.7 }}>
                  Yes. Build or Buy is a free, ad-free web tool. Create unlimited rubrics, invite
                  any number of evaluators, and export results — no signup, no credit card.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  What scoring scales are available?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.7 }}>
                  Numeric scales (0-2, 1-5, 1-7, 1-10), 5-star ratings, thumbs up/down, and a
                  0.0-10.0 slider. Every dimension supports N/A when a criterion does not apply.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  Who should use a build vs. buy rubric?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.7 }}>
                  Product managers, engineering leaders, operations, procurement, finance, HR,
                  analytics, and executive leadership. Any cross-functional group making a
                  make-or-buy decision benefits from a shared, structured framework.
                </p>
              </div>
            </div>
          </section>

          {/* ── Contact CTA ── */}
          <div
            style={{
              marginTop: 36,
              background: "var(--hero-bg)",
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
                background: "var(--hero-circle-1)",
                pointerEvents: "none",
              }}
            />
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--hero-text)",
                marginBottom: 8,
                position: "relative",
              }}
            >
              Questions, feedback, or ideas?
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "var(--hero-text-muted)",
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
                background: "var(--brand-accent)",
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
              className="donate-btn"
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
            <p style={{ fontSize: 14, color: "var(--text-dim)", textAlign: "center" }}>
              Find this useful? Help keep it free and ad-free.
            </p>
            <a
              href="https://donate.stripe.com/eVq3cxbrpbp732g8Ra0Ny00"
              target="_blank"
              rel="noopener noreferrer"
              className="donate-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--brand-accent)",
                color: "#fff",
                borderRadius: 10,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              ♥ Support Build or Buy
            </a>
          </div>

          <Footer onContact={() => onNavigate("contact")} />
        </div>
      </div>
    </div>
  );
}
