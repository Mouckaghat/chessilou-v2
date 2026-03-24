import React from "react";
import {
  Mic,
  Bot,
  Users,
  ChevronRight,
  Hand,
  Settings2,
  GraduationCap,
  Shield,
  Swords,
  Target,
} from "lucide-react";
import type { Lang, GameMode, OpponentMode, ControlMode } from "../data/translations";
import Panel from "./ui/Panel";
import ActionButton from "./ui/ActionButton";
import ModeCard from "./ui/ModeCard";

type SetupTexts = {
  setupTitle: string;
  languageLabel: string;
  modeTitle: string;
  opponentTitle: string;
  controlTitle: string;
  notationTitle: string;
  startGame: string;

  classic: string;
  learn: string;
  mate5: string;
  protect: string;
  battle: string;

  classicDesc: string;
  learnDesc: string;
  mate5Desc: string;
  protectDesc: string;
  battleDesc: string;

  local: string;
  ai: string;
  voice: string;
  quiet: string;

  langNames: Record<Lang, string>;
  flags: Record<Lang, string>;
  notationLegend: { code: string; label: string }[];
};

type SetupState = {
  gameMode: GameMode;
  opponentMode: OpponentMode;
  controlMode: ControlMode;
};

type SetupPanelProps = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  setup: SetupState;
  setSetup: React.Dispatch<React.SetStateAction<SetupState>>;
  texts: SetupTexts;
  onStartGame: () => void;
};

export default function SetupPanel({
  lang,
  setLang,
  setup,
  setSetup,
  texts,
  onStartGame,
}: SetupPanelProps) {
  return (
    <Panel title={texts.setupTitle}>
      <div style={{ display: "grid", gap: 28 }}>
        <div>
          <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>{texts.languageLabel}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {(["en", "fr", "de"] as Lang[]).map((languageKey) => (
              <ActionButton
                key={languageKey}
                onClick={() => setLang(languageKey)}
                active={lang === languageKey}
                fullWidth
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{texts.flags[languageKey]}</span>
                  <span>{texts.langNames[languageKey]}</span>
                </div>
              </ActionButton>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 18, fontWeight: 700 }}>
            <Settings2 size={18} /> {texts.modeTitle}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <ModeCard
              title={texts.classic}
              description={texts.classicDesc}
              icon={<Users size={18} />}
              active={setup.gameMode === "classic"}
              onClick={() => setSetup((s) => ({ ...s, gameMode: "classic" }))}
            />
            <ModeCard
              title={texts.learn}
              description={texts.learnDesc}
              icon={<GraduationCap size={18} />}
              active={setup.gameMode === "learn"}
              onClick={() => setSetup((s) => ({ ...s, gameMode: "learn" }))}
            />
            <ModeCard
              title={texts.mate5}
              description={texts.mate5Desc}
              icon={<Target size={18} />}
              active={setup.gameMode === "mate5"}
              onClick={() => setSetup((s) => ({ ...s, gameMode: "mate5" }))}
            />
            <ModeCard
              title={texts.protect}
              description={texts.protectDesc}
              icon={<Shield size={18} />}
              active={setup.gameMode === "protect"}
              onClick={() => setSetup((s) => ({ ...s, gameMode: "protect" }))}
            />
            <ModeCard
              title={texts.battle}
              description={texts.battleDesc}
              icon={<Swords size={18} />}
              active={setup.gameMode === "battle"}
              onClick={() => setSetup((s) => ({ ...s, gameMode: "battle" }))}
            />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 18, fontWeight: 700 }}>
            <Bot size={18} /> {texts.opponentTitle}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <ActionButton
              onClick={() => setSetup((s) => ({ ...s, opponentMode: "local" }))}
              active={setup.opponentMode === "local"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <Users size={18} /> {texts.local}
              </div>
            </ActionButton>

            <ActionButton
              onClick={() => setSetup((s) => ({ ...s, opponentMode: "ai" }))}
              active={setup.opponentMode === "ai"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <Bot size={18} /> {texts.ai}
              </div>
            </ActionButton>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>{texts.controlTitle}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <ActionButton
              onClick={() => setSetup((s) => ({ ...s, controlMode: "voice" }))}
              active={setup.controlMode === "voice"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <Mic size={18} /> {texts.voice}
              </div>
            </ActionButton>

            <ActionButton
              onClick={() => setSetup((s) => ({ ...s, controlMode: "quiet" }))}
              active={setup.controlMode === "quiet"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <Hand size={18} /> {texts.quiet}
              </div>
            </ActionButton>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>{texts.notationTitle}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12 }}>
            {texts.notationLegend.map((item) => (
              <div
                key={item.code}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 18,
                  padding: 14,
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#60a5fa", fontWeight: 800, fontSize: 20 }}>{item.code}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.90)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <ActionButton onClick={onStartGame} fullWidth active>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {texts.startGame} <ChevronRight size={18} />
          </div>
        </ActionButton>
      </div>
    </Panel>
  );
}