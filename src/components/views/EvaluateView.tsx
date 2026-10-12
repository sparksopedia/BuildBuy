"use client";

import { useState } from "react";
import { Card, FieldLabel, TextInput } from "@/components/Primitives";
import ScoreRow from "@/components/ScoreRow";
import Footer from "@/components/Footer";
import { submitResponse, getResponses } from "@/lib/data";
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
        background: "var(--bg-page)",
        fontFamily: "var(--font-body)",
        padding: "28px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            className="nav-back"
            onClick={() => onNavigate("home")}
            style={{ fontSize: 13, color: "var(--text-dim)", background: "none", border: "none" }}
          >
            ← Home
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {rubric.org && (
                <span style={{ fontWeight: 400, color: "var(--text-dim)" }}>{rubric.org} · </span>
              )}
              {rubric.title}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
              by {rubric.authorName} ·{" "}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
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
                  color: "var(--badge-text)",
                  marginBottom: 8,
                }}
              >
                About This Evaluation
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                This rubric evaluates whether <strong>{rubric.title}</strong> is better addressed
                through an internally built solution or a commercial product. Score each dimension
                based on your knowledge and perspective.
              </p>
              {rubric.description && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--badge-text)",
                    marginTop: 8,
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    borderTop: "1px solid var(--bg-info-border)",
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
                  borderTop: "1px solid var(--bg-info-border)",
                }}
              >
                <span>
                  Scale:{" "}
                  <strong
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {rubric.scale.label}
                  </strong>
                </span>
                <span style={{ color: "var(--bg-info-border)" }}>·</span>
                <span>
                  <strong style={{ color: "var(--text-dim)" }}>N/A</strong> = cannot assess
                </span>
                <span style={{ color: "var(--bg-info-border)" }}>·</span>
                <span style={{ color: "var(--build-color)", fontWeight: 600 }}>
                  {rubric.scale.buildLabel} = Build internally
                </span>
                <span style={{ color: "var(--bg-info-border)" }}>·</span>
                <span style={{ color: "var(--buy-color)", fontWeight: 600 }}>
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
                  color: "var(--text-dim)",
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
                border: "1.5px solid var(--border-default)",
                borderRadius: 9,
                fontSize: 15,
                color: evalRole ? "var(--text-primary)" : "var(--text-dim)",
                marginBottom: 20,
                background: "var(--bg-input)",
              }}
            >
              <option value="">Select your role…</option>
              {STAKEHOLDER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 8, marginBottom: 20 }}>
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
                  color: "var(--text-dim)",
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
                border: "1.5px solid var(--border-default)",
                borderRadius: 9,
                fontSize: 14,
                color: "var(--text-primary)",
                background: "var(--bg-input)",
                lineHeight: 1.6,
                resize: "vertical",
                marginBottom: 20,
                fontFamily: "var(--font-body)",
              }}
            />

            {submitError && (
              <div
                style={{
                  background: "var(--bg-error)",
                  border: "1px solid var(--bg-error-border)",
                  borderRadius: 9,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--error-text)",
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
            <div style={{ fontSize: 36, color: "var(--success-text)", marginBottom: 14 }}>◈</div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Submitted
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28 }}>
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
