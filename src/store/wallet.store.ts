import { create } from 'zustand';

interface WalletState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  userId: string;
  setBalance: (balance: number) => void;
  setUserId: (id: string) => void;
  fetchBalance: () => Promise<void>;
}

const GAMES_API_URL = process.env.NEXT_PUBLIC_GAMES_API_URL || 'http://localhost:3001';

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  isLoading: false,
  error: null,
  userId: 'user2', // Hardcoded for demo, normally from auth
  setBalance: (balance) => set({ balance }),
  setUserId: (id) => set({ userId: id }),
  fetchBalance: async () => {
    const { userId } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${GAMES_API_URL}/wallet/balance/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const chips = data.balance ?? data.wallet?.chips ?? 0;
      set({ balance: chips });
    } catch (error) {
      console.error('Failed to fetch balance', error);
      set({ error: 'No se pudo obtener el saldo' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
