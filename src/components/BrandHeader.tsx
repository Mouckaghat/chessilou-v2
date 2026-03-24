import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type BrandTexts = {
  brandShort: string;
  tagline: string;
  brandClickHint: string;
  brandTitle: string;
  brandSubtitle: string;
  brandBody1: string;
  brandBody2: string;
  brandBody3: string;
};

type BrandHeaderProps = {
  appName: string;
  lobsterSrc: string;
  texts: BrandTexts;
  showBrandInfo: boolean;
  onToggle: () => void;
};

export default function BrandHeader({
  appName,
  lobsterSrc,
  texts,
  showBrandInfo,
  onToggle,
}: BrandHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
      <div
        onClick={onToggle}
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 48px",
          gap: 20,
          alignItems: "center",
          cursor: "pointer",
          border: showBrandInfo
            ? "1px solid rgba(96,165,250,0.45)"
            : "1px solid rgba(255,255,255,0.10)",
          borderRadius: 28,
          padding: 18,
          background: showBrandInfo ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)",
          boxShadow: showBrandInfo ? "0 0 28px rgba(59,130,246,0.20)" : "none",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            minHeight: 120,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <img
            src={lobsterSrc}
            alt="Blue Lobster"
            style={{ width: 90, height: 90, objectFit: "contain" }}
          />
        </div>

        <div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>♟️ {appName}</div>
          <div style={{ color: "rgba(255,255,255,0.92)", marginTop: 4, fontSize: 18, fontWeight: 700 }}>
            {texts.brandShort}
          </div>
          <div style={{ color: "rgba(255,255,255,0.80)", marginTop: 4, fontSize: 16 }}>
            {texts.tagline}
          </div>
          <div style={{ color: "#60a5fa", marginTop: 6, fontSize: 14, fontWeight: 600 }}>
            {texts.brandClickHint}
          </div>
        </div>

        <motion.div
          animate={{ rotate: showBrandInfo ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#60a5fa",
          }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {showBrandInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            style={{
              overflow: "hidden",
              marginTop: 16,
            }}
          >
            <div
              style={{
                border: "1px solid rgba(96,165,250,0.24)",
                borderRadius: 24,
                padding: 18,
                background: "rgba(255,255,255,0.03)",
                boxShadow: "0 0 26px rgba(59,130,246,0.10)",
                lineHeight: 1.8,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: "#60a5fa", marginBottom: 10 }}>
                {texts.brandTitle}
              </div>
              <div style={{ fontSize: 16, color: "#fff", marginBottom: 8 }}>
                {texts.brandSubtitle}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", marginBottom: 10 }}>
                {texts.brandBody1}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", marginBottom: 10 }}>
                {texts.brandBody2}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>
                {texts.brandBody3}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}