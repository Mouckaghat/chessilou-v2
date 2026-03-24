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
    <div style={{ marginBottom: 24 }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <img
          src={lobsterSrc}
          alt={appName}
          style={{ width: 56, height: 56, objectFit: "contain" }}
        />
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{texts.brandShort}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.70)" }}>
            {texts.tagline}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
            {texts.brandClickHint}
          </div>
        </div>
      </div>

      {showBrandInfo && (
        <div
          style={{
            marginTop: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,0.03)",
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