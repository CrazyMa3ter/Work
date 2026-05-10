import { create } from 'zustand';

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDir: string;
  pressure: number;
  visibility: number;
  feelsLike: number;
  updateTime: string;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  setWeather: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  data: null,
  loading: false,
  error: null,
  setWeather: (data) => set({ data, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));
