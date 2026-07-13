export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    suit: Suit;
    rank: Rank;
    id: string;
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const RANK_VALUES: Record<Rank, number> = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
};

export const SUIT_COLORS: Record<Suit, 'red' | 'black'> = {
    hearts: 'red',
    diamonds: 'red',
    clubs: 'black',
    spades: 'black'
};

export const RANK_LABELS: Record<Rank, string> = {
    '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    'J': 'В', 'Q': 'Д', 'K': 'К', 'A': 'Т'
};

export function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank, id: `${suit}-${rank}` });
        }
    }
    return shuffle(deck);
}

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function dealCards(deck: Card[], count: number): { dealt: Card[]; remaining: Card[] } {
    return {
        dealt: deck.slice(0, count),
        remaining: deck.slice(count)
    };
}

export function canBeat(card: Card, target: Card, trumpSuit: Suit): boolean {
    if (card.suit === target.suit) {
        return RANK_VALUES[card.rank] > RANK_VALUES[target.rank];
    }
    if (card.suit === trumpSuit && target.suit !== trumpSuit) {
        return true;
    }
    return false;
}

export function canAttack(tableCards: Card[], card: Card, isFirstAttack: boolean): boolean {
    if (isFirstAttack) return true;
    const allRanks = tableCards.map(c => c.rank);
    return allRanks.includes(card.rank);
}

export function canDefend(attackCard: Card, defendCard: Card, trumpSuit: Suit): boolean {
    return canBeat(defendCard, attackCard, trumpSuit);
}

export type GamePhase = 'menu' | 'waiting' | 'playing' | 'gameover' | 'paused';
export type PlayerRole = 'attacker' | 'defender' | 'idle';

export interface Player {
    id: string;
    name: string;
    hand: Card[];
    cardCount: number;
    role: PlayerRole;
    isBot?: boolean;
}

export interface GameState {
    phase: GamePhase;
    deck: Card[];
    trumpSuit: Suit;
    trumpCard: Card;
    table: { attack: Card | null; defense: Card | null }[];
    players: Player[];
    currentPlayerIndex: number;
    attackerIndex: number;
    defenderIndex: number;
    winner: string | null;
    loser: string | null;
    turnCount: number;
    maxCardsInAttack: number;
}

export function initializeGame(playerName: string, opponentName: string, isBot: boolean = false): GameState {
    const deck = createDeck();
    const trumpCard = deck[deck.length - 1];
    const trumpSuit = trumpCard.suit;

    const p1Cards = dealCards(deck, 6);
    const p2Cards = dealCards(p1Cards.remaining, 6);
    const remainingDeck = p2Cards.remaining;

    // Determine first attacker: lowest trump card
    const p1Trumps = p1Cards.dealt.filter(c => c.suit === trumpSuit);
    const p2Trumps = p2Cards.dealt.filter(c => c.suit === trumpSuit);

    let attackerIdx = 0;
    if (p1Trumps.length > 0 && p2Trumps.length > 0) {
        const p1Lowest = Math.min(...p1Trumps.map(c => RANK_VALUES[c.rank]));
        const p2Lowest = Math.min(...p2Trumps.map(c => RANK_VALUES[c.rank]));
        attackerIdx = p1Lowest <= p2Lowest ? 0 : 1;
    } else if (p2Trumps.length > 0) {
        attackerIdx = 1;
    }

    const players: Player[] = [
        {
            id: 'player1',
            name: playerName,
            hand: sortHand(p1Cards.dealt, trumpSuit),
            cardCount: 6,
            role: attackerIdx === 0 ? 'attacker' : 'defender'
        },
        {
            id: 'player2',
            name: opponentName,
            hand: sortHand(p2Cards.dealt, trumpSuit),
            cardCount: 6,
            role: attackerIdx === 1 ? 'attacker' : 'defender',
            isBot
        }
    ];

    return {
        phase: 'playing',
        deck: remainingDeck,
        trumpSuit,
        trumpCard,
        table: [],
        players,
        currentPlayerIndex: attackerIdx,
        attackerIndex: attackerIdx,
        defenderIndex: 1 - attackerIdx,
        winner: null,
        loser: null,
        turnCount: 0,
        maxCardsInAttack: Math.min(players[1 - attackerIdx].hand.length, 6)
    };
}

export function sortHand(hand: Card[], trumpSuit: Suit): Card[] {
    return [...hand].sort((a, b) => {
        const aIsTrump = a.suit === trumpSuit ? 1 : 0;
        const bIsTrump = b.suit === trumpSuit ? 1 : 0;
        if (aIsTrump !== bIsTrump) return bIsTrump - aIsTrump;
        return RANK_VALUES[a.rank] - RANK_VALUES[b.rank];
    });
}

export function getBotAttack(state: GameState): Card | null {
    const bot = state.players[1];
    if (bot.role !== 'attacker') return null;

    const isFirstAttack = state.table.length === 0;
    const validCards = bot.hand.filter(c => canAttack(state.table.flatMap(t => [t.attack, t.defense].filter(Boolean)) as Card[], c, isFirstAttack));

    if (validCards.length === 0) return null;

    // Bot strategy: prefer non-trump low cards first
    const nonTrump = validCards.filter(c => c.suit !== state.trumpSuit);
    if (nonTrump.length > 0) {
        return nonTrump.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
    }
    return validCards.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
}

export function getBotDefense(state: GameState): Card | null {
    const bot = state.players[1];
    if (bot.role !== 'defender') return null;

    const lastAttack = state.table[state.table.length - 1];
    if (!lastAttack || lastAttack.defense) return null;

    const validCards = bot.hand.filter(c => canDefend(lastAttack.attack!, c, state.trumpSuit));
    if (validCards.length === 0) return null;

    // Prefer lowest valid card
    return validCards.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
}

export function playCard(state: GameState, playerIndex: number, cardId: string): GameState | null {
    const player = state.players[playerIndex];
    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return null;

    const card = player.hand[cardIndex];
    const newState = { ...state, players: state.players.map(p => ({ ...p, hand: [...p.hand] })) };
    const newPlayer = newState.players[playerIndex];

    if (player.role === 'attacker') {
        const isFirstAttack = state.table.length === 0;
        const tableCards = state.table.flatMap(t => [t.attack, t.defense].filter(Boolean)) as Card[];
        if (!canAttack(tableCards, card, isFirstAttack)) return null;
        if (state.table.length >= state.maxCardsInAttack && !isFirstAttack) return null;

        newPlayer.hand.splice(cardIndex, 1);
        newState.table = [...state.table, { attack: card, defense: null }];
        newState.currentPlayerIndex = state.defenderIndex;
    } else if (player.role === 'defender') {
        const lastPair = state.table[state.table.length - 1];
        if (!lastPair || lastPair.defense) return null;
        if (!canDefend(lastPair.attack!, card, state.trumpSuit)) return null;

        newPlayer.hand.splice(cardIndex, 1);
        newState.table = state.table.map((t, i) =>
            i === state.table.length - 1 ? { ...t, defense: card } : t
        );
        newState.currentPlayerIndex = state.attackerIndex;
    }

    newState.players[playerIndex] = { ...newPlayer, cardCount: newPlayer.hand.length };
    return newState;
}

export function takeCards(state: GameState): GameState {
    const defender = state.players[state.defenderIndex];
    const allCards = state.table.flatMap(t => [t.attack, t.defense].filter(Boolean)) as Card[];

    const newDefender = {
        ...defender,
        hand: sortHand([...defender.hand, ...allCards], state.trumpSuit),
        cardCount: defender.hand.length + allCards.length,
        role: 'attacker' as PlayerRole
    };

    const newAttacker = {
        ...state.players[state.attackerIndex],
        role: 'defender' as PlayerRole
    };

    const newPlayers = [...state.players];
    newPlayers[state.defenderIndex] = newDefender;
    newPlayers[state.attackerIndex] = newAttacker;

    return refillHands({
        ...state,
        players: newPlayers,
        table: [],
        attackerIndex: state.defenderIndex,
        defenderIndex: state.attackerIndex,
        currentPlayerIndex: state.defenderIndex,
        turnCount: state.turnCount + 1,
        maxCardsInAttack: Math.min(newDefender.hand.length, 6)
    });
}

export function endAttack(state: GameState): GameState {
    const newPlayers = state.players.map(p => ({ ...p }));
    newPlayers[state.attackerIndex] = { ...newPlayers[state.attackerIndex], role: 'defender' as PlayerRole };
    newPlayers[state.defenderIndex] = { ...newPlayers[state.defenderIndex], role: 'attacker' as PlayerRole };

    return refillHands({
        ...state,
        players: newPlayers,
        table: [],
        attackerIndex: state.defenderIndex,
        defenderIndex: state.attackerIndex,
        currentPlayerIndex: state.defenderIndex,
        turnCount: state.turnCount + 1,
        maxCardsInAttack: Math.min(newPlayers[state.defenderIndex].hand.length, 6)
    });
}

function refillHands(state: GameState): GameState {
    let deck = [...state.deck];
    const newPlayers = state.players.map(p => ({ ...p, hand: [...p.hand] }));

    // Attacker draws first
    const drawOrder = [state.attackerIndex, state.defenderIndex];
    for (const idx of drawOrder) {
        while (newPlayers[idx].hand.length < 6 && deck.length > 0) {
            newPlayers[idx].hand.push(deck.pop()!);
        }
        newPlayers[idx].hand = sortHand(newPlayers[idx].hand, state.trumpSuit);
        newPlayers[idx].cardCount = newPlayers[idx].hand.length;
    }

    const winner = checkWinner(newPlayers, deck);

    return {
        ...state,
        deck,
        players: newPlayers,
        winner: winner?.winner ?? null,
        loser: winner?.loser ?? null,
        phase: winner ? 'gameover' : state.phase,
        maxCardsInAttack: Math.min(newPlayers[state.defenderIndex].hand.length, 6)
    };
}

function checkWinner(players: Player[], deck: Card[]): { winner: string; loser: string } | null {
    const emptyHand = players.filter(p => p.hand.length === 0);
    if (emptyHand.length === 0) return null;

    if (deck.length === 0) {
        if (emptyHand.length === 2) {
            return { winner: 'draw', loser: 'draw' };
        }
        const winner = emptyHand[0];
        const loser = players.find(p => p.id !== winner.id)!;
        return { winner: winner.name, loser: loser.name };
    }

    // If one player has empty hand but deck not empty, they draw from deck
    return null;
}

export function generateInviteLink(): string {
    const gameId = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${window.location.origin}?game=${gameId}`;
}
