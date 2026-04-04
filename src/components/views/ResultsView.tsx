"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/Primitives";
import Footer from "@/components/Footer";
import { subscribeToResponses, getResponses } from "@/lib/supabase-data";
import { exportCSV, exportPDF } from "@/lib/export";
import { pct, getVerdict } from "@/lib/utils";
import type { Rubric, EvalResponse } from "@/lib/constants";

interface ResultsViewProps {
  rubric: Rubric;
  initialResponses: EvalResponse[];
  onNavigate: (view: string) => void;
}

export default function ResultsView({
  rubric,
  initialResponses,
  onNavigate,
}: ResultsViewProps) {
  const [responses, setResponses] = useState<EvalResponse[]>(initialResponses);
  const [resultsTab, setResultsTab] = useState<"summary" | "scores" | "comments">("summary");
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToResponses(rubric.id, (fresh) => {
      setResponses(fresh);
      setLastSync(new Date());
    });
    return unsubscribe;
  }, [rubric.id]);

  const n = responses.length;
  const dimAvgs = rubric.dimensions.map((d) => {
    const rated = responses
      .map((r) => r.scores[d.id])
      .filter((v): v is number => v !== undefined && v !== "na");
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
    const naCount = responses.filter((r) => r.scores[d.id] === "na").length;
    return {
      ...d,
      avg,
      ratio: avg !== null ? pct(avg, rubric.scale) : null,
      naCount,
      ratedCount: rated.length,
    };
  });
  const validDims = dimAvgs.filter((d) => d.avg !== null);
  const overallAvg = validDims.length
    ? validDims.reduce((s, d) => s + d.avg!, 0) / validDims.length
    : null;
  const overallRatio = overallAvg !== null ? pct(overallAvg, rubric.scale) : 0.5;
  const v = getVerdict(overallRatio);
  const withComments = responses.filter((r) => r.comment && r.comment.trim());

  const roleMap: Record<string, number> = {};
  responses.forEach((r) => {
    if (r.role) roleMap[r.role] = (roleMap[r.role] || 0) + 1;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FA",
        fontFamily: "'DM Sans', sans-serif",
        padding: "28px 20px",
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            className="nav-back"
            onClick={() => onNavigate("home")}
            style={{ fontSize: 13, color: "#9CA3AF", background: "none", border: "none" }}
          >
            ← Home
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 17,
                fontWeight: 600,
                color: "#1A2744",
              }}
            >
              {rubric.org && (
                <span style={{ fontWeight: 400, color: "#9CA3AF" }}>{rubric.org} · </span>
              )}
              {rubric.title}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              by {rubric.authorName} ·{" "}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
                {rubric.id}
              </span>
              {rubric.description && (
                <span>
                  {" "}
                  · {rubric.description.slice(0, 60)}
                  {rubric.description.length > 60 ? "…" : ""}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {n} evaluator{n !== 1 ? "s" : ""}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#22C55E",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "inline-block",
                }}
              />
              {lastSync
                ? `Updated ${lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "Live"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #E5E7EB", marginBottom: 20 }}>
          {(
            [
              ["summary", "Summary"],
              ["scores", "Individual Scores"],
              [
                "comments",
                `Comments${withComments.length > 0 ? ` (${withComments.length})` : ""}`,
              ],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={`tab-btn${resultsTab === id ? " tab-on" : ""}`}
              onClick={() => setResultsTab(id)}
              style={{ fontSize: 14 }}
            >
              {label}
            </button>
          ))}
        </div>

        {n === 0 ? (
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>○</div>
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No Evaluations Yet
            </h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 8 }}>
              Share code{" "}
              <strong
                style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}
              >
                {rubric.id}
              </strong>{" "}
              with your stakeholders to collect scores.
            </p>
            <div style={{ margin: "16px 0", display: "inline-block", background: "#fff", borderRadius: 12, padding: 14 }}>
              <QRCode
                value={`https://buildorbuy.app?code=${rubric.id}`}
                size={120}
                bgColor="#FFFFFF"
                fgColor="#1A2744"
              />
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>
              Scan to score, or invite Product, Engineering, Operations, and Business team members
              for a well-rounded view.
            </p>
            <button className="btn-primary" onClick={() => onNavigate("evaluate")}>
              Be the First to Score →
            </button>
          </Card>
        ) : (
          <>
            {/* SUMMARY */}
            {resultsTab === "summary" && (
              <>
                <Card style={{ textAlign: "center", paddingBottom: 32 }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: v.bg,
                      color: v.col,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      padding: "5px 14px",
                      borderRadius: 100,
                      marginBottom: 10,
                    }}
                  >
                    {v.label}
                  </span>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 46,
                      fontWeight: 700,
                      color: v.col,
                      lineHeight: 1,
                      margin: "10px 0 6px",
                    }}
                  >
                    {overallAvg !== null ? overallAvg.toFixed(2) : "—"}
                    <span style={{ fontSize: 18, color: "#9CA3AF", fontWeight: 400 }}>
                      {" "}
                      / {rubric.scale.max}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
                    aggregate score · N/A excluded · {n} evaluator{n !== 1 ? "s" : ""}
                    {Object.keys(roleMap).length > 0 && (
                      <span style={{ marginLeft: 4 }}>
                        (
                        {Object.entries(roleMap)
                          .map(([role, cnt]) => `${cnt} ${role}`)
                          .join(", ")}
                        )
                      </span>
                    )}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      maxWidth: 460,
                      margin: "0 auto 18px",
                    }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", width: 55, textAlign: "right" }}
                    >
                      Build
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 12,
                        background: "#E5E7EB",
                        borderRadius: 100,
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <div
                        style={{
                          width: `${overallRatio * 100}%`,
                          height: "100%",
                          borderRadius: 100,
                          background: "linear-gradient(to right, #2563EB, #16A34A)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: -6,
                          left: `calc(${Math.max(2, Math.min(98, overallRatio * 100))}% - 12px)`,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#1A2744",
                          border: "3px solid #fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#15803D", width: 55 }}>
                      Buy
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
                    {overallRatio < 0.3
                      ? "The aggregate indicates a strong case for building this capability internally."
                      : overallRatio < 0.5
                        ? "The aggregate leans toward an internal build, though the case is not decisive."
                        : overallRatio < 0.7
                          ? "The aggregate leans toward a commercial solution, though worth reviewing dissenting views."
                          : "The aggregate indicates a strong case for purchasing a commercial solution."}
                  </p>
                </Card>

                <Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <QRCode
                      value={`https://buildorbuy.app?code=${rubric.id}`}
                      size={80}
                      bgColor="#FFFFFF"
                      fgColor="#1A2744"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A2744", marginBottom: 4 }}>
                      Invite more evaluators
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                      Scan the QR code or share code{" "}
                      <strong
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: 1,
                          color: "#1A2744",
                        }}
                      >
                        {rubric.id}
                      </strong>{" "}
                      to collect additional scores.
                    </p>
                  </div>
                </Card>

                <Card>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#1A2744",
                      marginBottom: 18,
                    }}
                  >
                    Dimension Breakdown
                  </h3>
                  {dimAvgs.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 0",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <span
                        style={{
                          width: 170,
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#374151",
                          flexShrink: 0,
                        }}
                      >
                        {d.name}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "#F3F4F6",
                          borderRadius: 100,
                          overflow: "hidden",
                        }}
                      >
                        {d.avg !== null && d.ratio !== null ? (
                          <div
                            style={{
                              width: `${d.ratio * 100}%`,
                              height: "100%",
                              borderRadius: 100,
                              background: d.ratio < 0.5 ? "#3B82F6" : "#22C55E",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background:
                                "repeating-linear-gradient(90deg, #E5E7EB 0, #E5E7EB 4px, transparent 4px, transparent 8px)",
                            }}
                          />
                        )}
                      </div>
                      {d.avg !== null && d.ratio !== null ? (
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            fontWeight: 600,
                            color: getVerdict(d.ratio).col,
                            width: 36,
                            textAlign: "right",
                          }}
                        >
                          {d.avg.toFixed(1)}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#D1D5DB",
                            width: 36,
                            textAlign: "right",
                          }}
                        >
                          N/A
                        </span>
                      )}
                      {d.naCount > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#D1D5DB",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {d.naCount} skipped
                        </span>
                      )}
                    </div>
                  ))}
                </Card>
              </>
            )}

            {/* SCORES */}
            {resultsTab === "scores" && (
              <Card>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1A2744",
                    marginBottom: 18,
                  }}
                >
                  Individual Scores
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px 10px",
                            background: "#F9FAFB",
                            borderBottom: "2px solid #E5E7EB",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            color: "#6B7280",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Evaluator
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px 6px",
                            background: "#F9FAFB",
                            borderBottom: "2px solid #E5E7EB",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            color: "#6B7280",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Role
                        </th>
                        {rubric.dimensions.map((d) => (
                          <th
                            key={d.id}
                            style={{
                              textAlign: "center",
                              padding: "8px 6px",
                              background: "#F9FAFB",
                              borderBottom: "2px solid #E5E7EB",
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 0.3,
                              color: "#6B7280",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {d.name.split(" ").slice(0, 2).join(" ")}
                          </th>
                        ))}
                        <th
                          style={{
                            textAlign: "center",
                            padding: "8px 10px",
                            background: "#F9FAFB",
                            borderBottom: "2px solid #E5E7EB",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            color: "#6B7280",
                          }}
                        >
                          Avg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((r, i) => {
                        const rated = rubric.dimensions
                          .map((d) => r.scores[d.id])
                          .filter((val): val is number => val !== undefined && val !== "na");
                        const avg = rated.length
                          ? rated.reduce((a, b) => a + b, 0) / rated.length
                          : null;
                        const rv =
                          avg !== null ? getVerdict(pct(avg, rubric.scale)) : null;
                        return (
                          <tr
                            key={i}
                            style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                          >
                            <td
                              style={{
                                padding: "9px 10px",
                                borderBottom: "1px solid #F3F4F6",
                                fontWeight: 500,
                              }}
                            >
                              {r.evaluatorName}
                            </td>
                            <td
                              style={{
                                padding: "9px 6px",
                                borderBottom: "1px solid #F3F4F6",
                                fontSize: 11,
                                color: "#9CA3AF",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {r.role || "—"}
                            </td>
                            {rubric.dimensions.map((d) => {
                              const s = r.scores[d.id];
                              return (
                                <td
                                  key={d.id}
                                  style={{
                                    padding: "9px 6px",
                                    borderBottom: "1px solid #F3F4F6",
                                    textAlign: "center",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: s === "na" ? "#D1D5DB" : "#374151",
                                    fontSize: s === "na" ? 10 : 13,
                                  }}
                                >
                                  {s === undefined ? "—" : s === "na" ? "N/A" : s}
                                </td>
                              );
                            })}
                            <td
                              style={{
                                padding: "9px 10px",
                                borderBottom: "1px solid #F3F4F6",
                                textAlign: "center",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 700,
                                color: rv ? rv.col : "#9CA3AF",
                              }}
                            >
                              {avg !== null ? avg.toFixed(1) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* COMMENTS */}
            {resultsTab === "comments" && (
              <Card>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1A2744",
                    marginBottom: 6,
                  }}
                >
                  Evaluator Comments
                </h3>
                <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>
                  {withComments.length} of {n} evaluator{n !== 1 ? "s" : ""} left a comment
                </p>
                {withComments.length === 0 ? (
                  <div
                    style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 12 }}>○</div>
                    <p style={{ fontSize: 14 }}>No comments have been submitted yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {withComments.map((r, i) => {
                      const rated = rubric.dimensions
                        .map((d) => r.scores[d.id])
                        .filter((val): val is number => val !== undefined && val !== "na");
                      const avg = rated.length
                        ? rated.reduce((a, b) => a + b, 0) / rated.length
                        : null;
                      const rv =
                        avg !== null ? getVerdict(pct(avg, rubric.scale)) : null;
                      return (
                        <div
                          key={i}
                          style={{
                            background: "#F9FAFB",
                            borderRadius: 12,
                            padding: "16px 18px",
                            borderLeft: "3px solid #C8922A",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 10,
                            }}
                          >
                            <div>
                              <span
                                style={{ fontSize: 14, fontWeight: 600, color: "#1A2744" }}
                              >
                                {r.evaluatorName}
                              </span>
                              {r.role && (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#9CA3AF",
                                    marginLeft: 8,
                                  }}
                                >
                                  {r.role}
                                </span>
                              )}
                            </div>
                            {rv && avg !== null && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: rv.bg,
                                  color: rv.col,
                                  padding: "3px 10px",
                                  borderRadius: 100,
                                  flexShrink: 0,
                                  marginLeft: 10,
                                }}
                              >
                                {rv.label} · {avg.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: 14,
                              color: "#374151",
                              lineHeight: 1.7,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {r.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                paddingBottom: 32,
              }}
            >
              <button className="btn-ghost" onClick={() => onNavigate("evaluate")}>
                Add My Score
              </button>
              <button
                className="btn-outline"
                onClick={async () => {
                  setLoading(true);
                  const r = await getResponses(rubric.id);
                  setResponses(r);
                  setLastSync(new Date());
                  setLoading(false);
                }}
              >
                {loading ? "Refreshing…" : "↻ Refresh"}
              </button>
              <button
                className="btn-ghost"
                disabled={exporting === "csv" || n === 0}
                onClick={async () => {
                  setExporting("csv");
                  try {
                    exportCSV(rubric, responses);
                  } finally {
                    setExporting(null);
                  }
                }}
              >
                {exporting === "csv" ? "Exporting…" : "⬇ Export CSV"}
              </button>
              <button
                className="btn-primary"
                disabled={exporting === "pdf" || n === 0}
                onClick={async () => {
                  setExporting("pdf");
                  try {
                    await exportPDF(rubric, responses);
                  } finally {
                    setExporting(null);
                  }
                }}
              >
                {exporting === "pdf" ? "Building PDF…" : "⬇ Export PDF"}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer onContact={() => onNavigate("contact")} />
    </div>
  );
}
