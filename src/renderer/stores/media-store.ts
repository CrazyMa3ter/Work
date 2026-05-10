import { create } from 'zustand';

export interface MediaInfo {
  title: string;
  artist: string;
  album: string;
  cover: string | null;
  isPlaying: boolean;
  duration: number;
  position: number;
}

interface MediaState {
  info: MediaInfo | null;
  isPlaying: boolean;
  volume: number;
  setMediaInfo: (info: MediaInfo) => void;
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  info: null,
  isPlaying: false,
  volume: 50,
  setMediaInfo: (info) => set({ info }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));
