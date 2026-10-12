import Link from "next/link";

export function ContentHeader() {
  return (
    <header
      style={{
        background: "var(--hero-bg)",
        padding: "20px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 12,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              padding: "4px 9px",
              borderRadius: 5,
              letterSpacing: 1,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            B/B
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
            Build or Buy
          </span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "var(--brand-accent)",
            padding: "8px 18px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Open Tool →
        </Link>
      </div>
    </header>
  );
}

export function ContentCTA() {
  return (
    <section
      style={{
        background: "var(--hero-bg)",
        borderRadius: 18,
        padding: "48px 30px",
        textAlign: "center",
        marginTop: 48,
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
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 12,
          position: "relative",
        }}
      >
        Ready to run your build vs. buy analysis?
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.65,
          maxWidth: 480,
          margin: "0 auto 24px",
          position: "relative",
        }}
      >
        Create a free rubric in under 2 minutes. Score dimensions, invite stakeholders,
        and export results — no signup required.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          background: "var(--brand-accent)",
          color: "#fff",
          borderRadius: 10,
          padding: "14px 36px",
          fontSize: 16,
          fontWeight: 600,
          textDecoration: "none",
          position: "relative",
        }}
      >
        Create Your Free Rubric →
      </Link>
    </section>
  );
}

export function ContentFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-default)",
        padding: "24px 20px 32px",
        textAlign: "center",
        marginTop: 48,
      }}
    >
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <Link href="/" className="footer-link">Home</Link>
        <Link href="/build-vs-buy-framework" className="footer-link">Framework Guide</Link>
        <Link href="/build-vs-buy-template" className="footer-link">Template</Link>
        <Link href="/make-or-buy-decision" className="footer-link">Make or Buy</Link>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-faint)" }}>
        A free tool for product and strategy teams. · <strong style={{ color: "var(--text-dim)" }}>Build or Buy</strong>
      </p>
    </footer>
  );
}
