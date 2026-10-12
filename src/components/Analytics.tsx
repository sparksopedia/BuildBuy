"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-HR1QMG7FG6";
const CONSENT_KEY = "bb-cookie-consent";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {}
  return null;
}

export default function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(readConsent());
  }, []);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, "granted"); } catch {}
    setConsent("granted");
  }

  function decline() {
    try { localStorage.setItem(CONSENT_KEY, "denied"); } catch {}
    setConsent("denied");
  }

  if (!mounted) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {consent === null && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "var(--consent-bg)",
            borderTop: "1px solid var(--consent-border)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.25)",
            fontFamily: "var(--font-body)",
          }}
        >
          <p
            style={{
              color: "var(--consent-text)",
              fontSize: 14,
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 560,
            }}
          >
            We use cookies to understand how visitors use this site and improve
            the experience.{" "}
            <span style={{ color: "var(--consent-text-muted)", fontSize: 13 }}>
              No personal data is sold or shared with third parties.
            </span>
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={accept}
              style={{
                background: "var(--brand-accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
                fontFamily: "var(--font-body)",
              }}
              className="donate-btn"
            >
              Accept
            </button>
            <button
              onClick={decline}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                const b = e.target as HTMLButtonElement;
                b.style.borderColor = "rgba(255,255,255,0.4)";
                b.style.color = "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={(e) => {
                const b = e.target as HTMLButtonElement;
                b.style.borderColor = "rgba(255,255,255,0.2)";
                b.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
