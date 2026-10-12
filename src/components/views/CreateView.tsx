"use client";

import { useState, lazy, Suspense } from "react";
import { Card, FieldLabel, TextInput, Divider } from "@/components/Primitives";
import { DIMS, SCALES, type Dimension, type Scale, type Rubric } from "@/lib/constants";
import { genCode } from "@/lib/utils";
import {
  createRubric,
  getSavedCustomDimensions,
  saveCustomDimension,
  deleteCustomDimension,
} from "@/lib/data";

const QRCode = lazy(() => import("react-qr-code"));

interface CreateViewProps {
  onNavigate: (view: string) => void;
  onRubricCreated: (rubric: Rubric) => void;
}

export default function CreateView({ onNavigate, onRubricCreated }: CreateViewProps) {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [selDims, setSelDims] = useState<string[]>([]);
  const [customDims, setCustomDims] = useState<Dimension[]>([]);
  const [savedCustomDims, setSavedCustomDims] = useState<Dimension[]>([]);
  const [newDimName, setNewDimName] = useState("");
  const [newDimDesc, setNewDimDesc] = useState("");
  const [scale, setScale] = useState<Scale>(SCALES[0]);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const toggleDim = (id: string) =>
    setSelDims((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : prev.length < 12
          ? [...prev, id]
          : prev
    );

  async function handleCreate() {
    setLoading(true);
    setCreateError(null);
    const id = genCode();
    const allDims = [...DIMS, ...customDims];
    const data: Rubric = {
      id,
      org: org.trim(),
      title,
      description: description.trim(),
      authorName: author,
      dimensions: selDims.map((sid) => allDims.find((d) => d.id === sid)!),
      scale,
      createdAt: new Date().toISOString(),
      hasPassword: !!password.trim(),
    };
    try {
      await createRubric(data, password.trim() || undefined);
      setCreatedId(id);
      setRubric(data);
      setStep(4);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to save rubric. Please try again."
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            className="nav-back"
            onClick={() => onNavigate("home")}
            style={{ fontSize: 13, color: "var(--text-dim)", background: "none", border: "none" }}
          >
            ← Home
          </button>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
              flex: 1,
            }}
          >
            Create Rubric
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  background: step > n ? "var(--brand-accent)" : step === n ? "var(--brand-navy)" : "var(--border-default)",
                  color: step >= n ? "#fff" : "var(--text-dim)",
                  transition: "all 0.2s",
                }}
              >
                {step > n ? "✓" : n}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Define the Evaluation
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 22,
                lineHeight: 1.65,
              }}
            >
              Name the capability or product under evaluation. This context will be shown to all
              evaluators when they open the rubric.
            </p>

            <FieldLabel>
              Organization / Team{" "}
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
            <TextInput
              placeholder="e.g. Acme Corp, Platform Engineering"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />

            <FieldLabel>Capability or Product Being Evaluated</FieldLabel>
            <TextInput
              placeholder="e.g. Customer Data Platform, AI Coaching Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FieldLabel>
              Purpose / Evaluation Context{" "}
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
            <textarea
              placeholder="Describe what you're evaluating and why — e.g. 'We are assessing whether to build a re-engagement nudge engine internally or purchase a commercial solution. This rubric will inform the Q3 platform roadmap decision.'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
              }}
            />

            <FieldLabel>Your Name (Rubric Author)</FieldLabel>
            <TextInput
              placeholder="e.g. Sarah Chen"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <FieldLabel>
              Rubric Password{" "}
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
            <TextInput
              type="password"
              placeholder="Protect results from unauthorized access"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: -12, marginBottom: 20, lineHeight: 1.5 }}>
              When set, a password is required to view results. Anyone with the code can still submit evaluations.
            </p>

            <Divider />
            <FieldLabel>Scoring Scale</FieldLabel>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              Each dimension will be scored on this scale.
              <strong style={{ color: "var(--build-color)" }}> Lower scores favor building internally</strong>;
              <strong style={{ color: "var(--buy-color)" }}>
                {" "}
                higher scores favor the commercial solution
              </strong>
              . Evaluators can always select <strong>N/A</strong> if a dimension doesn&apos;t apply.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {SCALES.map((s) => (
                <button
                  key={s.label}
                  className={`scale-pill${scale.label === s.label ? " scale-on" : ""}`}
                  onClick={() => setScale(s)}
                  style={{
                    padding: "9px 14px",
                    border: "1.5px solid var(--border-default)",
                    borderRadius: 9,
                    background: "var(--bg-card)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>{s.note}</span>
                </button>
              ))}
            </div>
            <div
              style={{
                background: "var(--bg-card-alt)",
                borderRadius: 9,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 24,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span>
                <strong style={{ color: "var(--text-dim)" }}>N/A</strong> = Cannot assess
              </span>
              <span style={{ color: "var(--border-default)" }}>·</span>
              <span>
                <strong
                  style={{ fontFamily: "var(--font-mono)", color: "var(--build-color)" }}
                >
                  {scale.buildLabel}
                </strong>{" "}
                = Build internally
              </span>
              <span style={{ color: "var(--border-default)" }}>·</span>
              <span>
                <strong
                  style={{ fontFamily: "var(--font-mono)", color: "var(--buy-color)" }}
                >
                  {scale.buyLabel}
                </strong>{" "}
                = Buy commercially
              </span>
            </div>

            <button
              className="btn-primary"
              disabled={!title.trim() || !author.trim()}
              onClick={async () => {
                const saved = await getSavedCustomDimensions(author.trim().toLowerCase());
                setSavedCustomDims(saved);
                setStep(2);
              }}
            >
              Select Dimensions →
            </button>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Select Evaluation Dimensions
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 6,
                lineHeight: 1.65,
              }}
            >
              Choose from the library below, or add your own custom dimensions at the bottom.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {selDims.length}/12
              </span>{" "}
              selected
              {customDims.length > 0 && (
                <span style={{ marginLeft: 8, color: "var(--brand-accent)", fontWeight: 600 }}>
                  · {customDims.filter((d) => selDims.includes(d.id)).length} custom
                </span>
              )}
            </p>

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 10,
              }}
            >
              Library Dimensions
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
                gap: 9,
                marginBottom: 24,
              }}
            >
              {DIMS.map((d) => {
                const sel = selDims.includes(d.id);
                const atMax = !sel && selDims.length >= 12;
                return (
                  <button
                    key={d.id}
                    className={`dim-btn${sel ? " sel" : ""}`}
                    onClick={() => toggleDim(d.id)}
                    disabled={atMax}
                    style={{
                      padding: 12,
                      border: "1.5px solid var(--border-default)",
                      borderRadius: 10,
                      background: "var(--bg-card)",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      opacity: atMax ? 0.35 : 1,
                      cursor: atMax ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: sel ? "var(--text-primary)" : "var(--text-faint)",
                        fontWeight: 700,
                      }}
                    >
                      {sel ? "✓" : "○"}
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}
                    >
                      {d.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4 }}>
                      {d.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom dimensions */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 20, marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 12,
                }}
              >
                Custom Dimensions
              </div>

              {customDims.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
                    gap: 9,
                    marginBottom: 16,
                  }}
                >
                  {customDims.map((d) => {
                    const sel = selDims.includes(d.id);
                    const atMax = !sel && selDims.length >= 12;
                    return (
                      <div key={d.id} style={{ position: "relative" }}>
                        <button
                          className={`dim-btn${sel ? " sel" : ""}`}
                          onClick={() => toggleDim(d.id)}
                          disabled={atMax}
                          style={{
                            width: "100%",
                            padding: 12,
                            paddingRight: 28,
                            border: "1.5px solid var(--brand-accent)",
                            borderRadius: 10,
                            background: sel ? "var(--bg-custom-dim-sel)" : "var(--bg-custom-dim)",
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            opacity: atMax ? 0.35 : 1,
                            cursor: atMax ? "not-allowed" : "pointer",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                fontSize: 12,
                                color: sel ? "var(--brand-accent)" : "var(--text-faint)",
                                fontWeight: 700,
                              }}
                            >
                              {sel ? "✓" : "○"}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                background: "var(--badge-bg)",
                                color: "var(--badge-text)",
                                padding: "1px 5px",
                                borderRadius: 3,
                                letterSpacing: 0.3,
                                textTransform: "uppercase",
                              }}
                            >
                              Custom
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              lineHeight: 1.3,
                            }}
                          >
                            {d.name}
                          </span>
                          {d.desc && (
                            <span style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4 }}>
                              {d.desc}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setCustomDims((prev) => prev.filter((cd) => cd.id !== d.id));
                            setSelDims((prev) => prev.filter((sid) => sid !== d.id));
                          }}
                          style={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "var(--bg-error)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            color: "var(--error-text)",
                            lineHeight: 1,
                            fontWeight: 700,
                          }}
                          title="Remove dimension"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Saved custom library */}
              {savedCustomDims.filter((sd) => !customDims.find((cd) => cd.name === sd.name))
                .length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--brand-accent)",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 10,
                    }}
                  >
                    Your Saved Dimensions
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
                      gap: 9,
                    }}
                  >
                    {savedCustomDims
                      .filter((sd) => !customDims.find((cd) => cd.name === sd.name))
                      .map((sd) => {
                        const atMax = selDims.length >= 12;
                        return (
                          <div key={sd.id} style={{ position: "relative" }}>
                            <button
                              className="dim-btn"
                              onClick={() => {
                                const newDim = { ...sd, id: `custom_${Date.now()}` };
                                setCustomDims((prev) => [...prev, newDim]);
                                setSelDims((prev) =>
                                  atMax ? prev : [...prev, newDim.id]
                                );
                              }}
                              disabled={atMax}
                              style={{
                                width: "100%",
                                padding: 12,
                                paddingRight: 28,
                                border: "1.5px dashed var(--brand-accent)",
                                borderRadius: 10,
                                background: "var(--bg-custom-dim)",
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                                opacity: atMax ? 0.35 : 1,
                                cursor: atMax ? "not-allowed" : "pointer",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    background: "var(--badge-bg)",
                                    color: "var(--badge-text)",
                                    padding: "1px 5px",
                                    borderRadius: 3,
                                    letterSpacing: 0.3,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Saved
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "var(--text-primary)",
                                  lineHeight: 1.3,
                                }}
                              >
                                {sd.name}
                              </span>
                              {sd.desc && (
                                <span style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4 }}>
                                  {sd.desc}
                                </span>
                              )}
                            </button>
                            <button
                              onClick={async () => {
                                await deleteCustomDimension(sd.id);
                                setSavedCustomDims((prev) => prev.filter((d) => d.id !== sd.id));
                              }}
                              style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: "var(--bg-error)",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                color: "var(--error-text)",
                                fontWeight: 700,
                              }}
                              title="Remove from saved library"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Add custom dimension form */}
              {selDims.length < 12 ? (
                <div
                  style={{
                    background: "var(--bg-card-alt)",
                    border: "1.5px dashed var(--border-default)",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>
                    Add a custom dimension
                  </div>
                  <input
                    placeholder="Dimension name  e.g. Partner Ecosystem Fit"
                    value={newDimName}
                    onChange={(e) => setNewDimName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newDimName.trim()) e.preventDefault();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 12px",
                      border: "1.5px solid var(--border-default)",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      background: "var(--bg-input)",
                      marginBottom: 8,
                    }}
                  />
                  <input
                    placeholder="Guiding question  e.g. Would this capability benefit from partner integrations?"
                    value={newDimDesc}
                    onChange={(e) => setNewDimDesc(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newDimName.trim()) e.preventDefault();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 12px",
                      border: "1.5px solid var(--border-default)",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      background: "var(--bg-input)",
                      marginBottom: 10,
                    }}
                  />
                  <button
                    className="btn-outline"
                    style={{ padding: "7px 16px", fontSize: 13 }}
                    disabled={!newDimName.trim()}
                    onClick={async () => {
                      const id = `custom_${Date.now()}`;
                      const dim: Dimension = {
                        id,
                        name: newDimName.trim(),
                        desc: newDimDesc.trim(),
                        custom: true,
                      };
                      setCustomDims((prev) => [...prev, dim]);
                      setSelDims((prev) => [...prev, id]);
                      await saveCustomDimension(author.trim().toLowerCase(), dim);
                      const saved = await getSavedCustomDimensions(author.trim().toLowerCase());
                      setSavedCustomDims(saved);
                      setNewDimName("");
                      setNewDimDesc("");
                    }}
                  >
                    + Add Dimension
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--text-dim)", fontStyle: "italic" }}>
                  Maximum of 12 dimensions reached. Remove one to add a custom dimension.
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn-primary"
                disabled={selDims.length === 0}
                onClick={() => setStep(3)}
              >
                Review & Create →
              </button>
            </div>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Review & Create
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              Confirm before generating your share code.
            </p>
            <div
              style={{
                background: "var(--bg-card-alt)",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
              }}
            >
              {(
                [
                  org && ["Organization", org],
                  ["Capability / Product", title],
                  description && ["Context", description],
                  ["Author", author],
                  [
                    "Scale",
                    `${scale.label}  (N/A · ${scale.buildLabel} = Build → ${scale.buyLabel} = Buy)`,
                  ],
                  ["Dimensions", `${selDims.length} selected`],
                  ["Password", password.trim() ? "Protected" : "None (public results)"],
                ].filter(Boolean) as [string, string][]
              ).map(
                ([k, v]) =>
                  v && (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "7px 0",
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-dim)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        {k}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          textAlign: "right",
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  )
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 24 }}>
              {selDims.map((sid, i) => {
                const d = [...DIMS, ...customDims].find((d) => d.id === sid);
                return (
                  <div key={sid} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "var(--brand-navy)",
                        color: "var(--bg-card)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{d?.name}</span>
                    {d?.custom && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          background: "var(--badge-bg)",
                          color: "var(--badge-text)",
                          padding: "2px 6px",
                          borderRadius: 3,
                          letterSpacing: 0.3,
                          textTransform: "uppercase",
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {createError && (
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
                {createError}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" onClick={() => setStep(2)}>
                ← Edit
              </button>
              <button className="btn-primary" onClick={handleCreate} disabled={loading}>
                {loading ? "Creating…" : "Create Rubric →"}
              </button>
            </div>
          </Card>
        )}

        {/* Step 4 — created */}
        {step === 4 && createdId && rubric && (
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, color: "var(--brand-accent)", marginBottom: 12 }}>✦</div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Rubric Created
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 28,
                lineHeight: 1.65,
                maxWidth: 420,
                margin: "0 auto 28px",
              }}
            >
              Share this code with your Product, Engineering, Operations, and Business stakeholders.
              Anyone with the code can submit their evaluation or view aggregated results.
            </p>
            <div
              style={{
                background: "var(--bg-page)",
                borderRadius: 14,
                padding: "22px 20px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: 10,
                  color: "var(--text-primary)",
                }}
              >
                {createdId}
              </span>
              <button
                className="copy-btn"
                onClick={async () => {
                  await navigator.clipboard.writeText(createdId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  padding: "7px 14px",
                  border: "1.5px solid var(--border-default)",
                  borderRadius: 7,
                  background: "var(--bg-card)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 20 }}>
              Retrieve this rubric anytime from Home → My Rubrics using your author name.
            </p>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                padding: 16,
                display: "inline-block",
                marginBottom: 12,
              }}
            >
              <Suspense fallback={<div style={{ width: 140, height: 140 }} />}>
                <QRCode
                  value={`https://buildorbuy.app?code=${createdId}`}
                  size={140}
                  bgColor="#FFFFFF"
                  fgColor="#1A2744"
                />
              </Suspense>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 28 }}>
              Scan to open the evaluation directly on any device.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn-outline"
                onClick={() => {
                  onRubricCreated(rubric);
                  onNavigate("results");
                }}
              >
                View Results
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  onRubricCreated(rubric);
                  onNavigate("evaluate-as-author");
                }}
              >
                Score It Yourself →
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
