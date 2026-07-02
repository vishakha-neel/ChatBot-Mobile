import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  username: string | null;
  isLoading: boolean;
  setAuth: (token: string, username: string) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  isLoading: true,

  setAuth: async (token, username) => {
    await SecureStore.setItemAsync('jwt_token', token);
    await SecureStore.setItemAsync('username', username);
    set({ token, username });
  },

  loadAuth: async () => {
    const token = await SecureStore.getItemAsync('jwt_token');
    const username = await SecureStore.getItemAsync('username');
    set({ token, username, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    await SecureStore.deleteItemAsync('username');
    set({ token: null, username: null });
  },
}));