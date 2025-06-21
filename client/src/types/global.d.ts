declare global {
  interface Window {
    soundController?: {
      play: (soundName: string) => void;
      stop: (soundName: string) => void;
      playEffect?: (soundName: string) => void;
    };
  }
}

export {};