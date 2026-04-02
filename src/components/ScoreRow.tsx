"use client";

import type { Dimension, Scale } from "@/lib/constants";
import { pct } from "@/lib/utils";

interface ScoreRowProps {
  dim: Dimension;
  index: number;
  scale: Scale;
  value: number | "na" | undefined;
  onChange: (val: number | "na") => void;
}

export default function ScoreRow({ dim, index, scale, value, onChange }: ScoreRowProps) {
  const nums = Array.from({ length: scale.max - scale.min + 1 }, (_, j) => j + scale.min);
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
        <button
          className={`na-btn${value === "na" ? " na-active" : ""}`}
          onClick={() => onChange("na")}
          style={{
            padding: "6px 10px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 8,
            background: "#fff",
            fontSize: 11,
            fontWeight: 700,
            color: value === "na" ? "#374151" : "#9CA3AF",
            letterSpacing: 0.5,
            marginRight: 6,
            transition: "all 0.12s",
          }}
        >
          N/A
        </button>
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
      </div>
    </div>
  );
}
