type BrandHeaderProps = {
  appName: string;
  lobsterSrc: string;
  showBrandInfo: boolean;
  onToggle: () => void;
  texts: {
    brandShort: string;
    tagline: string;
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
  texts,
}: BrandHeaderProps) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div
        onClick={onToggle}
        style={{
          display: "grid",
          justifyItems: "center",
          textAlign: "center",
          gap: 12,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(37,99,235,0.12) 45%, rgba(37,99,235,0.00) 75%)",
            boxShadow:
              "0 0 25px rgba(37,99,235,0.55), 0 0 55px rgba(37,99,235,0.28), inset 0 0 18px rgba(147,197,253,0.18)",
            border: "1px solid rgba(96,165,250,0.35)",
          }}
        >
          <img
            src={lobsterSrc}
            alt={appName}
            style={{
              width: 108,
              height: 108,
              objectFit: "contain",
              filter: "drop-shadow(0 0 12px rgba(96,165,250,0.55))",
            }}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 34,
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
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {texts.tagline}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.48)",
              marginTop: 6,
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