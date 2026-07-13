import { Card as CardType, SUIT_SYMBOLS, SUIT_COLORS, RANK_LABELS } from "@/lib/durak";

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  small?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Card({
  card,
  faceDown = false,
  small = false,
  onClick,
  selected = false,
  disabled = false,
  className = "",
}: CardProps) {
  if (faceDown) {
    return (
      <div
        className={`card-back flex items-center justify-center select-none ${
          small ? "w-10 h-14 text-xs" : "w-14 h-20 sm:w-16 sm:h-22"
        } ${className}`}
      >
        <span className="text-lg opacity-40">🂠</span>
      </div>
    );
  }

  if (!card) return null;

  const isRed = SUIT_COLORS[card.suit] === "red";
  const suitClass = isRed ? "suit-red" : "suit-black";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`playing-card flex flex-col items-center justify-between select-none ${
        small ? "w-10 h-14 px-0.5 py-0.5" : "w-14 h-20 sm:w-16 sm:h-22 px-1 py-1"
      } ${selected ? "ring-2 ring-[hsl(330,85%,60%)] ring-offset-2" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={{
        transform: selected ? "translateY(-8px)" : undefined,
      }}
    >
      <div className={`flex flex-col items-center leading-none ${small ? "text-[10px]" : "text-sm font-bold"}`}>
        <span className={suitClass}>{RANK_LABELS[card.rank]}</span>
        <span className={`${suitClass} ${small ? "text-xs" : "text-base"}`}>{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <div className={`${small ? "text-[8px]" : "text-xs"} ${suitClass} opacity-60`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
    </button>
  );
}
