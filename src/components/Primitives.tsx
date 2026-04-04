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
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
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
        color: "#6B7280",
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
        border: "1.5px solid #E5E7EB",
        borderRadius: 9,
        fontSize: 15,
        color: "#1A2744",
        marginBottom: 16,
        ...style,
      }}
      {...props}
    />
  );
}

export function Divider() {
  return <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />;
}
