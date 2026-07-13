import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, playCard, takeCards, endAttack, getBotAttack, getBotDefense, Suit } from "@/lib/durak";
import CardComponent from "./Card";
import { Shield, Swords, LogOut } from "lucide-react";

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
  onLeaveGame: () => void;
  playerName: string;
  isHost: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export default function GameBoard({ gameState, onGameStateChange, onLeaveGame, playerName }: GameBoardProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const messageTimer = useRef<ReturnType<typeof setTimeout>>();

  const player = gameState.players[0];
  const opponent = gameState.players[1];
  const isPlayerTurn = gameState.currentPlayerIndex === 0;
  const isPlayerAttacker = player.role === "attacker";
  const isPlayerDefender = player.role === "defender";

  const showToast = useCallback((text: string) => {
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setMessage(text);
    setShowMessage(true);
    messageTimer.current = setTimeout(() => setShowMessage(false), 2500);
  }, []);

  useEffect(() => {
    if (gameState.phase !== "playing") return;
    if (gameState.currentPlayerIndex !== 1) return;
    if (!opponent.isBot) return;

    setBotThinking(true);
    const timer = setTimeout(() => {
      setBotThinking(false);

      if (opponent.role === "attacker") {
        const botCard = getBotAttack(gameState);
        if (botCard) {
          const newState = playCard(gameState, 1, botCard.id);
          if (newState) {
            onGameStateChange(newState);
            showToast(`${opponent.name} атакует!`);
          }
        } else {
          const newState = endAttack(gameState);
          onGameStateChange(newState);
          showToast(`${opponent.name} завершает атаку`);
        }
      } else if (opponent.role === "defender") {
        const botCard = getBotDefense(gameState);
        if (botCard) {
          const newState = playCard(gameState, 1, botCard.id);
          if (newState) {
            onGameStateChange(newState);
            showToast(`${opponent.name} отбивается!`);
          }
        } else {
          const newState = takeCards(gameState);
          onGameStateChange(newState);
          showToast(`${opponent.name} берет карты`);
        }
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [gameState, opponent.isBot, opponent.name, opponent.role, onGameStateChange, showToast]);

  const handleCardClick = (cardId: string) => {
    if (!isPlayerTurn || gameState.phase !== "playing") return;

    if (selectedCardId === cardId) {
      const newState = playCard(gameState, 0, cardId);
      if (newState) {
        onGameStateChange(newState);
        setSelectedCardId(null);
        const action = player.role === "attacker" ? "Атакуешь!" : "Отбиваешься!";
        showToast(action);
      } else {
        showToast("Нельзя сыграть эту карту");
      }
    } else {
      setSelectedCardId(cardId);
    }
  };

  const handleTakeCards = () => {
    if (!isPlayerDefender || !isPlayerTurn) return;
    const newState = takeCards(gameState);
    onGameStateChange(newState);
    showToast("Ты взял карты");
  };

  const handleEndAttack = () => {
    if (!isPlayerAttacker || !isPlayerTurn) return;
    const newState = endAttack(gameState);
    onGameStateChange(newState);
    showToast("Атака завершена");
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const getCardStyle = (index: number, total: number): React.CSSProperties => {
    if (total <= 1) return {};
    const maxSpread = Math.min(total * 12, 120);
    const startOffset = -maxSpread / 2;
    const step = maxSpread / (total - 1);
    const rotation = (index - (total - 1) / 2) * 3;
    return {
      transform: `translateX(${startOffset + index * step}px) rotate(${rotation}deg)`,
      zIndex: index,
    };
  };



  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden relative">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(145,40%,30%)] text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <span className="text-lg">{opponent.name}</span>
            {opponent.role === "attacker" && <Swords className="w-4 h-4 text-[hsl(45,90%,55%)]" />}
            {opponent.role === "defender" && <Shield className="w-4 h-4 text-[hsl(160,70%,55%)]" />}
          </div>
          <span className="text-sm opacity-80">{opponent.cardCount} карт</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <span className="text-xl">{SUIT_SYMBOLS[gameState.trumpSuit]}</span>
            <span className="text-sm">козырь</span>
          </div>
          <span className="text-sm opacity-80">{gameState.deck.length} в колоде</span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col relative game-table mx-2 my-1 overflow-hidden">
        {/* Opponent hand */}
        <div className="flex justify-center items-end pt-3 pb-1 shrink-0">
          <div className="flex items-end" style={{ height: "60px" }}>
            {Array.from({ length: opponent.cardCount }).map((_, i) => (
              <div
                key={i}
                className="card-back w-9 h-13"
                style={{
                  marginLeft: i > 0 ? "-20px" : "0",
                  zIndex: i,
                }}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="relative">
            {/* Deck and trump */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              {gameState.deck.length > 0 && (
                <>
                  <div className="card-back w-10 h-14" />
                  <span className="text-white/60 text-xs">{gameState.deck.length}</span>
                </>
              )}
              <div className="playing-card w-10 h-14 flex items-center justify-center bg-white">
                <span className="text-lg">{SUIT_SYMBOLS[gameState.trumpSuit]}</span>
              </div>
            </div>

            {/* Table cards */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
              {gameState.table.length === 0 ? (
                <div className="text-white/30 text-sm italic">Стол пуст</div>
              ) : (
                gameState.table.map((pair, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex flex-col items-center gap-1">
                      {pair.attack && (
                        <CardComponent card={pair.attack} small />
                      )}
                      {pair.defense && (
                        <div className="absolute top-3 left-3">
                          <CardComponent card={pair.defense} small />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Player hand */}
        <div className="flex flex-col items-center pb-2 pt-1 shrink-0">
          <div className="flex items-end justify-center" style={{ height: "90px", position: "relative" }}>
            {player.hand.map((card, index) => (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: -28,
                  ...getCardStyle(index, player.hand.length),
                }}
              >
                <CardComponent
                  card={card}
                  selected={selectedCardId === card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!isPlayerTurn}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-t-2 border-[hsl(330,30%,25%)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[hsl(330,85%,60%)]/10 rounded-full px-3 py-1.5">
            <span className="text-sm font-bold text-[hsl(330,30%,25%)]">{player.name}</span>
            {player.role === "attacker" && <Swords className="w-4 h-4 text-[hsl(330,85%,60%)]" />}
            {player.role === "defender" && <Shield className="w-4 h-4 text-[hsl(160,70%,45%)]" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlayerAttacker && isPlayerTurn && gameState.table.length > 0 && (
            <button onClick={handleEndAttack} className="sticker-btn-mint text-sm py-2 px-4">
              Завершить
            </button>
          )}
          {isPlayerDefender && isPlayerTurn && gameState.table.length > 0 && (
            <button onClick={handleTakeCards} className="sticker-btn-yellow text-sm py-2 px-4">
              Беру
            </button>
          )}
          {!isPlayerTurn && botThinking && (
            <div className="flex items-center gap-2 text-sm text-[hsl(330,20%,40%)]">
              <div className="w-4 h-4 border-2 border-[hsl(330,85%,60%)] border-t-transparent rounded-full animate-spin" />
              Думает...
            </div>
          )}
        </div>

        <button onClick={onLeaveGame} className="text-[hsl(330,20%,40%)] hover:text-[hsl(330,30%,25%)]">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Toast message */}
      {showMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[hsl(330,30%,25%)] text-white px-4 py-2 rounded-full text-sm font-bold animate-pop z-50">
          {message}
        </div>
      )}
    </div>
  );
}
