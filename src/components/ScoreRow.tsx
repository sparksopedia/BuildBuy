"use client";

import { useState } from "react";
import type { Dimension, Scale } from "@/lib/constants";
import { pct } from "@/lib/utils";

interface ScoreRowProps {
  dim: Dimension;
  index: number;
  scale: Scale;
  value: number | "na" | undefined;
  onChange: (val: number | "na") => void;
}

function NAButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      className={`na-btn${active ? " na-active" : ""}`}
      onClick={onClick}
      style={{
        padding: "6px 10px",
        border: "1.5px solid #E5E7EB",
        borderRadius: 8,
        background: "#fff",
        fontSize: 11,
        fontWeight: 700,
        color: active ? "#374151" : "#9CA3AF",
        letterSpacing: 0.5,
        marginRight: 6,
        transition: "all 0.12s",
      }}
    >
      N/A
    </button>
  );
}

function NumericInput({ scale, value, onChange }: { scale: Scale; value: number | "na" | undefined; onChange: (val: number | "na") => void }) {
  const nums = Array.from({ length: scale.max - scale.min + 1 }, (_, j) => j + scale.min);
  return (
    <>
      <NAButton active={value === "na"} onClick={() => onChange("na")} />
      {nums.map((n) => {
        const sel = value === n;
        const ratio = pct(n, scale);
        const bg =
          ratio < 0.5
            ? `hsl(220, 72%, ${50 + ratio * 14}%)`
            : `hsl(${133 + ratio * 14}, 55%, ${42 + ratio * 8}%)`;
        return (
          <button
            key={n}
            className={`score-btn${sel ? " s-active" : ""}`}
            onClick={() => onChange(n)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1.5px solid ${sel ? bg : "#E5E7EB"}`,
              background: sel ? bg : "#fff",
              color: sel ? "#fff" : "#6B7280",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              transition: "all 0.12s",
              flexShrink: 0,
            }}
          >
            {n}
          </button>
        );
      })}
    </>
  );
}

function StarsInput({ value, onChange }: { value: number | "na" | undefined; onChange: (val: number | "na") => void }) {
  const [hover, setHover] = useState(0);
  const current = typeof value === "number" ? value : 0;
  return (
    <>
      <NAButton active={value === "na"} onClick={() => onChange("na")} />
      <div
        style={{ display: "flex", gap: 4, alignItems: "center" }}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= (hover || current);
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 28,
                lineHeight: 1,
                color: filled ? "#C8922A" : "#D1D5DB",
                transition: "color 0.1s, transform 0.1s",
                transform: filled ? "scale(1.1)" : "scale(1)",
                padding: 0,
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      {typeof value === "number" && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 600,
            color: "#C8922A",
            marginLeft: 8,
          }}
        >
          {value}/5
        </span>
      )}
    </>
  );
}

function ThumbsInput({ value, onChange }: { value: number | "na" | undefined; onChange: (val: number | "na") => void }) {
  return (
    <>
      <NAButton active={value === "na"} onClick={() => onChange("na")} />
      <button
        onClick={() => onChange(0)}
        style={{
          width: 48,
          height: 44,
          borderRadius: 10,
          border: `2px solid ${value === 0 ? "#DC2626" : "#E5E7EB"}`,
          background: value === 0 ? "#FEF2F2" : "#fff",
          fontSize: 22,
          cursor: "pointer",
          transition: "all 0.12s",
          transform: value === 0 ? "scale(1.08)" : "scale(1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        👎
      </button>
      <button
        onClick={() => onChange(1)}
        style={{
          width: 48,
          height: 44,
          borderRadius: 10,
          border: `2px solid ${value === 1 ? "#16A34A" : "#E5E7EB"}`,
          background: value === 1 ? "#F0FDF4" : "#fff",
          fontSize: 22,
          cursor: "pointer",
          transition: "all 0.12s",
          transform: value === 1 ? "scale(1.08)" : "scale(1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        👍
      </button>
      {typeof value === "number" && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: value === 1 ? "#16A34A" : "#DC2626",
            marginLeft: 6,
          }}
        >
          {value === 1 ? "Buy" : "Build"}
        </span>
      )}
    </>
  );
}

function SliderInput({ value, onChange }: { value: number | "na" | undefined; onChange: (val: number | "na") => void }) {
  const numVal = typeof value === "number" ? value : 5;
  const ratio = numVal / 10;
  const trackColor = ratio < 0.5
    ? `hsl(220, 72%, ${50 + ratio * 14}%)`
    : `hsl(${133 + ratio * 14}, 55%, ${42 + ratio * 8}%)`;
  return (
    <>
      <NAButton active={value === "na"} onClick={() => onChange("na")} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", flexShrink: 0 }}>
          Build
        </span>
        <div style={{ position: "relative", flex: 1, minWidth: 100 }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 6,
              borderRadius: 3,
              background: "#E5E7EB",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: `${ratio * 100}%`,
                height: "100%",
                borderRadius: 3,
                background: trackColor,
                transition: "width 0.05s",
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={typeof value === "number" ? Math.round(value * 10) : 50}
            onChange={(e) => {
              const rounded = Math.round(Number(e.target.value)) / 10;
              onChange(rounded);
            }}
            style={{
              width: "100%",
              appearance: "none",
              WebkitAppearance: "none",
              background: "transparent",
              cursor: "pointer",
              height: 24,
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#15803D", flexShrink: 0 }}>
          Buy
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15,
            fontWeight: 700,
            color: trackColor,
            width: 36,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {typeof value === "number" ? value.toFixed(1) : "—"}
        </span>
      </div>
    </>
  );
}

export default function ScoreRow({ dim, index, scale, value, onChange }: ScoreRowProps) {
  const type = scale.type || "numeric";
  return (
    <div className="rubric-row" style={{ padding: "14px 8px", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#1A2744",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {index}
        </span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2744", marginBottom: 3 }}>
            {dim.name}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{dim.desc}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          paddingLeft: 36,
          flexWrap: "wrap",
        }}
      >
        {type === "stars" && <StarsInput value={value} onChange={onChange} />}
        {type === "thumbs" && <ThumbsInput value={value} onChange={onChange} />}
        {type === "slider" && <SliderInput value={value} onChange={onChange} />}
        {type === "numeric" && <NumericInput scale={scale} value={value} onChange={onChange} />}
      </div>
    </div>
  );
}
