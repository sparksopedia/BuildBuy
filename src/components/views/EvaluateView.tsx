"use client";

import { useState } from "react";
import { Card, FieldLabel, TextInput } from "@/components/Primitives";
import ScoreRow from "@/components/ScoreRow";
import Footer from "@/components/Footer";
import { submitResponse, getResponses } from "@/lib/supabase-data";
import { STAKEHOLDER_ROLES, type Rubric, type EvalResponse } from "@/lib/constants";

interface EvaluateViewProps {
  rubric: Rubric;
  initialName?: string;
  onNavigate: (view: string) => void;
  onResponsesLoaded: (responses: EvalResponse[]) => void;
}

export default function EvaluateView({
  rubric,
  initialName = "",
  onNavigate,
  onResponsesLoaded,
}: EvaluateViewProps) {
  const [evalName, setEvalName] = useState(initialName);
  const [evalRole, setEvalRole] = useState("");
  const [scores, setScores] = useState<Record<string, number | "na">>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmitEval =
    evalName.trim() && rubric.dimensions.every((d) => scores[d.id] !== undefined);

  async function handleSubmitEval() {
    setLoading(true);
    setSubmitError(null);
    const entry: Omit<EvalResponse, "id"> = {
      evaluatorName: evalName.trim(),
      role: evalRole,
      scores,
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    };
    try {
      await submitResponse(rubric.id, entry);
      const updated = await getResponses(rubric.id);
      onResponsesLoaded(updated);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit evaluation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FA",
        fontFamily: "'DM Sans', sans-serif",
        padding: "28px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: 1,
                }}
              >
                {rubric.id}
              </span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <Card>
            <div className="info-box" style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "#4B61A0",
                  marginBottom: 8,
                }}
              >
                About This Evaluation
              </div>
              <p style={{ fontSize: 14, color: "#2D3F72", lineHeight: 1.7 }}>
                This rubric evaluates whether <strong>{rubric.title}</strong> is better addressed
                through an internally built solution or a commercial product. Score each dimension
                based on your knowledge and perspective.
              </p>
              {rubric.description && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#4B61A0",
                    marginTop: 8,
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    borderTop: "1px solid #C7D4F5",
                    paddingTop: 8,
                  }}
                >
                  {rubric.description}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 16px",
                  fontSize: 13,
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px solid #C7D4F5",
                }}
              >
                <span>
                  Scale:{" "}
                  <strong
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "#1A2744",
                    }}
                  >
                    {rubric.scale.label}
                  </strong>
                </span>
                <span style={{ color: "#C7D4F5" }}>·</span>
                <span>
                  <strong style={{ color: "#9CA3AF" }}>N/A</strong> = cannot assess
                </span>
                <span style={{ color: "#C7D4F5" }}>·</span>
                <span style={{ color: "#1D4ED8", fontWeight: 600 }}>
                  {rubric.scale.buildLabel} = Build internally
                </span>
                <span style={{ color: "#C7D4F5" }}>·</span>
                <span style={{ color: "#15803D", fontWeight: 600 }}>
                  {rubric.scale.buyLabel} = Buy commercially
                </span>
              </div>
            </div>

            <FieldLabel>Your Name</FieldLabel>
            <TextInput
              placeholder="Enter your name"
              value={evalName}
              onChange={(e) => setEvalName(e.target.value)}
            />

            <FieldLabel>
              Your Role / Stakeholder Group{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  color: "#9CA3AF",
                  fontSize: 11,
                }}
              >
                (optional)
              </span>
            </FieldLabel>
            <select
              value={evalRole}
              onChange={(e) => setEvalRole(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 9,
                fontSize: 15,
                color: evalRole ? "#1A2744" : "#9CA3AF",
                marginBottom: 20,
                background: "#fff",
              }}
            >
              <option value="">Select your role…</option>
              {STAKEHOLDER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 8, marginBottom: 20 }}>
              {rubric.dimensions.map((d, i) => (
                <ScoreRow
                  key={d.id}
                  dim={d}
                  index={i + 1}
                  scale={rubric.scale}
                  value={scores[d.id]}
                  onChange={(val) => setScores((prev) => ({ ...prev, [d.id]: val }))}
                />
              ))}
            </div>

            <FieldLabel>
              Comments{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  color: "#9CA3AF",
                  fontSize: 11,
                }}
              >
                (optional — visible to all in results)
              </span>
            </FieldLabel>
            <textarea
              placeholder="Share context, caveats, or additional perspective."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 9,
                fontSize: 14,
                color: "#1A2744",
                lineHeight: 1.6,
                resize: "vertical",
                marginBottom: 20,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />

            {submitError && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 9,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#DC2626",
                  marginBottom: 16,
                }}
              >
                {submitError}
              </div>
            )}
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: 15 }}
              disabled={!canSubmitEval || loading}
              onClick={handleSubmitEval}
            >
              {loading ? "Submitting…" : "Submit Evaluation →"}
            </button>
          </Card>
        ) : (
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, color: "#16A34A", marginBottom: 14 }}>◈</div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#1A2744",
                marginBottom: 8,
              }}
            >
              Submitted
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 28 }}>
              Thanks, {evalName}. Your evaluation has been recorded and will be included in the
              aggregate results.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn-outline" onClick={() => onNavigate("home")}>
                ← Home
              </button>
              <button className="btn-primary" onClick={() => onNavigate("results")}>
                View Results →
              </button>
            </div>
          </Card>
        )}
        <Footer onContact={() => onNavigate("contact")} />
      </div>
    </div>
  );
}
