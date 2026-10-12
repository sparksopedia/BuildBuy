"use client";

import ThemeToggle from "./ThemeToggle";

interface FooterProps {
  onContact: () => void;
}

export default function Footer({ onContact }: FooterProps) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--border-default)",
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
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            background: "var(--brand-navy)",
            color: "var(--bg-card)",
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: 1,
          }}
        >
          B/B
        </span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <button
          onClick={onContact}
          style={{
            background: "var(--brand-navy)",
            color: "var(--bg-card)",
            border: "none",
            borderRadius: 7,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "background 0.15s",
          }}
          className="footer-contact-btn"
        >
          Contact Us
        </button>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <a
          href="https://donate.stripe.com/eVq3cxbrpbp732g8Ra0Ny00"
          target="_blank"
          rel="noopener noreferrer"
          className="donate-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--brand-accent)",
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
          ♥ Support
        </a>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <ThemeToggle />
      </div>
      <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>
        A free tool for product and strategy teams. ·{" "}
        <strong style={{ color: "var(--text-dim)" }}>Build or Buy</strong>
      </p>
    </div>
  );
}
