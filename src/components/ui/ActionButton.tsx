import React from "react";

type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  fullWidth?: boolean;
};

export default function ActionButton({
  children,
  onClick,
  active = false,
  fullWidth = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        borderRadius: 18,
        padding: "14px 16px",
        border: `1px solid ${active ? "#3b82f6" : "rgba(255,255,255,0.10)"}`,
        background: active ? "rgba(59,130,246,0.08)" : "#000",
        color: active ? "#60a5fa" : "#fff",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}