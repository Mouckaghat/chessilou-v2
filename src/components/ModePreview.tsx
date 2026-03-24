import React from "react";
import { Sparkles } from "lucide-react";

type ModePreviewProps = {
  title: string;
  body: string;
};

export default function ModePreview({ title, body }: ModePreviewProps) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(96,165,250,0.25)",
        background: "rgba(59,130,246,0.06)",
        padding: 24,
        lineHeight: 1.8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#60a5fa",
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        <Sparkles size={18} />
        {title}
      </div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.88)" }}>{body}</div>
    </div>
  );
}