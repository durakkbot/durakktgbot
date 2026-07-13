import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { GameState, GamePhase, initializeGame, generateInviteLink } from "@/lib/durak";
import GameBoard from "@/components/GameBoard";
import { Sparkles, Swords, Copy, Check, User, Bot, Users } from "lucide-react";

export default function Index() {
  const { user, startParam, haptic } = useTelegram();
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [gameMode, setGameMode] = useState<"bot" | "pvp" | null>(null);
  const [playerName, setPlayerName] = useState("Игрок");

  useEffect(() => {
    if (user?.first_name) {
      setPlayerName(user.first_name);
    }
  }, [user]);

  useEffect(() => {
    if (startParam) {
      // Join game via invite link
      const state = initializeGame(playerName, "Соперник", false);
      setGameState(state);
      setPhase("playing");
    }
  }, [startParam, playerName]);

  const createGame = useCallback((mode: "bot" | "pvp") => {
    haptic?.medium?.();
    setGameMode(mode);

    if (mode === "bot") {
      const state = initializeGame(playerName, "Бот Вася", true);
      setGameState(state);
      setPhase("playing");
    } else {
      const link = generateInviteLink();
      setInviteLink(link);
      setPhase("waiting");
    }
  }, [playerName, haptic]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    haptic?.success?.();
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink, haptic]);

  const startBotGame = useCallback(() => {
    const state = initializeGame(playerName, "Бот Вася", true);
    setGameState(state);
    setPhase("playing");
  }, [playerName]);

  const shareGame = useCallback(() => {
    const text = `Присоединяйся к игре в Дурака! 🃏 ${inviteLink}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`
      );
    }
  }, [inviteLink]);

  if (phase === "menu") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background">
        {/* Floating decorations */}
        <div className="fixed top-20 left-8 text-3xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: "0s" }}>⭐</div>
        <div className="fixed top-40 right-12 text-2xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: "1s" }}>✨</div>
        <div className="fixed bottom-32 left-16 text-2xl animate-float opacity-25 pointer-events-none" style={{ animationDelay: "2s" }}>🃏</div>

        <div className="animate-bounce-in text-center max-w-sm w-full">
          {/* Logo */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(330,85%,60%)] to-[hsl(160,70%,55%)] flex items-center justify-center border-4 border-[hsl(330,30%,25%)] shadow-[6px_6px_0_hsl(330,30%,25%)]">
              <span className="text-5xl">🃏</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[hsl(45,90%,55%)] rounded-full flex items-center justify-center border-2 border-[hsl(330,30%,25%)] text-sm font-bold">
              36
            </div>
          </div>

          <h1 className="text-4xl font-black text-[hsl(330,30%,25%)] text-shadow-sticker mb-2">
            Дурак
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-semibold">
            Онлайн
          </p>

          {/* Player info */}
          {user && (
            <div className="sticker-card p-3 mb-6 flex items-center gap-3 mx-auto max-w-xs">
              {user.photo_url ? (
                <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full border-2 border-[hsl(330,30%,25%)]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[hsl(330,85%,60%)] flex items-center justify-center text-white font-bold border-2 border-[hsl(330,30%,25%)]">
                  {user.first_name[0]}
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-sm text-[hsl(330,30%,25%)]">{user.first_name}</p>
                <p className="text-xs text-muted-foreground">Готов к игре!</p>
              </div>
            </div>
          )}

          {/* Game mode buttons */}
          <div className="space-y-4">
            <button
              onClick={() => createGame("pvp")}
              className="sticker-btn-pink w-full text-lg flex items-center justify-center gap-3"
            >
              <Users className="w-6 h-6" />
              Создать игру
            </button>

            <button
              onClick={() => createGame("bot")}
              className="sticker-btn-yellow w-full text-lg flex items-center justify-center gap-3"
            >
              <Bot className="w-6 h-6" />
              Играть с ботом
            </button>
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            <p>Классический дурак на 36 карт</p>
            <p className="mt-1">♠ ♥ ♦ ♣</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "waiting") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background">
        <div className="animate-slide-up text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(45,90%,55%)] flex items-center justify-center mx-auto mb-6 border-4 border-[hsl(330,30%,25%)] shadow-[5px_5px_0_hsl(330,30%,25%)]">
            <Sparkles className="w-10 h-10 text-[hsl(330,30%,25%)]" />
          </div>

          <h2 className="text-2xl font-black text-[hsl(330,30%,25%)] text-shadow-sticker mb-2">
            Ожидание соперника
          </h2>
          <p className="text-muted-foreground mb-6">
            Отправь ссылку другу, чтобы начать игру
          </p>

          <div className="sticker-card p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-bold">Ссылка-приглашение</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 bg-[hsl(45,40%,95%)] rounded-lg px-3 py-2 text-sm border-2 border-[hsl(330,30%,25%)] font-mono"
              />
              <button
                onClick={copyLink}
                className="sticker-btn-mint px-3 py-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={shareGame}
            className="sticker-btn-pink w-full mb-4 flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Поделиться в Telegram
          </button>

          <button
            onClick={startBotGame}
            className="sticker-btn-yellow w-full flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            Играть с ботом
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(330,85%,60%)] animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(45,90%,55%)] animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(160,70%,55%)] animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "playing" && gameState) {
    return (
      <GameBoard
        gameState={gameState}
        onGameStateChange={setGameState}
        onLeaveGame={() => setPhase("menu")}
        playerName={playerName}
        isHost={gameMode === "pvp"}
      />
    );
  }



  return null;
            }
