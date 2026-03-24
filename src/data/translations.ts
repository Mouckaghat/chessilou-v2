export type Lang = "en" | "fr" | "de";
export type GameMode = "classic" | "learn" | "mate5" | "protect" | "battle";
export type OpponentMode = "local" | "ai";
export type ControlMode = "voice" | "quiet";

export const translations = {
  en: {
    flags: { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪" },
    langNames: { en: "English", fr: "French", de: "German" },
    tagline: "Voice chess for family moments, birthday fun, and playful strategy.",
    signature: "Crafted by Lobster Inc., under the Jura Technology umbrella.",
    brandShort: "Lobster Inc.",
    brandClickHint: "Click to view brand information",
    brandTitle: "Lobster Inc.",
    brandSubtitle: "A creative lab under Jura Technology",
    brandBody1:
      "Chessilou belongs to a playful product universe designed to mix family fun, elegant interaction, and smart digital experiences.",
    brandBody2:
      "Brand purpose: make technology feel warm, memorable, premium, and a little mischievous.",
    brandBody3: "Lobster Inc. and Chessilou are presented under the Jura Technology umbrella.",
    allRightsReserved: "© Lobster Inc. / Jura Technology. All rights reserved.",

    setupTitle: "Step 1 · Set up your game",
    modeTitle: "Game mode",
    opponentTitle: "Opponent mode",
    controlTitle: "Control mode",
    notationTitle: "Piece notation",
    startGame: "Start game",

    classic: "Classic",
    learn: "Learn mode",
    mate5: "Mate in 5",
    protect: "Protect your king",
    battle: "Battle Royale",

    classicDesc: "Standard chess, elegant and timeless.",
    learnDesc: "Learn how pieces move and build confidence.",
    mate5Desc: "Solve tactical missions and chase checkmate.",
    protectDesc: "Defend your king under pressure.",
    battleDesc: "Aim for the greatest amount of casualties.",

    local: "Local 2 Players",
    ai: "Play vs AI",
    voice: "Voice",
    quiet: "Quiet",

    board: "Board",
    currentSetup: "Current setup",
    controls: "Controls",
    status: "Status",
    moveList: "Move list",
    noMovesYet: "No moves yet.",
    toMove: "to move",

    voiceCommand: "Voice command",
    quietCommand: "Quiet command",
    readyForVoice: "Ready for voice move",
    listening: "Listening / transcribing...",
    voiceHelp:
      "Tap once to start recording, tap again to stop. Chessilou will transcribe the move and play it automatically.",
    voiceOn: "🎙️ Voice ON",
    voiceOff: "⏹️ Voice OFF",
    voiceProd: "Production version: connect browser audio capture here and send to Whisper.",

    quietHelp:
      "Tap a piece directly on the board. Legal target squares glow blue. Tap a highlighted square to complete the move.",
    howItWorks: "How it works:",
    how1: "1. Tap the piece you want to move",
    how2: "2. Watch the legal squares light up",
    how3: "3. Tap one highlighted square",

    newGame: "New",
    undo: "Undo",
    setup: "Setup",

    selected: "Selected",
    legalTargets: "Legal targets",
    none: "none",
    lastVoiceCommand: "Last voice command",

    welcome: "Welcome to Chessilou V3.",
    gameStarted: "Game started.",
    newGameStarted: "New game started.",
    selectionCleared: "Selection cleared.",
    lastMoveUndone: "Last move undone.",
    draw: "Draw.",
    noPieceOn: "No piece on",
    noLegalMovesFrom: "No legal moves from",
    itIsTurn: "It is",
    turn: "turn",
    chooseLegalTarget: "Choose a legal target.",
    chooseHighlightedSquare: "Choose a highlighted square.",
    illegalMove: "Illegal move",
    movePlayed: "Move played",
    aiPlayed: "AI played",
    checkmateDelivered: "Checkmate delivered by",
    tapPieceToMove: "Tap the piece you want to move.",
    watchSquaresThenTap:
      "Watch the legal squares light up, then tap one highlighted square.",

    helperTitle: "First move helper",
    helperFooter: "Each new game shows a different white piece example.",
    helperTry: "Try this example: tap",
    helperThen: "then tap one highlighted square such as",

    modeComingSoonTitle: "Mode preview",
    learnPreview:
      "Learn mode will teach how each piece moves, then introduce mini tactical lessons and beginner-friendly coaching.",
    mate5Preview:
      "Mate in 5 will become a puzzle mission mode where the user solves forced checkmate sequences.",
    protectPreview:
      "Protect your king will focus on defense, emergency responses, and avoiding dangerous attacks.",
    battlePreview:
      "Battle Royale will reward captures, aggression, and tactical chaos while keeping legal chess movement.",
    classicPreview:
      "Classic mode is fully active. This is the current main way to play Chessilou.",

    modeLabel: "Mode",
    opponentLabel: "Opponent",
    languageLabel: "Language",
    controlLabel: "Control",

    notationLegend: [
      { code: "K", label: "King" },
      { code: "Q", label: "Queen" },
      { code: "R", label: "Rook" },
      { code: "B", label: "Bishop" },
      { code: "N", label: "Knight" },
    ],
  },

  fr: {
    flags: { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪" },
    langNames: { en: "Anglais", fr: "Français", de: "Allemand" },
    tagline: "Échecs vocaux pour les moments en famille, les anniversaires et la stratégie ludique.",
    signature: "Créé par Lobster Inc., sous l’ombrelle Jura Technology.",
    brandShort: "Lobster Inc.",
    brandClickHint: "Cliquez pour voir les informations de la marque",
    brandTitle: "Lobster Inc.",
    brandSubtitle: "Un laboratoire créatif sous Jura Technology",
    brandBody1:
      "Chessilou appartient à un univers produit ludique conçu pour mêler plaisir familial, interaction élégante et expériences numériques intelligentes.",
    brandBody2:
      "But de la marque : rendre la technologie chaleureuse, mémorable, premium et légèrement malicieuse.",
    brandBody3: "Lobster Inc. et Chessilou sont présentés sous l’ombrelle Jura Technology.",
    allRightsReserved: "© Lobster Inc. / Jura Technology. Tous droits réservés.",

    setupTitle: "Étape 1 · Configurez votre partie",
    modeTitle: "Mode de jeu",
    opponentTitle: "Mode adversaire",
    controlTitle: "Mode de contrôle",
    notationTitle: "Notation des pièces",
    startGame: "Commencer la partie",

    classic: "Classique",
    learn: "Mode apprentissage",
    mate5: "Mat en 5",
    protect: "Protège ton roi",
    battle: "Battle Royale",

    classicDesc: "Les échecs standards, élégants et intemporels.",
    learnDesc: "Apprenez les déplacements des pièces et gagnez en confiance.",
    mate5Desc: "Résolvez des missions tactiques et cherchez le mat.",
    protectDesc: "Défendez votre roi sous pression.",
    battleDesc: "Visez le plus grand nombre de victimes.",

    local: "2 joueurs en local",
    ai: "Jouer contre l’IA",
    voice: "Voix",
    quiet: "Silencieux",

    board: "Plateau",
    currentSetup: "Configuration actuelle",
    controls: "Contrôles",
    status: "Statut",
    moveList: "Liste des coups",
    noMovesYet: "Aucun coup pour le moment.",
    toMove: "à jouer",

    voiceCommand: "Commande vocale",
    quietCommand: "Commande silencieuse",
    readyForVoice: "Prêt pour un coup vocal",
    listening: "Écoute / transcription...",
    voiceHelp:
      "Touchez une fois pour démarrer l’enregistrement, touchez encore pour arrêter. Chessilou transcrira le coup et le jouera automatiquement.",
    voiceOn: "🎙️ Voix ON",
    voiceOff: "⏹️ Voix OFF",
    voiceProd: "Version production : connecter ici la capture audio du navigateur et l’envoyer à Whisper.",

    quietHelp:
      "Touchez directement une pièce sur le plateau. Les cases légales brillent en bleu. Touchez une case surlignée pour terminer le coup.",
    howItWorks: "Comment cela fonctionne :",
    how1: "1. Touchez la pièce que vous voulez déplacer",
    how2: "2. Regardez les cases légales s’allumer",
    how3: "3. Touchez une case surlignée",

    newGame: "Nouveau",
    undo: "Annuler",
    setup: "Réglages",

    selected: "Sélectionné",
    legalTargets: "Cases légales",
    none: "aucune",
    lastVoiceCommand: "Dernière commande vocale",

    welcome: "Bienvenue dans Chessilou V3.",
    gameStarted: "Partie commencée.",
    newGameStarted: "Nouvelle partie commencée.",
    selectionCleared: "Sélection effacée.",
    lastMoveUndone: "Dernier coup annulé.",
    draw: "Nulle.",
    noPieceOn: "Aucune pièce sur",
    noLegalMovesFrom: "Aucun coup légal depuis",
    itIsTurn: "C’est au tour des",
    turn: "",
    chooseLegalTarget: "Choisissez une case légale.",
    chooseHighlightedSquare: "Choisissez une case surlignée.",
    illegalMove: "Coup illégal",
    movePlayed: "Coup joué",
    aiPlayed: "L’IA a joué",
    checkmateDelivered: "Échec et mat infligé par",
    tapPieceToMove: "Touchez la pièce que vous voulez déplacer.",
    watchSquaresThenTap:
      "Regardez les cases légales s’allumer, puis touchez une case surlignée.",

    helperTitle: "Aide premier coup",
    helperFooter: "Chaque nouvelle partie montre un exemple différent avec une pièce blanche.",
    helperTry: "Essayez cet exemple : touchez",
    helperThen: "puis touchez une case surlignée comme",

    modeComingSoonTitle: "Aperçu du mode",
    learnPreview:
      "Le mode apprentissage expliquera le déplacement des pièces, puis introduira des mini-leçons tactiques et un coaching pour débutants.",
    mate5Preview:
      "Mat en 5 deviendra un mode mission avec des séquences forcées de mat à résoudre.",
    protectPreview:
      "Protège ton roi se concentrera sur la défense, les réponses d’urgence et l’évitement des attaques dangereuses.",
    battlePreview:
      "Battle Royale récompensera les captures, l’agression et le chaos tactique tout en gardant les mouvements légaux des échecs.",
    classicPreview:
      "Le mode classique est entièrement actif. C’est actuellement la manière principale de jouer à Chessilou.",

    modeLabel: "Mode",
    opponentLabel: "Adversaire",
    languageLabel: "Langue",
    controlLabel: "Contrôle",

    notationLegend: [
      { code: "R", label: "Roi" },
      { code: "D", label: "Dame" },
      { code: "T", label: "Tour" },
      { code: "F", label: "Fou" },
      { code: "C", label: "Cavalier" },
    ],
  },

  de: {
    flags: { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪" },
    langNames: { en: "Englisch", fr: "Französisch", de: "Deutsch" },
    tagline: "Sprachschach für Familienmomente, Geburtstagsfreude und spielerische Strategie.",
    signature: "Entwickelt von Lobster Inc. unter dem Dach von Jura Technology.",
    brandShort: "Lobster Inc.",
    brandClickHint: "Klicken Sie, um Markeninformationen zu sehen",
    brandTitle: "Lobster Inc.",
    brandSubtitle: "Ein kreatives Labor unter Jura Technology",
    brandBody1:
      "Chessilou gehört zu einem spielerischen Produktuniversum, das Familienfreude, elegante Interaktion und smarte digitale Erlebnisse verbindet.",
    brandBody2:
      "Markenziel: Technologie warm, einprägsam, hochwertig und ein wenig schelmisch wirken zu lassen.",
    brandBody3: "Lobster Inc. und Chessilou werden unter dem Dach von Jura Technology präsentiert.",
    allRightsReserved: "© Lobster Inc. / Jura Technology. Alle Rechte vorbehalten.",

    setupTitle: "Schritt 1 · Spiel einrichten",
    modeTitle: "Spielmodus",
    opponentTitle: "Gegnermodus",
    controlTitle: "Steuerungsmodus",
    notationTitle: "Figurennotation",
    startGame: "Spiel starten",

    classic: "Klassisch",
    learn: "Lernmodus",
    mate5: "Matt in 5",
    protect: "Beschütze deinen König",
    battle: "Battle Royale",

    classicDesc: "Normales Schach, elegant und zeitlos.",
    learnDesc: "Lerne die Zugarten der Figuren und baue Selbstvertrauen auf.",
    mate5Desc: "Löse taktische Missionen und jage das Matt.",
    protectDesc: "Verteidige deinen König unter Druck.",
    battleDesc: "Ziele auf die höchste Zahl an Opfern.",

    local: "2 Spieler lokal",
    ai: "Gegen KI spielen",
    voice: "Stimme",
    quiet: "Still",

    board: "Brett",
    currentSetup: "Aktuelle Einstellungen",
    controls: "Steuerung",
    status: "Status",
    moveList: "Zugliste",
    noMovesYet: "Noch keine Züge.",
    toMove: "am Zug",

    voiceCommand: "Sprachbefehl",
    quietCommand: "Stiller Modus",
    readyForVoice: "Bereit für Sprachzug",
    listening: "Hört zu / transkribiert...",
    voiceHelp:
      "Einmal tippen, um die Aufnahme zu starten, erneut tippen, um zu stoppen. Chessilou transkribiert den Zug und spielt ihn automatisch.",
    voiceOn: "🎙️ Stimme EIN",
    voiceOff: "⏹️ Stimme AUS",
    voiceProd: "Produktionsversion: Browser-Audioaufnahme hier anschließen und an Whisper senden.",

    quietHelp:
      "Tippen Sie direkt auf eine Figur auf dem Brett. Legale Felder leuchten blau. Tippen Sie auf ein markiertes Feld, um den Zug auszuführen.",
    howItWorks: "So funktioniert es:",
    how1: "1. Tippen Sie auf die Figur, die Sie bewegen möchten",
    how2: "2. Beobachten Sie, wie die legalen Felder aufleuchten",
    how3: "3. Tippen Sie auf ein markiertes Feld",

    newGame: "Neu",
    undo: "Rückgängig",
    setup: "Setup",

    selected: "Ausgewählt",
    legalTargets: "Legale Ziele",
    none: "keine",
    lastVoiceCommand: "Letzter Sprachbefehl",

    welcome: "Willkommen bei Chessilou V3.",
    gameStarted: "Spiel gestartet.",
    newGameStarted: "Neues Spiel gestartet.",
    selectionCleared: "Auswahl aufgehoben.",
    lastMoveUndone: "Letzter Zug rückgängig gemacht.",
    draw: "Remis.",
    noPieceOn: "Keine Figur auf",
    noLegalMovesFrom: "Keine legalen Züge von",
    itIsTurn: "Es ist",
    turn: "am Zug",
    chooseLegalTarget: "Wählen Sie ein legales Zielfeld.",
    chooseHighlightedSquare: "Wählen Sie ein markiertes Feld.",
    illegalMove: "Illegaler Zug",
    movePlayed: "Zug gespielt",
    aiPlayed: "KI spielte",
    checkmateDelivered: "Schachmatt erzielt von",
    tapPieceToMove: "Tippen Sie auf die Figur, die Sie bewegen möchten.",
    watchSquaresThenTap:
      "Beobachten Sie die blau markierten Felder und tippen Sie dann auf eines davon.",

    helperTitle: "Erste-Zug-Hilfe",
    helperFooter: "Jedes neue Spiel zeigt ein anderes Beispiel mit einer weißen Figur.",
    helperTry: "Probieren Sie dieses Beispiel: Tippen Sie auf",
    helperThen: "und dann auf ein markiertes Feld wie",

    modeComingSoonTitle: "Modus-Vorschau",
    learnPreview:
      "Der Lernmodus wird erklären, wie sich jede Figur bewegt, und später Mini-Taktiklektionen sowie anfängerfreundliches Coaching bieten.",
    mate5Preview:
      "Matt in 5 wird ein Missionsmodus, in dem erzwungene Mattsequenzen gelöst werden.",
    protectPreview:
      "Beschütze deinen König konzentriert sich auf Verteidigung, Notfallreaktionen und das Vermeiden gefährlicher Angriffe.",
    battlePreview:
      "Battle Royale belohnt Schlagen, Aggression und taktisches Chaos bei weiterhin legalen Schachzügen.",
    classicPreview:
      "Der klassische Modus ist vollständig aktiv. Das ist derzeit die Hauptspielweise von Chessilou.",

    modeLabel: "Modus",
    opponentLabel: "Gegner",
    languageLabel: "Sprache",
    controlLabel: "Steuerung",

    notationLegend: [
      { code: "K", label: "König" },
      { code: "D", label: "Dame" },
      { code: "T", label: "Turm" },
      { code: "L", label: "Läufer" },
      { code: "S", label: "Springer" },
    ],
  },
} as const;