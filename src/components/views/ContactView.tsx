"use client";

import { useState } from "react";
import { Card, FieldLabel, TextInput } from "@/components/Primitives";
import Footer from "@/components/Footer";

interface ContactViewProps {
  onNavigate: (view: string) => void;
}

async function submitContact({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const endpoint = "https://formspree.io/f/maqljyqd";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, subject, message, _replyto: email }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Submission failed (${res.status}): ${body}`);
  }
}

export default function ContactView({ onNavigate }: ContactViewProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<null | "sending" | "sent" | "error">(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "var(--font-body)",
        padding: "28px 20px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
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
            }}
          >
            Contact
          </span>
        </div>

        {contactStatus === "sent" ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 36, color: "var(--success-text)", marginBottom: 14 }}>◈</div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 10,
              }}
            >
              Message Sent
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24 }}>
              Thanks for reaching out — we&apos;ll get back to you soon.
            </p>
            <button className="btn-primary" onClick={() => onNavigate("home")}>
              ← Back to Home
            </button>
          </Card>
        ) : (
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
              Get in Touch
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 24,
                lineHeight: 1.65,
              }}
            >
              Have a question, feedback, or idea for Build or Buy? We&apos;d love to hear from you.
            </p>

            {contactStatus === "error" && (
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
                Something went wrong. Please try again or email us directly at
                sparksopedia@gmail.com
              </div>
            )}

            <FieldLabel>Your Name</FieldLabel>
            <TextInput
              placeholder="Jane Smith"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <FieldLabel>Email Address</FieldLabel>
            <TextInput
              placeholder="jane@company.com"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />

            <FieldLabel>
              Subject{" "}
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
              placeholder="e.g. Feature idea, bug report, general question"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
            />

            <FieldLabel>Message</FieldLabel>
            <textarea
              placeholder="Tell us what's on your mind…"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              rows={5}
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

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: 15 }}
              disabled={
                !contactName.trim() ||
                !contactEmail.trim() ||
                !contactMessage.trim() ||
                contactStatus === "sending"
              }
              onClick={async () => {
                setContactStatus("sending");
                try {
                  await submitContact({
                    name: contactName,
                    email: contactEmail,
                    subject: contactSubject,
                    message: contactMessage,
                  });
                  setContactStatus("sent");
                } catch {
                  setContactStatus("error");
                }
              }}
            >
              {contactStatus === "sending" ? "Sending…" : "Send Message →"}
            </button>
          </Card>
        )}

        <Footer onContact={() => {}} />
      </div>
    </div>
  );
}
