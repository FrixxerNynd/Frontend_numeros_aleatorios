'use client';

import { useWalletStore } from '@/store/wallet.store';
import { Wallet, Coins, History } from 'lucide-react';
import { useEffect } from 'react';

export default function Navbar() {
  const { balance, fetchBalance } = useWalletStore();

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // Polling for demo
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Coins className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">CASINO<span className="text-indigo-400">UNIFICADO</span></span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-full border border-white/10">
          <Wallet className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-medium">${balance.toLocaleString()}</span>
        </div>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <History className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
