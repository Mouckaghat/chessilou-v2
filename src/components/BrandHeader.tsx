type BrandHeaderProps = {
  appName: string;
  lobsterSrc: string;
  showBrandInfo: boolean;
  onToggle: () => void;
  isVoiceLive?: boolean;
  texts: {
    brandShort: string;
    tagline: string;
    dedication: string;
    brandClickHint: string;
    brandTitle: string;
    brandSubtitle: string;
    brandBody1: string;
    brandBody2: string;
    brandBody3: string;
  };
};

export default function BrandHeader({
  appName,
  lobsterSrc,
  showBrandInfo,
  onToggle,
  isVoiceLive = false,
  texts,
}: BrandHeaderProps) {
  return (
    <div style={{ marginBottom: 30 }}>
      <style>
        {`
          @keyframes lobsterHaloBreath {
            0% {
              box-shadow:
                0 0 18px rgba(37,99,235,0.28),
                0 0 40px rgba(37,99,235,0.14);
              transform: scale(1);
            }
            50% {
              box-shadow:
                0 0 34px rgba(37,99,235,0.50),
                0 0 95px rgba(37,99,235,0.26);
              transform: scale(1.015);
            }
            100% {
              box-shadow:
                0 0 18px rgba(37,99,235,0.28),
                0 0 40px rgba(37,99,235,0.14);
              transform: scale(1);
            }
          }

          @keyframes lobsterHoverPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes liveBadgePulse {
            0% {
              opacity: 0.8;
              box-shadow: 0 0 0 rgba(239,68,68,0.0);
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 18px rgba(239,68,68,0.45);
            }
            100% {
              opacity: 0.8;
              box-shadow: 0 0 0 rgba(239,68,68,0.0);
            }
          }

          .lobster-brand-shell {
            position: relative;
            display: inline-grid;
            justify-items: center;
            animation: lobsterHaloBreath 4.8s ease-in-out infinite;
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          }

          .lobster-brand-shell:hover {
            animation:
              lobsterHaloBreath 4.8s ease-in-out infinite,
              lobsterHoverPulse 0.9s ease-in-out infinite;
          }

          .lobster-live-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(239,68,68,0.96);
            color: white;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.8px;
            border: 1px solid rgba(255,255,255,0.25);
            animation: liveBadgePulse 1.4s ease-in-out infinite;
          }
        `}
      </style>

      <div
        onClick={onToggle}
        style={{
          display: "grid",
          justifyItems: "center",
          textAlign: "center",
          gap: 14,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          className="lobster-brand-shell"
          style={{
            padding: 18,
            borderRadius: 20,
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(96,165,250,0.35)",
          }}
        >
          {isVoiceLive && <div className="lobster-live-badge">LIVE</div>}

          <img
            src={lobsterSrc}
            alt={appName}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              filter: "drop-shadow(0 0 12px rgba(96,165,250,0.55))",
            }}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: 0.4,
            }}
          >
            {texts.brandShort}
          </div>

          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.82)",
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {texts.tagline}
          </div>

          <div
            style={{
              fontSize: 14,
              color: "#93c5fd",
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            {texts.dedication}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.48)",
              marginTop: 8,
            }}
          >
            {texts.brandClickHint}
          </div>
        </div>
      </div>

      {showBrandInfo && (
        <div
          style={{
            marginTop: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,0.03)",
            maxWidth: 900,
            marginInline: "auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
            {texts.brandTitle}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.70)", marginBottom: 12 }}>
            {texts.brandSubtitle}
          </div>
          <div style={{ display: "grid", gap: 10, lineHeight: 1.7 }}>
            <div>{texts.brandBody1}</div>
            <div>{texts.brandBody2}</div>
            <div>{texts.brandBody3}</div>
          </div>
        </div>
      )}
    </div>
  );
}