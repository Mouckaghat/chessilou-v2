import React from "react";

type ModeCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function ModeCard({
  title,
  description,
  icon,
  active = false,
  onClick,
}: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        borderRadius: 20,
        border: `1px solid ${active ? "rgba(96,165,250,0.75)" : "rgba(255,255,255,0.10)"}`,
        background: active ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
        color: "#fff",
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
          color: active ? "#60a5fa" : "#fff",
        }}
      >
        {icon}
        <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
        {description}
      </div>
    </button>
  );
}