"use client";

import React from "react";

export function Card({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 16,
        padding: 28,
        boxShadow: "var(--shadow-card)",
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

export function TextInput({
  style = {},
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { style?: React.CSSProperties }) {
  return (
    <input
      style={{
        display: "block",
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid var(--border-default)",
        borderRadius: 9,
        fontSize: 15,
        color: "var(--text-primary)",
        background: "var(--bg-input)",
        marginBottom: 16,
        ...style,
      }}
      {...props}
    />
  );
}

export function Divider() {
  return <div style={{ borderTop: "1px solid var(--border-light)", margin: "20px 0" }} />;
}
