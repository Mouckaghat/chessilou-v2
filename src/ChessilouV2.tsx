import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chess } from "chess.js";
import {
  RotateCcw,
  Undo2,
  Volume2,
  Hand,
  Sparkles,
  StopCircle,
  Flag,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  LogOut,
} from "lucide-react";
import lobster from "./assets/blue_lobster.png";
import {
  translations,
  type Lang,
  type GameMode,
  type OpponentMode,
  type ControlMode,
} from "./data/translations";
import Panel from "./components/ui/Panel";
import ActionButton from "./components/ui/ActionButton";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

type Difficulty = 1 | 2 | 3 | 4 | 5;
type Screen = "landing" | "tutorial" | "setup" | "play";

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

function getPieceSymbol(piece: { type: string; color: string } | null | undefined) {
  if (!piece) return "";

  // Use solid piece shapes for BOTH sides.
  // White/black appearance is controlled by CSS color.
  const solidSymbols: Record<string, string> = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  };

  return solidSymbols[piece.type] ?? "";
}

function getUiText(lang: Lang) {
  if (lang === "fr") {
    return {
      playerType: "Type de joueur",
      twoPlayers: "Deux joueurs",
      versusAi: "Contre Lili",
      localClassicOnly: "En mode deux joueurs, seul le mode classique est disponible.",
      chooseMode: "Mode de jeu",
      chooseDifficulty: "Niveau de difficulté",
      stop: "Stop",
      start: "Démarrer",
      boardHint: "Touchez une pièce ou glissez-déposez-la.",
      classicAvailable: "Classique disponible",
      liliModesAvailable: "Tous les modes Lili disponibles",
      dragFallback: "Le glisser-déposer reste disponible.",
      aiThinking: "Lili réfléchit...",
      mateIn5: "Mat en 5",
      godSaveTheKing: "Que Dieu sauve le Roi",
      battleRoyal: "Bataille Royale",
      liliPlayed: "Lili a joué",
      liliCheckmated: "Lili est échec et mat.",
      youCheckmated: "Vous êtes échec et mat.",
      liliResigns: "Lili abandonne.",
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
      listening: "Écoute en cours...",
      modeClassicHelp: "Partie classique normale.",
      modeLearnHelp: "Mode apprentissage : aide visuelle plus présente.",
      modeMate5Help: "Prototype : attaque guidée, objectif tactique offensif.",
      modeProtectHelp: "Prototype : survivez et protégez votre roi.",
      modeBattleHelp: "Prototype : bataille déséquilibrée et plus sauvage.",
      difficultyLabel: "Difficulté",
      d1: "900 ELO • Débutant",
      d2: "1200 ELO • Hustler de rue",
      d3: "1500 ELO • Compétition",
      d4: "1800 ELO • Bobby Fischer",
      d5: "2100 ELO • Judit Polgár",
      goodbye: "Au revoir",
    };
  }

  if (lang === "de") {
    return {
      playerType: "Spielertyp",
      twoPlayers: "Zwei Spieler",
      versusAi: "Gegen Lili",
      localClassicOnly: "Im Zwei-Spieler-Modus ist nur Klassisch verfügbar.",
      chooseMode: "Spielmodus",
      chooseDifficulty: "Schwierigkeitsgrad",
      stop: "Stopp",
      start: "Starten",
      boardHint: "Tippe auf eine Figur oder ziehe sie per Drag-and-Drop.",
      classicAvailable: "Klassisch verfügbar",
      liliModesAvailable: "Alle Lili-Modi verfügbar",
      dragFallback: "Drag-and-Drop bleibt verfügbar.",
      aiThinking: "Lili denkt nach...",
      mateIn5: "Matt in 5",
      godSaveTheKing: "Gott schütze den König",
      battleRoyal: "Battle Royal",
      liliPlayed: "Lili spielte",
      liliCheckmated: "Lili ist schachmatt.",
      youCheckmated: "Du bist schachmatt.",
      liliResigns: "Lili gibt auf.",
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
      listening: "Hört zu...",
      modeClassicHelp: "Normale klassische Partie.",
      modeLearnHelp: "Lernmodus: stärkere visuelle Hilfe.",
      modeMate5Help: "Prototyp: Angriffsszenario mit taktischem Ziel.",
      modeProtectHelp: "Prototyp: Überleben und den König schützen.",
      modeBattleHelp: "Prototyp: wildere, ungleichere Schlacht.",
      difficultyLabel: "Schwierigkeit",
      d1: "900 ELO • Anfänger",
      d2: "1200 ELO • Straßen-Hustler",
      d3: "1500 ELO • Wettkampf",
      d4: "1800 ELO • Bobby Fischer",
      d5: "2100 ELO • Judit Polgár",
      goodbye: "Auf Wiedersehen",
    };
  }

  return {
    playerType: "Player type",
    twoPlayers: "Two players",
    versusAi: "Play vs Lili",
    localClassicOnly: "In two-player mode, only Classic is available.",
    chooseMode: "Game mode",
    chooseDifficulty: "Difficulty level",
    stop: "Stop",
    start: "Start game",
    boardHint: "Tap a piece or drag and drop it.",
    classicAvailable: "Classic available",
    liliModesAvailable: "All Lili modes available",
    dragFallback: "Drag and drop remains available.",
    aiThinking: "Lili is thinking...",
    mateIn5: "Mate in 5",
    godSaveTheKing: "God save the King",
    battleRoyal: "Battle Royal",
    liliPlayed: "Lili played",
    liliCheckmated: "Lili is checkmated.",
    youCheckmated: "You are checkmated.",
    liliResigns: "Lili resigns.",
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
    listening: "Listening...",
    modeClassicHelp: "Normal classic game.",
    modeLearnHelp: "Learning mode: stronger visual help.",
    modeMate5Help: "Prototype: attacking scenario with tactical objective.",
    modeProtectHelp: "Prototype: survive and protect your king.",
    modeBattleHelp: "Prototype: wilder, more unbalanced battle.",
    difficultyLabel: "Difficulty",
    d1: "900 ELO • Newbie",
    d2: "1200 ELO • Street Hustler",
    d3: "1500 ELO • Competition",
    d4: "1800 ELO • Bobby Fischer",
    d5: "2100 ELO • Judit Polgár",
    goodbye: "Good bye",
  };
}

function getWinnerLabel(lang: Lang, color: "w" | "b") {
  if (lang === "fr") return color === "w" ? "Blanc" : "Noir";
  if (lang === "de") return color === "w" ? "Weiß" : "Schwarz";
  return color === "w" ? "White" : "Black";
}

function getAiDelay(gameMode: GameMode, difficulty: Difficulty) {
  const base =
    gameMode === "learn" ? 1200 :
    gameMode === "classic" ? 1500 :
    gameMode === "mate5" ? 1700 :
    gameMode === "protect" ? 1800 :
    1900;

  if (difficulty >= 5) return base + 500;
  if (difficulty >= 4) return base + 250;
  return base;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function evaluatePosition(game: Chess) {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? -99999 : 99999;
  }

  if (game.isDraw() || game.isStalemate() || game.isInsufficientMaterial()) {
    return 0;
  }

  const pieceValues: Record<string, number> = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 0,
  };

  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = pieceValues[piece.type] ?? 0;
      score += piece.color === "w" ? value : -value;

      const centerDist = Math.abs(3.5 - c) + Math.abs(3.5 - r);
      const centerBonus = Math.round((4 - centerDist) * 6);
      if (piece.type !== "k") score += piece.color === "w" ? centerBonus : -centerBonus;

      if (piece.type === "p") {
        const advance = piece.color === "w" ? 6 - r : r - 1;
        score += piece.color === "w" ? advance * 4 : -advance * 4;
      }
    }
  }

  const mobility = game.moves().length;
  score += game.turn() === "w" ? mobility * 2 : -mobility * 2;

  if (game.inCheck()) {
    score += game.turn() === "w" ? -35 : 35;
  }

  return score;
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game);
  }

  const moves = game.moves({ verbose: true });
  if (!moves.length) return evaluatePosition(game);

  const orderedMoves = moves.sort((a, b) => {
    const scoreMove = (m: any) => {
      let s = 0;
      if (m.captured) s += 10;
      if (m.promotion) s += 20;
      if (["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"].includes(m.to)) s += 3;
      return s;
    };
    return scoreMove(b) - scoreMove(a);
  });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const next = new Chess(game.fen());
      next.move(move);
      const evalScore = minimax(next, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of orderedMoves) {
    const next = new Chess(game.fen());
    next.move(move);
    const evalScore = minimax(next, depth - 1, alpha, beta, true);
    minEval = Math.min(minEval, evalScore);
    beta = Math.min(beta, evalScore);
    if (beta <= alpha) break;
  }
  return minEval;
}

function getBestMove(game: Chess, difficulty: Difficulty) {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;

  const depth = difficulty === 1 ? 1 : difficulty === 2 ? 2 : difficulty === 3 ? 2 : difficulty === 4 ? 3 : 4;
  const maximizing = game.turn() === "w";

  const scored = moves.map((m) => {
    const test = new Chess(game.fen());
    test.move(m);
    let score = minimax(test, depth - 1, -Infinity, Infinity, !maximizing);

    if (m.captured) score += maximizing ? 20 : -20;
    if (m.promotion) score += maximizing ? 50 : -50;
    if (test.inCheck()) score += maximizing ? 25 : -25;
    if (test.isCheckmate()) score += maximizing ? 100000 : -100000;

    const noise = difficulty <= 2 ? Math.random() * 60 - 30 : difficulty === 3 ? Math.random() * 18 - 9 : 0;
    score += noise;

    return { move: m, score };
  });

  scored.sort((a, b) => maximizing ? b.score - a.score : a.score - b.score);

  if (difficulty === 1) {
    const pool = scored.slice(0, Math.min(4, scored.length));
    return pool[Math.floor(Math.random() * pool.length)].move;
  }

  if (difficulty === 2) {
    const pool = scored.slice(0, Math.min(3, scored.length));
    return pool[Math.floor(Math.random() * pool.length)].move;
  }

  if (difficulty === 3) {
    const pool = scored.slice(0, Math.min(2, scored.length));
    return pool[Math.floor(Math.random() * pool.length)].move;
  }

  return scored[0].move;
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

  const evalScore = evaluatePosition(game) / 100;
  const whiteRaw = 50 + evalScore * 3.5;
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
      return { fen: undefined as string | undefined };
    case "learn":
      return { fen: undefined as string | undefined };
    case "mate5":
      return { fen: "r1bq1rk1/pppp1ppp/2n5/4N3/2B1P3/8/PPPP1PPP/RNBQ1RK1 w - - 0 1" };
    case "protect":
      return { fen: "4k3/8/8/8/8/2q5/4K3/8 w - - 0 1" };
    case "battle":
      return { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNQ w Qkq - 0 1" };
    default:
      return { fen: undefined as string | undefined };
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
    .replace(/\bto\b/g, " ")
    .replace(/\btoo\b/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVoiceMove(text: string, game: Chess) {
  const normalized = normalizeVoiceText(text);

  if (normalized.includes("castle kingside") || normalized.includes("short castle")) {
    return game.turn() === "w" ? { from: "e1", to: "g1" } : { from: "e8", to: "g8" };
  }

  if (normalized.includes("castle queenside") || normalized.includes("long castle")) {
    return game.turn() === "w" ? { from: "e1", to: "c1" } : { from: "e8", to: "c8" };
  }

  const matches = normalized.match(/[a-h][1-8]/g);
  if (matches && matches.length >= 2) {
    return { from: matches[0], to: matches[1] };
  }

  return null;
}


const OPENING_BOOK: string[][] = [
  ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"],
  ["e2e4", "c7c5", "g1f3", "d7d6", "d2d4", "c5d4"],
  ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5", "a7a6"],
  ["d2d4", "d7d5", "c2c4", "e7e6", "b1c3", "g8f6"],
  ["d2d4", "g8f6", "c2c4", "g7g6", "b1c3", "f8g7"],
  ["c2c4", "e7e5", "b1c3", "g8f6", "g2g3", "d7d5"],
];

function moveToUci(move: { from: string; to: string; promotion?: string }) {
  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

function getBookMove(game: Chess, difficulty: Difficulty) {
  if (difficulty < 3) return null;
  const history = game.history({ verbose: true }).map((m: any) => moveToUci(m));
  for (const line of OPENING_BOOK) {
    if (history.length >= line.length) continue;
    const prefixMatches = history.every((played, index) => line[index] === played);
    if (!prefixMatches) continue;
    const nextUci = line[history.length];
    if (!nextUci) continue;
    const candidate = {
      from: nextUci.slice(0, 2),
      to: nextUci.slice(2, 4),
      promotion: nextUci.slice(4) || undefined,
    };
    const legal = game.moves({ verbose: true }).find(
      (m: any) =>
        m.from === candidate.from &&
        m.to === candidate.to &&
        (candidate.promotion ? m.promotion === candidate.promotion : true)
    );
    if (legal) return legal;
  }
  return null;
}

function getPieceWord(lang: Lang, piece: string) {
  const table = {
    en: { p: "Pawn", n: "Knight", b: "Bishop", r: "Rook", q: "Queen", k: "King" },
    fr: { p: "Pion", n: "Cavalier", b: "Fou", r: "Tour", q: "Dame", k: "Roi" },
    de: { p: "Bauer", n: "Springer", b: "Läufer", r: "Turm", q: "Dame", k: "König" },
  } as const;
  return table[lang][piece as keyof typeof table["en"]] ?? "Piece";
}

function moveToSpeech(lang: Lang, move: { san?: string; piece: string; from: string; to: string; captured?: string; promotion?: string }) {
  const san = move.san ?? "";
  if (san === "O-O") {
    return lang === "fr" ? "Petit roque." : lang === "de" ? "Kurze Rochade." : "Castle kingside.";
  }
  if (san === "O-O-O") {
    return lang === "fr" ? "Grand roque." : lang === "de" ? "Lange Rochade." : "Castle queenside.";
  }

  const pieceWord = getPieceWord(lang, move.piece);
  const from = move.from.toLowerCase();
  const to = move.to.toLowerCase();

  if (move.captured) {
    if (lang === "fr") return `${pieceWord} prend ${to}.`;
    if (lang === "de") return `${pieceWord} schlägt ${to}.`;
    return `${pieceWord} takes ${to}.`;
  }

  if (move.promotion) {
    const promotionWord = getPieceWord(lang, move.promotion);
    if (lang === "fr") return `${pieceWord} ${from} vers ${to}, promotion ${promotionWord}.`;
    if (lang === "de") return `${pieceWord} ${from} nach ${to}, Umwandlung zur ${promotionWord}.`;
    return `${pieceWord} ${from} to ${to}, promotion to ${promotionWord}.`;
  }

  if (lang === "fr") return `${pieceWord} ${from} vers ${to}.`;
  if (lang === "de") return `${pieceWord} ${from} nach ${to}.`;
  return `${pieceWord} ${from} to ${to}.`;
}

function getLiliComment(lang: Lang, difficulty: Difficulty) {
  const casual = {
    en: ["Alright.", "Nice and easy.", "Let me see."],
    fr: ["Très bien.", "Doucement.", "Voyons voir."],
    de: ["Na gut.", "Ganz ruhig.", "Mal sehen."],
  } as const;
  const club = {
    en: ["Careful now.", "Interesting choice.", "That could get sharp."],
    fr: ["Attention maintenant.", "Choix intéressant.", "Ça peut devenir tactique."],
    de: ["Jetzt wird es heikel.", "Interessante Wahl.", "Das könnte scharf werden."],
  } as const;
  const strong = {
    en: ["That leaves something hanging.", "You have weakened your king.", "Ambitious move."],
    fr: ["Il y a quelque chose qui pend.", "Votre roi devient plus faible.", "Coup ambitieux."],
    de: ["Da hängt etwas.", "Dein König steht schwächer.", "Ein ehrgeiziger Zug."],
  } as const;

  const roll = Math.random();
  if (difficulty <= 2) return roll < 0.22 ? casual[lang][Math.floor(Math.random() * casual[lang].length)] : null;
  if (difficulty === 3) return roll < 0.30 ? club[lang][Math.floor(Math.random() * club[lang].length)] : null;
  return roll < 0.40 ? strong[lang][Math.floor(Math.random() * strong[lang].length)] : null;
}

function getLiliSpeech(lang: Lang, kind: "move" | "check" | "checkmate" | "thinking", spokenMove?: string) {
  if (lang === "fr") {
    if (kind === "check") return "Échec.";
    if (kind === "checkmate") return "Échec et mat.";
    if (kind === "thinking") return "Voyons voir.";
    return spokenMove ?? "À toi.";
  }
  if (lang === "de") {
    if (kind === "check") return "Schach.";
    if (kind === "checkmate") return "Schachmatt.";
    if (kind === "thinking") return "Mal sehen.";
    return spokenMove ?? "Du bist dran.";
  }
  if (kind === "check") return "Check.";
  if (kind === "checkmate") return "Checkmate.";
  if (kind === "thinking") return "Let me think.";
  return spokenMove ?? "Your move.";
}

export default function ChessilouV2() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [lang, setLang] = useState<Lang>("en");
  const [setup, setSetup] = useState<SetupState>({
    gameMode: "classic",
    opponentMode: "local",
    controlMode: "quiet",
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(3);
  const [setupStage, setSetupStage] = useState<1 | 2 | 3 | 4>(1);
  const [focusMode, setFocusMode] = useState(true);

  const t = translations[lang];
  const ui = getUiText(lang);
  const entryTexts = {
    en: {
      landingTitle: "Chessilou - Universal Family Chess",
      landingSubtitle: "Your playful chess company by Lobster Inc.",
      chooseLanguage: "Choose your language",
      tutorialTitle: "Friendly working instruction",
      slides: [
        { icon: "♟️", title: "Welcome to Chessilou", body: "Pick your language, learn the basics, then enter setup before the real battle begins." },
        { icon: "🖐️", title: "Move your pieces", body: "Tap a piece, then tap the target square. You can also drag and drop, or use voice mode." },
        { icon: "🔥", title: "Lili got stronger", body: "Lili now uses an opening book, ELO-style difficulty, and voice feedback. Levels 4 and 5 punish mistakes much faster than before." },
        { icon: "🚀", title: "Ready?", body: "After this short guide, choose your mode, difficulty, and start the game." },
      ],
      next: "Next", back: "Back", skip: "Skip", startSetup: "Go to setup", goodbye: "Good bye",
    },
    fr: {
      landingTitle: "Chessilou - Universal Family Chess",
      landingSubtitle: "Votre compagnie d’échecs ludique par Lobster Inc.",
      chooseLanguage: "Choisissez votre langue",
      tutorialTitle: "Instructions amicales",
      slides: [
        { icon: "♟️", title: "Bienvenue sur Chessilou", body: "Choisissez votre langue, découvrez les bases, puis entrez dans la configuration avant la vraie bataille." },
        { icon: "🖐️", title: "Déplacez vos pièces", body: "Touchez une pièce puis la case cible. Vous pouvez aussi glisser-déposer ou utiliser la voix." },
        { icon: "🔥", title: "Lili est plus forte", body: "Lili utilise maintenant un répertoire d’ouvertures, une difficulté style ELO et un retour vocal. Les niveaux 4 et 5 punissent bien plus vite." },
        { icon: "🚀", title: "Prêt ?", body: "Après ce mini-guide, choisissez votre mode, votre niveau, puis lancez la partie." },
      ],
      next: "Suivant", back: "Retour", skip: "Passer", startSetup: "Aller à la configuration", goodbye: "Au revoir",
    },
    de: {
      landingTitle: "Chessilou - Universal Family Chess",
      landingSubtitle: "Deine spielerische Schachgesellschaft von Lobster Inc.",
      chooseLanguage: "Wähle deine Sprache",
      tutorialTitle: "Freundliche Anleitung",
      slides: [
        { icon: "♟️", title: "Willkommen bei Chessilou", body: "Wähle deine Sprache, lerne die Grundlagen und gehe dann ins Setup vor dem echten Duell." },
        { icon: "🖐️", title: "Ziehe deine Figuren", body: "Tippe auf eine Figur und dann auf das Zielfeld. Du kannst auch Drag-and-Drop oder die Stimme nutzen." },
        { icon: "🔥", title: "Lili ist stärker geworden", body: "Lili nutzt jetzt ein Eröffnungsbuch, ELO-ähnliche Stärke und Sprachfeedback. Die Levels 4 und 5 bestrafen Fehler deutlich härter." },
        { icon: "🚀", title: "Bereit?", body: "Nach dieser kurzen Anleitung wählst du Modus und Schwierigkeit und startest dann das Spiel." },
      ],
      next: "Weiter", back: "Zurück", skip: "Überspringen", startSetup: "Zum Setup", goodbye: "Auf Wiedersehen",
    },
  } as const;
  const entry = entryTexts[lang];

  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const [status, setStatus] = useState<string>(t.welcome);
  const [lastVoiceText, setLastVoiceText] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const [tutorialExample, setTutorialExample] = useState<TutorialExample | null>(
    getRandomTutorialExample()
  );
  const [showQuietTutorial, setShowQuietTutorial] = useState(false);
  const [dragSourceSquare, setDragSourceSquare] = useState<string | null>(null);

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingAiFen, setPendingAiFen] = useState<string | null>(null);
  const [pendingAiSan, setPendingAiSan] = useState<string | null>(null);
  const [pendingAiSpeech, setPendingAiSpeech] = useState<string | null>(null);

  const [boardSize, setBoardSize] = useState(760);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const playStageMaxWidth = clamp(boardSize + 180, 760, 1080);
  const boardShellWidth = clamp(boardSize + 52, 380, 980);

  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);


  function speakLili(kind: "move" | "check" | "checkmate" | "thinking", spokenMove?: string, followUp?: string | null) {
    if (setup.controlMode !== "voice") return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const primary = new SpeechSynthesisUtterance(getLiliSpeech(lang, kind, spokenMove));
      primary.lang = getVoiceLang(lang);
      primary.rate = 0.98;
      primary.pitch = 0.96;
      speechRef.current = primary;
      if (followUp) {
        primary.onend = () => {
          try {
            const second = new SpeechSynthesisUtterance(followUp);
            second.lang = getVoiceLang(lang);
            second.rate = 0.98;
            second.pitch = 0.96;
            window.speechSynthesis.speak(second);
          } catch {}
        };
      }
      window.speechSynthesis.speak(primary);
    } catch {}
  }

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
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!isAiThinking || !pendingAiFen) return;

    const delay = getAiDelay(setup.gameMode, difficulty);

    const timer = window.setTimeout(() => {
      const finalGame = new Chess(pendingAiFen);
      setGame(finalGame);
      setIsAiThinking(false);

      if (finalGame.isCheckmate()) {
        setStatus(ui.youCheckmated);
        speakLili("checkmate");
      } else if (finalGame.isDraw()) {
        setStatus(t.draw);
      } else if (finalGame.inCheck()) {
        setStatus(`${ui.liliPlayed}: ${pendingAiSan ?? ""} • check`);
        speakLili("move", pendingAiSpeech ?? undefined, getLiliSpeech(lang, "check"));
      } else {
        setStatus(`${ui.liliPlayed}: ${pendingAiSan ?? ""}`);
        speakLili("move", pendingAiSpeech ?? undefined, getLiliComment(lang, difficulty));
      }

      setPendingAiFen(null);
      setPendingAiSan(null);
      setPendingAiSpeech(null);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isAiThinking, pendingAiFen, pendingAiSan, pendingAiSpeech, setup.gameMode, difficulty, ui.youCheckmated, ui.liliPlayed, t.draw, lang, setup.controlMode]);

  const winChances = useMemo(() => getWinChances(game), [game]);

  const localizedTurn = useMemo(() => {
    if (lang === "fr") return game.turn() === "w" ? "Blanc" : "Noir";
    if (lang === "de") return game.turn() === "w" ? "Weiß" : "Schwarz";
    return game.turn() === "w" ? "White" : "Black";
  }, [game, lang]);

  const difficultyName = useMemo(() => {
    switch (difficulty) {
      case 1:
        return ui.d1;
      case 2:
        return ui.d2;
      case 3:
        return ui.d3;
      case 4:
        return ui.d4;
      case 5:
        return ui.d5;
      default:
        return ui.d1;
    }
  }, [difficulty, ui.d1, ui.d2, ui.d3, ui.d4, ui.d5]);

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

  function goToLanding() {
    stopVoiceRecognition();
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    setLastVoiceText("");
    setGame(new Chess());
    clearSelection();
    setStatus(t.welcome);
    setTutorialExample(getRandomTutorialExample());
    setShowQuietTutorial(false);
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);
    setPendingAiSpeech(null);
    setShowAdvancedOptions(false);
    setShowLogoMenu(false);
    setTutorialIndex(0);
    setSetupStage(1);
    setFocusMode(true);
    setScreen("landing");
  }

  function goToTutorial(language: Lang) {
    setLang(language);
    setTutorialIndex(0);
    setSetupStage(1);
    setScreen("tutorial");
  }

  function startQuickGame() {
    const quickSetup: SetupState = {
      gameMode: "classic",
      opponentMode: "ai",
      controlMode: "quiet",
    };
    setSetup(quickSetup);
    setDifficulty(3);
    setSetupStage(4);

    const nextGame = new Chess();
    setGame(nextGame);
    clearSelection();
    setStatus(ui.modeClassicHelp);
    setLastVoiceText("");
    setIsListening(false);
    setTutorialExample(getRandomTutorialExample());
    setShowQuietTutorial(true);
    setIsAiThinking(false);
    setPendingAiFen(null);
    setPendingAiSan(null);
    setPendingAiSpeech(null);
    setShowAdvancedOptions(false);
    setFocusMode(true);
    stopVoiceRecognition();
    setScreen("play");
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
    setPendingAiSpeech(null);
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
    setPendingAiSpeech(null);
    setSetupStage(1);
    setFocusMode(true);
  }

  function finalizeHumanMove(nextGame: Chess, playedSan: string, moveColor: "w" | "b") {
    setGame(new Chess(nextGame.fen()));
    clearSelection();

    if (nextGame.isCheckmate()) {
      if (setup.opponentMode === "ai" && moveColor === "w") {
        setStatus(ui.liliCheckmated);
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

    if (chancesAfterHumanMove.black <= 5 && difficulty <= 2) {
      setStatus(ui.liliResigns);
      return nextGame;
    }

    const aiMove = getBookMove(nextGame, difficulty) ?? getBestMove(nextGame, difficulty);
    if (!aiMove) return nextGame;

    const aiGame = new Chess(nextGame.fen());
    aiGame.move(aiMove);

    setIsAiThinking(true);
    setPendingAiFen(aiGame.fen());
    setPendingAiSan(aiMove.san);
    setPendingAiSpeech(moveToSpeech(lang, aiMove));

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
      setStatus(ui.listening);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0]?.transcript ?? "";
      if (transcript) handleVoiceTranscript(transcript);
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
    setPendingAiSpeech(null);

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
    setPendingAiSpeech(null);
    clearSelection();
    setStatus(ui.youResign);
  }

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

        {symbol && piece && (
          <div
            draggable={!isAiThinking && !game.isGameOver()}
            onDragStart={(e) => {
              if (piece.color !== game.turn() || isAiThinking || game.isGameOver()) {
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
              WebkitTextStroke: piece.color === "w" ? "1.2px #020617" : "1px #111827",
              textShadow:
                piece.color === "w"
                  ? "0 1px 2px rgba(2,6,23,0.9)"
                  : "0 1px 1px rgba(255,255,255,0.08)",
            }}
          >
            {symbol}
          </div>
        )}
      </div>
    );
  }

  const compactPlayHeader = (
    <div
      style={{
        width: "100%",
        display: "grid",
        gap: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 14,
        background: "rgba(10,15,28,0.72)",
        boxShadow: "0 0 18px rgba(16, 156, 255, 0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", fontWeight: 700 }}>
          {setup.opponentMode === "ai" ? `${difficultyName}` : ui.twoPlayers}
        </div>
        <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 700 }}>
          {setup.controlMode === "voice" ? t.voice : t.quiet}
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: 15 }}>{status}</div>

      {setup.opponentMode === "ai" && (
        <TugOfWarGauge
          white={winChances.white}
          whiteLabel={ui.whiteLabel}
          blackLabel={ui.blackLabel}
        />
      )}
    </div>
  );

  const topImmersiveBar = (
    <div style={{ display: "grid", gap: 16, marginBottom: 16, width: "100%" }}>
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

        {setup.opponentMode === "ai" && (
          <div style={{ fontSize: 14, color: "#93c5fd" }}>
            {ui.difficultyLabel}: {difficultyName}
          </div>
        )}

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
                  {setup.opponentMode === "ai" && (
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.70)" }}>{ui.difficultyLabel}:</span>{" "}
                      {difficultyName}
                    </div>
                  )}
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 12,
                    maxWidth: 420,
                    width: "100%",
                  }}
                >
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
    <Panel title={focusMode ? `${ui.minimalControls} • Focus` : ui.minimalControls}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: focusMode ? "repeat(4, 1fr)" : "repeat(6, 1fr)",
          gap: 12,
        }}
      >
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

        <ActionButton onClick={() => setFocusMode((v) => !v)} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Sparkles size={16} /> {focusMode ? "Full cockpit" : "Focus mode"}
          </div>
        </ActionButton>

        {!focusMode && (
          <>
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
          </>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <ActionButton onClick={goToLanding} fullWidth>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <LogOut size={16} /> {ui.goodbye}
          </div>
        </ActionButton>
      </div>
    </Panel>
  );

  const boardView = (
    <Panel title={t.board}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div
          style={{
            width: "100%",
            maxWidth: boardShellWidth,
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(95, 175, 255, 0.18)",
            background: "linear-gradient(180deg, rgba(7,15,24,0.98), rgba(4,8,14,0.98))",
            boxShadow: "0 0 26px rgba(16, 156, 255, 0.08)",
            padding: 14,
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
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(95, 175, 255, 0.14)",
                  margin: "0 auto",
                  background: "#0a1118",
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
      </div>

      {helperPanel}
    </Panel>
  );


  const landingView = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: 22, textAlign: "center", width: "100%", maxWidth: 760 }}>
          <button
            onClick={() => setShowLogoMenu((v) => !v)}
            style={{ background: "transparent", border: "none", cursor: "pointer", justifySelf: "center" }}
          >
            <div
              style={{
                width: 150,
                height: 150,
                margin: "0 auto",
                borderRadius: 28,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(180deg, rgba(20,35,60,0.92), rgba(10,18,34,0.92))",
                border: "1px solid rgba(96,165,250,0.32)",
                boxShadow: "0 0 30px rgba(59,130,246,0.34), 0 0 78px rgba(59,130,246,0.14), inset 0 0 24px rgba(96,165,250,0.08)",
              }}
            >
              <img
                src={lobster}
                alt="Lobster Inc."
                style={{ width: 94, height: 94, objectFit: "contain", filter: "drop-shadow(0 0 18px rgba(96,165,250,0.65))" }}
              />
            </div>
          </button>

          <div style={{ display: "grid", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800 }}>{entry.landingTitle}</h1>
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 18 }}>{entry.landingSubtitle}</div>
            <div style={{ color: "#93c5fd", fontSize: 15, fontWeight: 700 }}>Happy Birthday Sandra — welcome to our chess family.</div>
          </div>

          <AnimatePresence>
            {showLogoMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  maxWidth: 420,
                  width: "100%",
                  margin: "0 auto",
                  display: "grid",
                  gap: 12,
                  borderRadius: 20,
                  padding: 16,
                  background: "rgba(10,15,28,0.96)",
                  border: "1px solid rgba(96,165,250,0.18)",
                  boxShadow: "0 0 24px rgba(59,130,246,0.14)",
                }}
              >
                <div style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>{entry.chooseLanguage}</div>

                <div style={{ display: "grid", gap: 14 }}>
                  {(["en", "fr", "de"] as Lang[]).map((languageKey) => (
                    <button
                      key={languageKey}
                      onClick={() => {
                        setShowLogoMenu(false);
                        goToTutorial(languageKey);
                      }}
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(96,165,250,0.32)",
                        background: "linear-gradient(180deg, rgba(17,24,39,0.95), rgba(15,23,42,0.95))",
                        color: "#fff",
                        padding: "18px 20px",
                        fontSize: 18,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 0 16px rgba(59,130,246,0.16)",
                      }}
                    >
                      <span style={{ marginRight: 10 }}>{t.flags[languageKey]}</span>
                      {t.langNames[languageKey]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={startQuickGame}
              style={{
                borderRadius: 18,
                border: "1px solid rgba(96,165,250,0.40)",
                background: "linear-gradient(180deg, #0d7fff, #005fca)",
                color: "#fff",
                padding: "16px 20px",
                fontSize: 17,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 0 18px rgba(59,130,246,0.24)",
              }}
            >
              Quick game
            </button>
            <button
              onClick={() => setScreen("tutorial")}
              style={{
                borderRadius: 18,
                border: "1px solid rgba(96,165,250,0.28)",
                background: "rgba(255,255,255,0.03)",
                color: "#dbeafe",
                padding: "16px 20px",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Guided setup
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const tutorialView = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 860, display: "grid", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {entry.slides.map((_, index) => (
              <div
                key={index}
                style={{
                  width: tutorialIndex === index ? 36 : 12,
                  height: 12,
                  borderRadius: 999,
                  background: tutorialIndex === index ? "#3b82f6" : "rgba(255,255,255,0.16)",
                  boxShadow: tutorialIndex === index ? "0 0 18px rgba(59,130,246,0.55)" : "none",
                  transition: "all 180ms ease",
                }}
              />
            ))}
          </div>

          <div
            style={{
              borderRadius: 28,
              border: "1px solid rgba(96,165,250,0.24)",
              background: "linear-gradient(180deg, rgba(10,15,28,0.98), rgba(7,10,20,0.98))",
              boxShadow: "0 0 34px rgba(59,130,246,0.12)",
              padding: 32,
              textAlign: "center",
            }}
          >
            <div style={{ width: 96, height: 96, borderRadius: 999, margin: "0 auto 20px", display: "grid", placeItems: "center", background: "rgba(59,130,246,0.10)", border: "1px solid rgba(96,165,250,0.22)", fontSize: 40, boxShadow: "0 0 22px rgba(59,130,246,0.18)" }}>
              {entry.slides[tutorialIndex].icon}
            </div>
            <div style={{ color: "#93c5fd", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{entry.tutorialTitle}</div>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(28px, 4vw, 38px)" }}>{entry.slides[tutorialIndex].title}</h2>
            <p style={{ margin: "0 auto", maxWidth: 620, color: "rgba(255,255,255,0.82)", fontSize: 18, lineHeight: 1.7 }}>{entry.slides[tutorialIndex].body}</p>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
              <button
                onClick={() => setTutorialIndex((prev) => Math.max(0, prev - 1))}
                disabled={tutorialIndex === 0}
                style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.04)", color: "#fff", padding: "14px 18px", cursor: tutorialIndex === 0 ? "not-allowed" : "pointer", opacity: tutorialIndex === 0 ? 0.4 : 1, fontWeight: 700 }}
              >
                {entry.back}
              </button>
              <button
                onClick={() => setScreen("setup")}
                style={{ borderRadius: 16, border: "1px dashed rgba(96,165,250,0.32)", background: "transparent", color: "#cfe6ff", padding: "14px 18px", cursor: "pointer", fontWeight: 700 }}
              >
                {entry.skip}
              </button>
              <button
                onClick={() => {
                  if (tutorialIndex < entry.slides.length - 1) setTutorialIndex((prev) => prev + 1);
                  else setScreen("setup");
                }}
                style={{ borderRadius: 16, border: "1px solid rgba(96,165,250,0.45)", background: "linear-gradient(180deg, #0d7fff, #005fca)", color: "#fff", padding: "14px 18px", cursor: "pointer", fontWeight: 800, boxShadow: "0 0 18px rgba(59,130,246,0.26)" }}
              >
                {tutorialIndex === entry.slides.length - 1 ? entry.startSetup : entry.next}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const setupView = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 18,
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 8,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          <div style={{ color: "#93c5fd", fontSize: 14, fontWeight: 700 }}>
            {setupStage === 1 ? "Step 1 • Pick your opponent" : setupStage === 2 ? "Step 2 • Choose the pressure" : setupStage === 3 ? "Step 3 • Choose the atmosphere" : "Step 4 • Ready to play"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.76)", fontSize: 15 }}>
            {setupStage === 1
              ? "Start simple. We reveal the rest only when you need it."
              : setupStage === 2
              ? "Choose challenge and style."
              : setupStage === 3
              ? "Quiet and focused, or spoken and social."
              : "Your game is almost ready."}
          </div>
        </div>

        <Panel title={ui.playerType}>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.70)" }}>
              {setup.opponentMode === "local" ? ui.classicAvailable : ui.liliModesAvailable}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ActionButton
                onClick={() => {
                  setSetup((prev) => ({
                    ...prev,
                    opponentMode: "local",
                    gameMode: "classic",
                  }));
                  setSetupStage(3);
                }}
                active={setup.opponentMode === "local"}
                fullWidth
              >
                {ui.twoPlayers}
              </ActionButton>

              <ActionButton
                onClick={() => {
                  setSetup((prev) => ({ ...prev, opponentMode: "ai" }));
                  setSetupStage(2);
                }}
                active={setup.opponentMode === "ai"}
                fullWidth
              >
                {ui.versusAi}
              </ActionButton>
            </div>
          </div>
        </Panel>

        {setupStage >= 2 && setup.opponentMode === "ai" && (
          <>
            <Panel title={ui.chooseDifficulty}>
              <div style={{ display: "grid", gap: 12 }}>
                {(
                  [
                    [1, ui.d1],
                    [2, ui.d2],
                    [3, ui.d3],
                    [4, ui.d4],
                    [5, ui.d5],
                  ] as [Difficulty, string][]
                ).map(([lvl, label]) => {
                  const isLevel4 = lvl === 4;
                  const isLevel5 = lvl === 5;
                  return (
                    <div key={lvl} style={{ display: "grid", gap: 6 }}>
                      <div
                        style={{
                          borderRadius: 18,
                          border: isLevel4
                            ? difficulty === lvl
                              ? "1px solid rgba(250, 204, 21, 0.85)"
                              : "1px solid rgba(250, 204, 21, 0.32)"
                            : isLevel5
                            ? difficulty === lvl
                              ? "1px solid rgba(239, 68, 68, 0.9)"
                              : "1px solid rgba(239, 68, 68, 0.34)"
                            : "none",
                          boxShadow: isLevel4
                            ? "0 0 16px rgba(250, 204, 21, 0.14)"
                            : isLevel5
                            ? "0 0 18px rgba(239, 68, 68, 0.16)"
                            : "none",
                        }}
                      >
                        <ActionButton
                          onClick={() => setDifficulty(lvl)}
                          active={difficulty === lvl}
                          fullWidth
                        >
                          <div style={{ textAlign: "left", width: "100%", fontWeight: 700 }}>
                            {lvl}. {label}
                          </div>
                        </ActionButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title={ui.chooseMode}>
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
                    onClick={() => {
                      setSetup((prev) => ({ ...prev, gameMode: modeKey }));
                      setSetupStage(3);
                    }}
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
            </Panel>
          </>
        )}

        {setupStage >= 3 && (
          <>
            <Panel title={t.controlTitle}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <ActionButton
                  onClick={() => {
                    setSetup((prev) => ({ ...prev, controlMode: "quiet" }));
                    setFocusMode(true);
                    setSetupStage(4);
                  }}
                  active={setup.controlMode === "quiet"}
                  fullWidth
                >
                  {t.quiet}
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setSetup((prev) => ({ ...prev, controlMode: "voice" }));
                    setFocusMode(false);
                    setSetupStage(4);
                  }}
                  active={setup.controlMode === "voice"}
                  fullWidth
                >
                  {t.voice}
                </ActionButton>
              </div>
            </Panel>

            <Panel
              title={lang === "fr" ? "Repères rapides" : lang === "de" ? "Schnelle Orientierung" : "Quick guide"}
            >
              <div style={{ display: "grid", gap: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.82)", fontSize: 14 }}>
                <div>
                  {lang === "fr"
                    ? "900 à 1200 ELO : niveau découverte. 1500 : vrai parfum de club. 1800 et 2100 : ça commence à piquer."
                    : lang === "de"
                    ? "900 bis 1200 ELO: Einstieg. 1500: klarer Vereinscharakter. 1800 und 2100: jetzt wird es ernst."
                    : "900 to 1200 ELO feels beginner-to-street-smart. 1500 feels like a real club player. 1800 and 2100 start to bite."}
                </div>
                <div>
                  {lang === "fr"
                    ? "Bobby Fischer évoque la précision et la volonté. Judit Polgár évoque le courage créatif et l’attaque."
                    : lang === "de"
                    ? "Bobby Fischer steht für Präzision und Willenskraft. Judit Polgár steht für kreative Angriffslust."
                    : "Bobby Fischer stands for precision and willpower. Judit Polgár stands for fearless creative attack."}
                </div>
              </div>
            </Panel>
          </>
        )}

        {setupStage >= 4 && (
          <div style={{ display: "grid", gap: 12, justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 420 }}>
              <Panel title={t.startGame}>
                <ActionButton
                  onClick={() => {
                    restartGame();
                    setScreen("play");
                  }}
                  active
                  fullWidth
                >
                  {setup.opponentMode === "ai" ? "Start the duel" : ui.start}
                </ActionButton>
              </Panel>
            </div>

            <div style={{ width: "100%", maxWidth: 420 }}>
              <ActionButton onClick={goToLanding} fullWidth>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <LogOut size={16} /> {entry.goodbye}
                </div>
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const playView = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ width: "100%", maxWidth: playStageMaxWidth, margin: "0 auto", display: "grid", gap: 16 }}>
        {focusMode ? compactPlayHeader : topImmersiveBar}
        {boardView}
        {minimalControls}
        {!focusMode && advancedOptionsPanel}
      </div>
    </motion.div>
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
        {screen !== "landing" && (
          <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                border: "1px solid rgba(96,165,250,0.18)",
                borderRadius: 24,
                padding: "14px 18px",
                background: "linear-gradient(180deg, rgba(10,15,28,0.95), rgba(7,10,20,0.95))",
                boxShadow: "0 0 26px rgba(59,130,246,0.08)",
              }}
            >
              <button
                onClick={() => setShowLogoMenu((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    display: "grid",
                    placeItems: "center",
                    background: "radial-gradient(circle, rgba(59,130,246,0.28), rgba(59,130,246,0.08) 68%, transparent 100%)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.26)",
                  }}
                >
                  <img
                    src={lobster}
                    alt="Lobster Inc."
                    style={{
                      width: 42,
                      height: 42,
                      objectFit: "contain",
                      filter: "drop-shadow(0 0 12px rgba(96,165,250,0.55))",
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>Chessilou</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.68)" }}>
                    by Lobster Inc. • click logo for language
                  </div>
                </div>
              </button>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", textAlign: "right" }}>
                <div>{setup.opponentMode === "ai" ? ui.versusAi : ui.twoPlayers}</div>
                <div>{ui.difficultyLabel}: {difficultyName}</div>
              </div>
            </div>

            <AnimatePresence>
              {showLogoMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    border: "1px solid rgba(96,165,250,0.18)",
                    borderRadius: 20,
                    padding: 16,
                    background: "rgba(10,15,28,0.96)",
                    display: "grid",
                    gap: 12,
                    maxWidth: 420,
                  }}
                >
                  <div style={{ color: "#93c5fd", fontWeight: 700 }}>{entry.chooseLanguage}</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(["en", "fr", "de"] as Lang[]).map((languageKey) => (
                      <ActionButton
                        key={languageKey}
                        onClick={() => {
                          setLang(languageKey);
                          setShowLogoMenu(false);
                        }}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {screen === "landing" && landingView}
        {screen === "tutorial" && tutorialView}
        {screen === "setup" && setupView}
        {screen === "play" && playView}

        <div className="app-footer" style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          {t.allRightsReserved}
        </div>
      </div>
    </div>
  );
}