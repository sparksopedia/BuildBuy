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
        padding: "24px 20px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
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
        <span style={{ color: "#E5E7EB" }}>·</span>
        <button
          onClick={onContact}
          style={{
            background: "#1A2744",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.15s",
          }}
          className="footer-contact-btn"
        >
          Contact Us
        </button>
        <span style={{ color: "#E5E7EB" }}>·</span>
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
            padding: "7px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          ♥ Support on Venmo
        </a>
      </div>
      <p style={{ fontSize: 12, color: "#D1D5DB", textAlign: "center" }}>
        A free tool for product and strategy teams. ·{" "}
        <strong style={{ color: "#9CA3AF" }}>Build or Buy</strong>
      </p>
    </div>
  );
}
