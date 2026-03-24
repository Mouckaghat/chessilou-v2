import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chess } from "chess.js";
import {
  RotateCcw,
  Undo2,
  Volume2,
  Hand,
  Sparkles,
  Bot,
  Users,
  StopCircle,
  Play,
  Flag,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
} from "lucide-react";
import lobster from "./assets/blue_lobster.png";
import {
  translations,
  type Lang,
  type GameMode,
  type OpponentMode,
  type ControlMode,
} from "./data/translations";
import BrandHeader from "./components/BrandHeader";
import Panel from "./components/ui/Panel";
import ActionButton from "./components/ui/ActionButton";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const BRAND = {
  name: "Chessilou",
};

type SetupState = {
  gameMode: GameMode;
  opponentMode: OpponentMode;
  controlMode: ControlMode;
};

type TutorialExample = {
  source: string;
  targets: string[];
  label: string;
};

type WinChances = {
  white: number;
  black: number;
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

function randomAiMove(game: Chess) {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;

  const scored = moves.map((m) => {
    let score = Math.random();

    if (m.captured) score += 10;
    if (m.promotion) score += 8;

    const test = new Chess(game.fen());
    test.move(m);

    if (test.isCheckmate()) score += 1000;
    else if (test.inCheck()) score += 5;

    const centerBonus = ["d4", "d5", "e4", "e5"].includes(m.to) ? 0.8 : 0;
    score += centerBonus;

    return { move: m, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}

function getRandomTutorialExample(): TutorialExample {
  const examples: TutorialExample[] = [
    { source: "g1", targets: ["f3", "h3"], label: "White knight example" },
    { source: "b1", targets: ["a3", "c3"], label: "White knight example" },
    { source: "e2", targets: ["e3", "e4"], label: "White pawn example" },
    { source: "d2", targets: ["d3", "d4"], label: "White pawn example" },
    { source: "c2", targets: ["c3", "c4"], label: "White pawn example" },
    { source: "f2", targets: ["f3", "f4"], label: "White pawn example" },
  ];

  return examples[Math.floor(Math.random() * examples.length)];
}

function squareColor(square: string) {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]) - 1;
  return (file + rank) % 2 === 0 ? "light" : "dark";
}

function getPieceSymbol(piece: { type: string; color: string } | null) {
  if (!piece) return "";

  const symbols: Record<string, { w: string; b: string }> = {
    p: { w: "♙", b: "♟" },
    r: { w: "♖", b: "♜" },
    n: { w: "♘", b: "♞" },
    b: { w: "♗", b: "♝" },
    q: { w: "♕", b: "♛" },
    k: { w: "♔", b: "♚" },
  };

  return symbols[piece.type]?.[piece.color as "w" | "b"] ?? "";
}

function getUiText(lang: Lang) {
  if (lang === "fr") {
    return {
      playerType: "Type de joueur",
      twoPlayers: "Deux joueurs",
      versusAi: "Contre Loulu",
      localClassicOnly: "En mode deux joueurs, seul le mode classique est disponible.",
      chooseMode: "Mode de jeu",
      stop: "Stop",
      start: "Démarrer",
      boardHint: "Touchez une pièce ou glissez-déposez-la.",
      classicAvailable: "Classique disponible",
      louluModesAvailable: "Tous les modes Loulu disponibles",
      dragFallback: "Le glisser-déposer reste disponible.",
      aiThinking: "Loulu réfléchit...",
      mateIn5: "Mat en 5",
      godSaveTheKing: "Que Dieu sauve le Roi",
      battleRoyal: "Bataille Royale",
      louluPlayed: "Loulu a joué",
      louluCheckmated: "Loulu est échec et mat.",
      youCheckmated: "Vous êtes échec et mat.",
      louluResigns: "Loulu abandonne.",
      youResign: "Vous abandonnez.",
      boardSize: "Taille de l’échiquier",
      winGauge: "Balance de la partie",
      thresholdWarning: "Seuil critique atteint",
      resign: "Abandonner",
      boardStatus: "Statut",
      whiteLabel: "Blanc",
      blackLabel: "Noir",
      hiddenOptions: "Options cachées",
      helperZone: "Aide au premier coup",
      minimalControls: "Commandes",
      voiceStart: "Activer la voix",
      voiceStop: "Arrêter la voix",
      voiceUnsupported: "La reconnaissance vocale n’est pas disponible dans ce navigateur.",
      voiceHeard: "Entendu",
      modeClassicHelp: "Partie classique normale.",
      modeLearnHelp: "Mode apprentissage : aide visuelle plus présente.",
      modeMate5Help: "Prototype : attaque guidée, objectif tactique offensif.",
      modeProtectHelp: "Prototype : survivez et protégez votre roi.",
      modeBattleHelp: "Prototype : bataille déséquilibrée et plus sauvage.",
    };
  }

  if (lang === "de") {
    return {
      playerType: "Spielertyp",
      twoPlayers: "Zwei Spieler",
      versusAi: "Gegen Loulu",
      localClassicOnly: "Im Zwei-Spieler-Modus ist nur Klassisch verfügbar.",
      chooseMode: "Spielmodus",
      stop: "Stopp",
      start: "Starten",
      boardHint: "Tippe auf eine Figur oder ziehe sie per Drag-and-Drop.",
      classicAvailable: "Klassisch verfügbar",
      louluModesAvailable: "Alle Loulu-Modi verfügbar",
      dragFallback: "Drag-and-Drop bleibt verfügbar.",
      aiThinking: "Loulu denkt nach...",
      mateIn5: "Matt in 5",
      godSaveTheKing: "Gott schütze den König",
      battleRoyal: "Battle Royal",
      louluPlayed: "Loulu spielte",
      louluCheckmated: "Loulu ist schachmatt.",
      youCheckmated: "Du bist schachmatt.",
      louluResigns: "Loulu gibt auf.",
      youResign: "Du gibst auf.",
      boardSize: "Brettgröße",
      winGauge: "Spielbalance",
      thresholdWarning: "Kritischer Schwellenwert erreicht",
      resign: "Aufgeben",
      boardStatus: "Status",
      whiteLabel: "Weiß",
      blackLabel: "Schwarz",
      hiddenOptions: "Versteckte Optionen",
      helperZone: "Erster-Zug-Hilfe",
      minimalControls: "Steuerung",
      voiceStart: "Sprache aktivieren",
      voiceStop: "Sprache stoppen",
      voiceUnsupported: "Spracherkennung ist in diesem Browser nicht verfügbar.",
      voiceHeard: "Gehört",
      modeClassicHelp: "Normale klassische Partie.",
      modeLearnHelp: "Lernmodus: stärkere visuelle Hilfe.",
      modeMate5Help: "Prototyp: Angriffsszenario mit taktischem Ziel.",
      modeProtectHelp: "Prototyp: Überleben und den König schützen.",
      modeBattleHelp: "Prototyp: wildere, ungleichere Schlacht.",
    };
  }

  return {
    playerType: "Player type",
    twoPlayers: "Two players",
    versusAi: "Play vs Loulu",
    localClassicOnly: "In two-player mode, only Classic is available.",
    chooseMode: "Game mode",
    stop: "Stop",
    start: "Start game",
    boardHint: "Tap a piece or drag and drop it.",
    classicAvailable: "Classic available",
    louluModesAvailable: "All Loulu modes available",
    dragFallback: "Drag and drop remains available.",
    aiThinking: "Loulu is thinking...",
    mateIn5: "Mate in 5",
    godSaveTheKing: "God save the King",
    battleRoyal: "Battle Royal",
    louluPlayed: "Loulu played",
    louluCheckmated: "Loulu is checkmated.",
    youCheckmated: "You are checkmated.",
    louluResigns: "Loulu resigns.",
    youResign: "You resign.",
    boardSize: "Board size",
    winGauge: "Game balance",
    thresholdWarning: "Critical threshold reached",
    resign: "Resign",
    boardStatus: "Status",
    whiteLabel: "White",
    blackLabel: "Black",
    hiddenOptions: "Hidden options",
    helperZone: "First move help",
    minimalControls: "Controls",
    voiceStart: "Start voice",
    voiceStop: "Stop voice",
    voiceUnsupported: "Speech recognition is not available in this browser.",
    voiceHeard: "Heard",
    modeClassicHelp: "Normal classic game.",
    modeLearnHelp: "Learning mode: stronger visual help.",
    modeMate5Help: "Prototype: attacking scenario with tactical objective.",
    modeProtectHelp: "Prototype: survive and protect your king.",
    modeBattleHelp: "Prototype: wilder, more unbalanced battle.",
  };
}

function getWinnerLabel(lang: Lang, color: "w" | "b") {
  if (lang === "fr") return color === "w" ? "Blanc" : "Noir";
  if (lang === "de") return color === "w" ? "Weiß" : "Schwarz";
  return color === "w" ? "White" : "Black";
}

function getAiDelay(gameMode: GameMode) {
  switch (gameMode) {
    case "classic":
      return 2000;
    case "learn":
      return 1400;
    case "mate5":
      return 1800;
    case "protect":
      return 2000;
    case "battle":
      return 2200;
    default:
      return 1800;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function evaluatePosition(game: Chess) {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? -999 : 999;
  }

  if (game.isDraw() || game.isStalemate() || game.isInsufficientMaterial()) {
    return 0;
  }

  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3.2,
    r: 5,
    q: 9,
    k: 0,
  };

  let score = 0;
  const board = game.board();

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const value = pieceValues[piece.type] ?? 0;
      score += piece.color === "w" ? value : -value;
    }
  }

  const mobility = game.moves().length * 0.03;
  score += game.turn() === "w" ? mobility : -mobility;

  if (game.inCheck()) {
    score += game.turn() === "w" ? -0.4 : 0.4;
  }

  return score;
}

function getWinChances(game: Chess): WinChances {
  if (game.isCheckmate()) {
    return game.turn() === "b"
      ? { white: 100, black: 0 }
      : { white: 0, black: 100 };
  }

  if (game.isDraw() || game.isStalemate() || game.isInsufficientMaterial()) {
    return { white: 50, black: 50 };
  }

  const evalScore = evaluatePosition(game);
  const whiteRaw = 50 + evalScore * 7.5;
  const white = Math.round(clamp(whiteRaw, 1, 99));
  const black = 100 - white;

  return { white, black };
}

function TugOfWarGauge({
  white,
  whiteLabel,
  blackLabel,
}: {
  white: number;
  whiteLabel: string;
  blackLabel: string;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "rgba(255,255,255,0.76)",
          fontWeight: 600,
        }}
      >
        <span>{whiteLabel}</span>
        <span>{blackLabel}</span>
      </div>

      <div
        style={{
          position: "relative",
          height: 18,
          borderRadius: 999,
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${white}%`,
            background: "#2563eb",
            transition: "width 300ms ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -2,
            bottom: -2,
            width: 4,
            background: "#ef4444",
            transform: "translateX(-50%)",
            borderRadius: 999,
            boxShadow: "0 0 10px rgba(239,68,68,0.5)",
          }}
        />
      </div>
    </div>
  );
}

function getModeStart(gameMode: GameMode) {
  switch (gameMode) {
    case "classic":
      return {
        fen: undefined as string | undefined,
        status: "Classic mode ready.",
      };
    case "learn":
      return {
        fen: undefined as string | undefined,
        status: "Learn mode ready.",
      };
    case "mate5":
      return {
        fen: "r1bq1rk1/pppp1ppp/2n5/4N3/2B1P3/8/PPPP1PPP/RNBQ1RK1 w - - 0 1",
        status: "Mate in 5 prototype ready.",
      };
    case "protect":
      return {
        fen: "4k3/8/8/8/8/2q5/4K3/8 w - - 0 1",
        status: "God save the King prototype ready.",
      };
    case "battle":
      return {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNQ w Qkq - 0 1",
        status: "Battle Royal prototype ready.",
      };
    default:
      return {
        fen: undefined as string | undefined,
        status: "Mode ready.",
      };
  }
}

function getVoiceLang(lang: Lang) {
  if (lang === "fr") return "fr-FR";
  if (lang === "de") return "de-DE";
  return "en-US";
}

function normalizeVoiceText(text: string) {
  return text
    .toLowerCase()
    .replace(/one/g, "1")
    .replace(/two/g, "2")
    .replace(/three/g, "3")
    .replace(/four/g, "4")
    .replace(/five/g, "5")
    .replace(/six/g, "6")
    .replace(/seven/g, "7")
    .replace(/eight/g, "8")
    .replace(/to/g, " ")
    .replace(/too/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVoiceMove(text: string, game: Chess) {
  const normalized = normalizeVoiceText(text);

  if (normalized.includes("castle kingside") || normalized.includes("short castle")) {
    const move = game.turn() === "w" ? { from: "e1", to: "g1" } : { from: "e8", to: "g8" };
    return move;
  }

  if (normalized.includes("castle queenside") || normalized.includes("long castle")) {
    const move = game.turn() === "w" ? { from: "e1", to: "c1" } : { from: "e8", to: "c8" };
    return move;
  }

  const matches = normalized.match(/[a-h][1-8]/g);
  if (matches && matches.length >= 2) {
    return { from: matches[0], to: matches[1] };
  }

  return null;
}

export default function ChessilouV2() {
  const [screen, setScreen] = useState<"setup" | "play">("setup");
  const [lang, setLang] = useState<Lang>("en");
  const [setup, setSetup] = useState<SetupState>({
    gameMode: "classic",
    opponentMode: "local",
    controlMode: "quiet",
  });

  const t = translations[lang];
  const ui = getUiText(lang);

  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const [status, setStatus] = useState(t.welcome);
  const [lastVoiceText, setLastVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showBrandInfo, setShowBrandInfo] = useState(false);
  const [tutorialExample, setTutorialExample] = useState<TutorialExample | null>(
    getRandomTutorialExample()
  );
  const [showQuietTutorial, setShowQuietTutorial] = useState(false);
  const [dragSourceSquare, setDragSourceSquare] = useState<string | null>(null);

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingAiFen, setPendingAiFen] = useState<string | null>(null);
  const [pendingAiSan, setPendingAiSan] = useState<string | null>(null);

  const [boardSize, setBoardSize] = useState(760);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (setup.opponentMode === "local" && setup.gameMode !== "classic") {
      setSetup((prev) => ({ ...prev, gameMode: "classic" }));
    }
  }, [setup.opponentMode, setup.gameMode]);

  useEffect(() => {
    setStatus((prev) => {
      if (
        prev === translations.en.welcome ||
        prev === translations.fr.welcome ||
        prev === translations.de.welcome
      ) {
        return t.welcome;
      }
      return prev;
    });
  }, [lang, t.welcome]);

  useEffect(() => {
    const shouldShow =
      screen === "play" &&
      setup.controlMode === "quiet" &&
      (setup.gameMode === "classic" || setup.gameMode === "learn") &&
      game.history().length === 0 &&
      !selectedSquare;

    setShowQuietTutorial(shouldShow || setup.gameMode === "learn");
  }, [screen, setup.controlMode, setup.gameMode, game, selectedSquare]);

  useEffect(() => {
    if (!isAiThinking || !pendingAiFen) return;

    const delay = getAiDelay(setup.gameMode);

    const timer = window.setTimeout(() => {
      const finalGame = new Chess(pendingAiFen);
      setGame(finalGame);
      setIsAiThinking(false);

      if (finalGame.isCheckmate()) {
        setStatus(ui.youCheckmated);
      } else if (finalGame.isDraw()) {
        setStatus(t.draw);
      } else {
        setStatus(`${ui.louluPlayed}: ${pendingAiSan}`);
      }

      setPendingAiFen(null);
      setPendingAiSan(null);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isAiThinking, pendingAiFen, pendingAiSan, setup.gameMode, t.draw, ui.louluPlayed, ui.youCheckmated]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const winChances = useMemo(() => getWinChances(game), [game]);
  const localizedTurn = useMemo(() => {
    if (lang === "fr") return game.turn() === "w" ? "Blanc" : "Noir";
    if (lang === "de") return game.turn() === "w" ? "Weiß" : "Schwarz";
    return game.turn() === "w" ? "White" : "Black";
  }, [game, lang]);

  const whiteResignThresholdReached = !game.isGameOver() && winChances.white <= 15;
  const blackResignThresholdReached = !game.isGameOver() && winChances.black <= 15;

  function clearSelection() {
    setSelectedSquare(null);
    setLegalTargets([]);
    setDragSourceSquare(null);
  }

  function stopVoiceRecognition() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }

  function restartGame() {
    const modeStart = getModeStart(setup.gameMode);
    const nextGame = modeStart.fen ? new Chess(modeStart.fen) : new Chess();

    setGame(nextGame);
    clearSelection();
    setStatus(
      setup.gameMode === "classic"
        ? ui.modeClassicHelp
        : setup.gameMode === "learn"
        ? ui.modeLearnHelp
        : setup.gameMode === "mate5"
        ? ui.modeMate5Help
        : setup.gameMode === "protect"
        ? ui.modeProtectHelp
        : ui.modeBattleHelp
    );
    setLastVoiceText("");
    setIsListening(false);
    setTutorialExample(getRandomTutorialExample());
    setShowQuietTutorial(
      setup.controlMode === "quiet" &&
        (setup.gameMode === "classic" || setup.gameMode === "learn")
    );
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);
    stopVoiceRecognition();
  }

  function stopGame() {
    stopVoiceRecognition();
    setLastVoiceText("");
    setScreen("setup");
    setGame(new Chess());
    clearSelection();
    setStatus(t.welcome);
    setTutorialExample(getRandomTutorialExample());
    setShowQuietTutorial(false);
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);
  }

  function finalizeHumanMove(nextGame: Chess, playedSan: string, moveColor: "w" | "b") {
    setGame(new Chess(nextGame.fen()));
    clearSelection();

    if (nextGame.isCheckmate()) {
      if (setup.opponentMode === "ai" && moveColor === "w") {
        setStatus(ui.louluCheckmated);
      } else {
        setStatus(`${t.checkmateDelivered} ${getWinnerLabel(lang, moveColor)}.`);
      }
      return;
    }

    if (nextGame.isDraw()) {
      setStatus(t.draw);
      return;
    }

    setStatus(`${t.movePlayed}: ${playedSan}`);
  }

  function applyAiIfNeeded(nextGame: Chess, justPlayedSan?: string) {
    if (setup.opponentMode !== "ai") return nextGame;
    if (nextGame.isGameOver()) return nextGame;

    const chancesAfterHumanMove = getWinChances(nextGame);

    if (chancesAfterHumanMove.black <= 5) {
      setStatus(ui.louluResigns);
      return nextGame;
    }

    const aiMove = randomAiMove(nextGame);
    if (!aiMove) return nextGame;

    const aiGame = new Chess(nextGame.fen());
    aiGame.move(aiMove);

    setIsAiThinking(true);
    setPendingAiFen(aiGame.fen());
    setPendingAiSan(aiMove.san);

    if (justPlayedSan) {
      setStatus(`${t.movePlayed}: ${justPlayedSan} • ${ui.aiThinking}`);
    } else {
      setStatus(ui.aiThinking);
    }

    return nextGame;
  }

  function getLegalMovesFrom(square: string) {
    return game.moves({ square: square as any, verbose: true }).map((m) => m.to);
  }

  function tryExecuteMove(from: string, to: string) {
    if (isAiThinking || game.isGameOver()) return false;

    const next = new Chess(game.fen());
    const move = next.move({
      from: from as any,
      to: to as any,
      promotion: "q",
    });

    if (!move) {
      setStatus(`${t.illegalMove}: ${from} → ${to}`);
      return false;
    }

    const playedSan = move.san;

    if (setup.opponentMode === "ai") {
      const after = applyAiIfNeeded(next, playedSan);
      if (after.isGameOver()) {
        finalizeHumanMove(after, playedSan, move.color as "w" | "b");
      } else {
        setGame(new Chess(after.fen()));
        clearSelection();
      }
      return true;
    }

    finalizeHumanMove(next, playedSan, move.color as "w" | "b");
    return true;
  }

  function handleVoiceTranscript(transcript: string) {
    setLastVoiceText(transcript);
    const parsed = parseVoiceMove(transcript, game);

    if (!parsed) {
      setStatus(`${ui.voiceHeard}: ${transcript}`);
      return;
    }

    const success = tryExecuteMove(parsed.from, parsed.to);
    if (!success) {
      setStatus(`${ui.voiceHeard}: ${transcript} • ${t.illegalMove}`);
    }
  }

  function startVoiceRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus(ui.voiceUnsupported);
      return;
    }

    stopVoiceRecognition();

    const recognition = new Recognition();
    recognition.lang = getVoiceLang(lang);
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus(ui.aiThinking === "Loulu is thinking..." ? "Listening..." : status);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0]?.transcript ?? "";
      if (transcript) {
        handleVoiceTranscript(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function toggleVoiceRecognition() {
    if (isListening) stopVoiceRecognition();
    else startVoiceRecognition();
  }

  function selectSquare(square: string) {
    if (isAiThinking || game.isGameOver()) return;

    if (showQuietTutorial && setup.gameMode !== "learn") {
      setShowQuietTutorial(false);
    }

    const piece = game.get(square as any);

    if (!selectedSquare) {
      if (!piece) {
        setStatus(`${t.noPieceOn} ${square}.`);
        return;
      }

      if (piece.color !== game.turn()) {
        setStatus(`${t.itIsTurn} ${localizedTurn} ${t.turn}.`.trim());
        return;
      }

      const moves = getLegalMovesFrom(square);

      if (!moves.length) {
        setStatus(`${t.noLegalMovesFrom} ${square}.`);
        return;
      }

      setSelectedSquare(square);
      setLegalTargets(moves);
      setStatus(`${t.selected} ${square} • ${t.legalTargets}: ${moves.join(", ")}`);
      return;
    }

    if (square === selectedSquare) {
      clearSelection();
      setStatus(t.selectionCleared);
      return;
    }

    const maybePiece = game.get(square as any);
    const success = tryExecuteMove(selectedSquare, square);

    if (!success && maybePiece && maybePiece.color === game.turn()) {
      const moves = getLegalMovesFrom(square);
      if (moves.length) {
        setSelectedSquare(square);
        setLegalTargets(moves);
        setStatus(`${t.selected} ${square} • ${t.legalTargets}: ${moves.join(", ")}`);
      }
    }
  }

  function moveByDrag(sourceSquare: string, targetSquare: string) {
    if (showQuietTutorial && setup.gameMode !== "learn") {
      setShowQuietTutorial(false);
    }
    tryExecuteMove(sourceSquare, targetSquare);
  }

  function undoMove() {
    const next = new Chess(game.fen());
    if (!next.history().length) return;

    next.undo();
    if (setup.opponentMode === "ai" && next.history().length) next.undo();

    setGame(new Chess(next.fen()));
    clearSelection();
    setStatus(t.lastMoveUndone);
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);

    if (setup.controlMode === "quiet" && next.history().length === 0) {
      setTutorialExample(getRandomTutorialExample());
      setShowQuietTutorial(true);
    }
  }

  function resignGame() {
    stopVoiceRecognition();
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);
    clearSelection();
    setStatus(ui.youResign);
  }

  const smallMuted: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(255,255,255,0.70)",
  };

  function renderSquare(square: string) {
    const piece = game.get(square as any);
    const symbol = getPieceSymbol(piece);
    const isSelected = selectedSquare === square;
    const isLegalTarget = legalTargets.includes(square);
    const isTutorialSource =
      showQuietTutorial && tutorialExample && !selectedSquare && tutorialExample.source === square;
    const isTutorialTarget =
      showQuietTutorial &&
      tutorialExample &&
      !selectedSquare &&
      tutorialExample.targets.includes(square);

    const baseLight = "#bfdbfe";
    const baseDark = "#1d4ed8";

    let background = squareColor(square) === "light" ? baseLight : baseDark;
    let boxShadow = "none";

    if (isSelected) {
      background = "rgba(96,165,250,0.50)";
      boxShadow = "inset 0 0 0 4px rgba(59,130,246,0.95), 0 0 20px rgba(59,130,246,0.30)";
    } else if (isTutorialSource) {
      background = "rgba(96,165,250,0.35)";
      boxShadow = "inset 0 0 0 4px rgba(96,165,250,1), 0 0 18px rgba(96,165,250,0.28)";
    }

    return (
      <div
        key={square}
        onClick={() => selectSquare(square)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const source = e.dataTransfer.getData("text/plain") || dragSourceSquare;
          if (source) moveByDrag(source, square);
        }}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          background,
          boxShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          cursor: isAiThinking ? "wait" : "pointer",
        }}
      >
        {(isLegalTarget || isTutorialTarget) && (
          <div
            style={{
              position: "absolute",
              width: piece ? "74%" : "28%",
              height: piece ? "74%" : "28%",
              borderRadius: "50%",
              background: piece
                ? "rgba(8,47,73,0.26)"
                : "rgba(8,47,73,0.45)",
              boxShadow: piece ? "inset 0 0 0 4px rgba(8,47,73,0.45)" : "none",
              pointerEvents: "none",
            }}
          />
        )}

        {symbol && (
          <div
            draggable={!isAiThinking && !game.isGameOver()}
            onDragStart={(e) => {
              if (!piece || piece.color !== game.turn() || isAiThinking || game.isGameOver()) {
                e.preventDefault();
                return;
              }

              e.dataTransfer.setData("text/plain", square);
              setDragSourceSquare(square);

              const moves = getLegalMovesFrom(square);
              setSelectedSquare(square);
              setLegalTargets(moves);
              if (setup.gameMode !== "learn") setShowQuietTutorial(false);
            }}
            onDragEnd={() => {
              setDragSourceSquare(null);
            }}
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: "clamp(28px, 4vw, 58px)",
              lineHeight: 1,
              cursor:
                piece.color === game.turn() && !isAiThinking && !game.isGameOver()
                  ? "grab"
                  : "default",
              color: piece.color === "w" ? "#ffffff" : "#000000",
              WebkitTextStroke: piece.color === "w" ? "1px #0f172a" : "1px #111827",
              textShadow:
                piece.color === "w"
                  ? "0 0 2px rgba(15,23,42,0.8), 0 1px 2px rgba(15,23,42,0.8)"
                  : "0 0 2px rgba(255,255,255,0.10), 0 1px 1px rgba(255,255,255,0.08)",
            }}
          >
            {symbol}
          </div>
        )}
      </div>
    );
  }

  const topImmersiveBar = (
    <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 320px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
            {ui.boardSize}
          </div>
          <input
            type="range"
            min={320}
            max={900}
            step={20}
            value={boardSize}
            onChange={(e) => setBoardSize(Number(e.target.value))}
          />
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
            {ui.winGauge}
          </div>

          <TugOfWarGauge
            white={winChances.white}
            whiteLabel={ui.whiteLabel}
            blackLabel={ui.blackLabel}
          />
        </div>
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 16,
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
          {ui.boardStatus}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{status}</div>

        {isAiThinking && (
          <div style={{ fontSize: 14, color: "#60a5fa" }}>{ui.aiThinking}</div>
        )}

        {lastVoiceText && (
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
            {ui.voiceHeard}: {lastVoiceText}
          </div>
        )}

        {(whiteResignThresholdReached || blackResignThresholdReached) && !game.isGameOver() && (
          <div style={{ fontSize: 14, color: "#fbbf24" }}>
            {ui.thresholdWarning}
          </div>
        )}
      </div>
    </div>
  );

  const helperPanel = (
    <AnimatePresence>
      {showQuietTutorial && tutorialExample && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          style={{
            borderRadius: 18,
            border: "1px solid rgba(96,165,250,0.35)",
            background: "rgba(59,130,246,0.08)",
            boxShadow: "0 0 24px rgba(59,130,246,0.18)",
            padding: 16,
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              color: "#60a5fa",
              fontWeight: 700,
            }}
          >
            <Sparkles size={16} />
            {ui.helperZone}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.7,
            }}
          >
            {t.helperTry} <strong>{tutorialExample.source}</strong>, {t.helperThen}{" "}
            <strong>{tutorialExample.targets.join(" / ")}</strong>.
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.60)",
              marginTop: 8,
            }}
          >
            {t.helperFooter}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const advancedOptionsPanel = (
    <AnimatePresence>
      {showAdvancedOptions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 16 }}
        >
          <Panel title={ui.hiddenOptions}>
            <div style={{ display: "grid", gap: 24 }}>
              <Panel title={t.currentSetup}>
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.10)",
                    padding: 16,
                    fontSize: 14,
                    lineHeight: 1.9,
                  }}
                >
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{ui.playerType}:</span>{" "}
                    {setup.opponentMode === "local" ? ui.twoPlayers : ui.versusAi}
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{t.modeLabel}:</span>{" "}
                    {setup.gameMode === "classic"
                      ? t.classic
                      : setup.gameMode === "learn"
                      ? t.learn
                      : setup.gameMode === "mate5"
                      ? ui.mateIn5
                      : setup.gameMode === "protect"
                      ? ui.godSaveTheKing
                      : ui.battleRoyal}
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{t.languageLabel}:</span>{" "}
                    {t.langNames[lang]}
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.70)" }}>{t.controlLabel}:</span>{" "}
                    {setup.controlMode === "voice" ? t.voice : t.quiet}
                  </div>
                </div>
              </Panel>

              <Panel title={t.languageLabel}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {(["en", "fr", "de"] as Lang[]).map((languageKey) => (
                    <ActionButton
                      key={languageKey}
                      onClick={() => setLang(languageKey)}
                      active={lang === languageKey}
                      fullWidth
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{t.flags[languageKey]}</span>
                        <span>{t.langNames[languageKey]}</span>
                      </div>
                    </ActionButton>
                  ))}
                </div>
              </Panel>

              <Panel title={t.controlTitle}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <ActionButton
                    onClick={() =>
                      setSetup((prev) => ({
                        ...prev,
                        controlMode: "quiet",
                      }))
                    }
                    active={setup.controlMode === "quiet"}
                    fullWidth
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Hand size={16} />
                      {t.quiet}
                    </div>
                  </ActionButton>

                  <ActionButton
                    onClick={() =>
                      setSetup((prev) => ({
                        ...prev,
                        controlMode: "voice",
                      }))
                    }
                    active={setup.controlMode === "voice"}
                    fullWidth
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Volume2 size={16} />
                      {t.voice}
                    </div>
                  </ActionButton>
                </div>
              </Panel>
            </div>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const minimalControls = (
    <Panel title={ui.minimalControls}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        <ActionButton onClick={restartGame} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <RotateCcw size={16} /> {t.newGame}
          </div>
        </ActionButton>

        <ActionButton onClick={undoMove} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Undo2 size={16} /> {t.undo}
          </div>
        </ActionButton>

        <ActionButton onClick={toggleVoiceRecognition} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? ui.voiceStop : ui.voiceStart}
          </div>
        </ActionButton>

        <ActionButton onClick={stopGame} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <StopCircle size={16} /> {ui.stop}
          </div>
        </ActionButton>

        <ActionButton onClick={resignGame} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Flag size={16} /> {ui.resign}
          </div>
        </ActionButton>

        <ActionButton onClick={() => setShowAdvancedOptions((v) => !v)} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {showAdvancedOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {ui.hiddenOptions}
          </div>
        </ActionButton>
      </div>
    </Panel>
  );

  const setupView = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 1fr)",
          gap: 24,
        }}
      >
        <Panel title={ui.playerType}>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={smallMuted}>
              {setup.opponentMode === "local" ? ui.classicAvailable : ui.louluModesAvailable}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ActionButton
                onClick={() =>
                  setSetup((prev) => ({
                    ...prev,
                    opponentMode: "local",
                    gameMode: "classic",
                  }))
                }
                active={setup.opponentMode === "local"}
                fullWidth
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Users size={16} />
                  {ui.twoPlayers}
                </div>
              </ActionButton>

              <ActionButton
                onClick={() =>
                  setSetup((prev) => ({
                    ...prev,
                    opponentMode: "ai",
                  }))
                }
                active={setup.opponentMode === "ai"}
                fullWidth
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Bot size={16} />
                  {ui.versusAi}
                </div>
              </ActionButton>
            </div>

            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.10)",
                padding: 16,
                fontSize: 14,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {setup.opponentMode === "local" ? ui.localClassicOnly : ui.modeClassicHelp}
            </div>
          </div>
        </Panel>

        <Panel title={ui.chooseMode}>
          {setup.opponentMode === "local" ? (
            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.10)",
                padding: 18,
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{t.classic}</div>
              <div style={{ color: "rgba(255,255,255,0.75)" }}>{ui.modeClassicHelp}</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {(
                [
                  ["classic", t.classic, ui.modeClassicHelp],
                  ["learn", t.learn, ui.modeLearnHelp],
                  ["mate5", ui.mateIn5, ui.modeMate5Help],
                  ["protect", ui.godSaveTheKing, ui.modeProtectHelp],
                  ["battle", ui.battleRoyal, ui.modeBattleHelp],
                ] as [GameMode, string, string][]
              ).map(([modeKey, title, desc]) => (
                <ActionButton
                  key={modeKey}
                  onClick={() =>
                    setSetup((prev) => ({
                      ...prev,
                      gameMode: modeKey,
                    }))
                  }
                  active={setup.gameMode === modeKey}
                  fullWidth
                >
                  <div style={{ textAlign: "left", width: "100%" }}>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{desc}</div>
                  </div>
                </ActionButton>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t.controlTitle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <ActionButton
              onClick={() =>
                setSetup((prev) => ({
                  ...prev,
                  controlMode: "quiet",
                }))
              }
              active={setup.controlMode === "quiet"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Hand size={16} />
                {t.quiet}
              </div>
            </ActionButton>

            <ActionButton
              onClick={() =>
                setSetup((prev) => ({
                  ...prev,
                  controlMode: "voice",
                }))
              }
              active={setup.controlMode === "voice"}
              fullWidth
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Volume2 size={16} />
                {t.voice}
              </div>
            </ActionButton>
          </div>
        </Panel>

        <Panel title={t.languageLabel}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {(["en", "fr", "de"] as Lang[]).map((languageKey) => (
              <ActionButton
                key={languageKey}
                onClick={() => setLang(languageKey)}
                active={lang === languageKey}
                fullWidth
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{t.flags[languageKey]}</span>
                  <span>{t.langNames[languageKey]}</span>
                </div>
              </ActionButton>
            ))}
          </div>
        </Panel>

        <Panel title={t.startGame}>
          <ActionButton
            onClick={() => {
              restartGame();
              setScreen("play");
            }}
            active
            fullWidth
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Play size={16} />
              {ui.start}
            </div>
          </ActionButton>
        </Panel>
      </div>
    </motion.div>
  );

  const playClassicView = (
    <div style={{ display: "grid", gap: 20 }}>
      {topImmersiveBar}

      <Panel title={t.board}>
        <div
          style={{
            borderRadius: 20,
            overflow: "visible",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "#000",
            padding: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "24px minmax(0, 1fr)",
              gap: 8,
              alignItems: "stretch",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(8, 1fr)",
                alignItems: "center",
                textAlign: "center",
                color: "rgba(255,255,255,0.70)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {RANKS.map((rank) => (
                <div key={rank}>{rank}</div>
              ))}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                  width: "100%",
                  maxWidth: boardSize,
                  aspectRatio: "1 / 1",
                  border: "1px solid rgba(255,255,255,0.10)",
                  margin: "0 auto",
                }}
              >
                {RANKS.flatMap((rank) =>
                  FILES.map((file) => {
                    const square = `${file}${rank}`;
                    return renderSquare(square);
                  })
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                  width: "100%",
                  maxWidth: boardSize,
                  margin: "8px auto 0 auto",
                  color: "rgba(255,255,255,0.70)",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {FILES.map((file) => (
                  <div key={file}>{file}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {helperPanel}
      </Panel>

      {minimalControls}
      {advancedOptionsPanel}
    </div>
  );

  const playModePreview = (
    <div style={{ display: "grid", gap: 24 }}>
      {topImmersiveBar}

      <Panel title={t.board}>
        <div
          style={{
            borderRadius: 20,
            overflow: "visible",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "#000",
            padding: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "24px minmax(0, 1fr)",
              gap: 8,
              alignItems: "stretch",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(8, 1fr)",
                alignItems: "center",
                textAlign: "center",
                color: "rgba(255,255,255,0.70)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {RANKS.map((rank) => (
                <div key={rank}>{rank}</div>
              ))}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                  width: "100%",
                  maxWidth: boardSize,
                  aspectRatio: "1 / 1",
                  border: "1px solid rgba(255,255,255,0.10)",
                  margin: "0 auto",
                }}
              >
                {RANKS.flatMap((rank) =>
                  FILES.map((file) => {
                    const square = `${file}${rank}`;
                    return renderSquare(square);
                  })
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                  width: "100%",
                  maxWidth: boardSize,
                  margin: "8px auto 0 auto",
                  color: "rgba(255,255,255,0.70)",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {FILES.map((file) => (
                  <div key={file}>{file}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {helperPanel}
      </Panel>

      {minimalControls}
      {advancedOptionsPanel}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 24,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <BrandHeader
          appName={BRAND.name}
          lobsterSrc={lobster}
          showBrandInfo={showBrandInfo}
          onToggle={() => setShowBrandInfo((v) => !v)}
          texts={{
            brandShort: t.brandShort,
            tagline: t.tagline,
            brandClickHint: t.brandClickHint,
            brandTitle: t.brandTitle,
            brandSubtitle: t.brandSubtitle,
            brandBody1: t.brandBody1,
            brandBody2: t.brandBody2,
            brandBody3: t.brandBody3,
          }}
        />

        {screen === "setup"
          ? setupView
          : setup.gameMode === "classic" || setup.gameMode === "learn" || setup.gameMode === "mate5" || setup.gameMode === "protect" || setup.gameMode === "battle"
          ? playModePreview
          : playClassicView}

        <div style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          {t.allRightsReserved}
        </div>
      </div>
    </div>
  );
}