type ModePreviewProps = {
  title: string;
  body: string;
};

export default function ModePreview({ title, body }: ModePreviewProps) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 18,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.82)", whiteSpace: "pre-wrap" }}>
        {body}
      </div>
    </div>
  );
}