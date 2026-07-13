import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  colorScheme: "light" | "dark";
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [startParam, setStartParam] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setIsReady(true);
      return;
    }

    tg.ready();
    tg.expand();
    tg.setHeaderColor("#FFF8E7");
    tg.setBackgroundColor("#FFF8E7");

    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
    if (tg.initDataUnsafe?.start_param) {
      setStartParam(tg.initDataUnsafe.start_param);
    }

    setIsReady(true);
  }, []);

  const haptic = {
    light: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light"),
    medium: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium"),
    success: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success"),
    error: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error"),
  };

  const mainButton = {
    show: (text: string, onClick: () => void) => {
      const btn = window.Telegram?.WebApp?.MainButton;
      if (!btn) return;
      btn.setText(text);
      btn.onClick(onClick);
      btn.show();
    },
    hide: () => window.Telegram?.WebApp?.MainButton?.hide(),
  };

  const backButton = {
    show: (onClick: () => void) => {
      const btn = window.Telegram?.WebApp?.BackButton;
      if (!btn) return;
      btn.onClick(onClick);
      btn.show();
    },
    hide: () => window.Telegram?.WebApp?.BackButton?.hide(),
  };

  return { user, startParam, isReady, haptic, mainButton, backButton };
}
