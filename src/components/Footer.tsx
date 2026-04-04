"use client";

interface FooterProps {
  onContact: () => void;
}

export default function Footer({ onContact }: FooterProps) {
  return (
    <div
      style={{
        borderTop: "1px solid #E5E7EB",
        marginTop: 40,
        padding: "20px 20px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            background: "#1A2744",
            color: "#fff",
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: 1,
          }}
        >
          B/B
        </span>
        <a
          href="https://venmo.com/sparksopedia"
          target="_blank"
          rel="noopener noreferrer"
          className="venmo-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#C8922A",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          ♥ Support on Venmo
        </a>
        <button
          onClick={onContact}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#9CA3AF",
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.15s",
          }}
          className="footer-link"
        >
          Contact
        </button>
      </div>
      <p style={{ fontSize: 12, color: "#D1D5DB", textAlign: "center" }}>
        A free tool for product and strategy teams. ·{" "}
        <strong style={{ color: "#9CA3AF" }}>Build or Buy</strong>
      </p>
    </div>
  );
}
