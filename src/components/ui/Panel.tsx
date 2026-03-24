import React from "react";

type PanelProps = {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export default function Panel({ title, right, children }: PanelProps) {
  return (
    <div
      style={{
        background: "#000",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}