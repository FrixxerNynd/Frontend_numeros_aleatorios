"use client";

import { useState, useMemo } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useHistory } from '@/lib/hooks/useHistory';
import { ActivityHistoryTable } from '@/components/ActivityHistoryTable';

const GAMES = [
  { 
    id: 'slots', 
    name: 'Mega Gold Slots', 
    icon: 'casino', 
    color: 'text-yellow-400',
    stats: {
      played: 124,
      winRate: '42%',
      bestWin: '$1,250.00',
      totalProfit: '$4,500.00'
    }
  },
  { 
    id: 'blackjack', 
    name: 'Blackjack VIP', 
    icon: 'playing_cards', 
    color: 'text-blue-400',
    stats: {
      played: 56,
      winRate: '48%',
      bestWin: '$500.00',
      totalProfit: '-$1,200.00'
    }
  },
  { 
    id: 'roulette', 
    name: 'Roulette Royale', 
    icon: 'casino', 
    color: 'text-red-500',
    stats: {
      played: 89,
      winRate: '35%',
      bestWin: '$3,600.00',
      totalProfit: '$8,200.00'
    }
  }
];

export default function GamesPage() {
  const { history } = useHistory();
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);

  const filteredHistory = useMemo(() => {
    if (!selectedGame) return [];
    return history.filter(record => record.descripcion === selectedGame.name);
  }, [history, selectedGame]);

  return (
    <div className="flex h-screen overflow-hidden bg-emerald-dark font-sans text-slate-100">
      <DashboardSidebar activePath="/user/games" />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader />

        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-4xl text-gold">Games Collection</h1>
            <p className="text-slate-400 text-sm">Select a game to view your performance and history.</p>
          </div>

          {!selectedGame ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {GAMES.map((game) => (
                <button 
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="bg-emerald-card p-8 rounded-3xl glow-card border border-white/5 flex flex-col items-center gap-6 group hover:border-primary-emerald/50 transition-all active:scale-95"
                >
                  <span className={`material-symbols-outlined text-6xl ${game.color} group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </span>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">{game.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active Tournament</p>
                  </div>
                  <div className="w-full bg-white/5 py-2 rounded-xl text-xs font-bold text-primary-emerald group-hover:bg-primary-emerald group-hover:text-emerald-dark transition-colors">
                    VIEW STATISTICS
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Back Button */}
              <button 
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to All Games
              </button>

              {/* Game Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-emerald-card/30 p-8 rounded-3xl border border-white/5">
                <span className={`material-symbols-outlined text-8xl ${selectedGame.color}`}>
                  {selectedGame.icon}
                </span>
                <div className="flex-1 space-y-2">
                  <h2 className="text-4xl font-bold">{selectedGame.name}</h2>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-gold/20 text-gold text-[10px] font-bold rounded-full border border-gold/30">PREMIUM GAME</span>
                    <span className="px-3 py-1 bg-primary-emerald/20 text-primary-emerald text-[10px] font-bold rounded-full border border-primary-emerald/30">LEVEL 42</span>
                  </div>
                </div>
                <button className="gold-button text-emerald-dark font-bold px-8 py-3 rounded-full active:scale-95 transition-transform">
                  PLAY NOW
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-card p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Played</p>
                  <p className="text-2xl font-bold">{selectedGame.stats.played}</p>
                </div>
                <div className="bg-emerald-card p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-win-green">{selectedGame.stats.winRate}</p>
                </div>
                <div className="bg-emerald-card p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Best Win</p>
                  <p className="text-2xl font-bold text-gold">{selectedGame.stats.bestWin}</p>
                </div>
                <div className="bg-emerald-card p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Profit</p>
                  <p className={`text-2xl font-bold ${selectedGame.stats.totalProfit.startsWith('-') ? 'text-lose-red' : 'text-win-green'}`}>
                    {selectedGame.stats.totalProfit}
                  </p>
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-gold">Game History</h3>
                {filteredHistory.length > 0 ? (
                  <ActivityHistoryTable data={filteredHistory} />
                ) : (
                  <div className="py-12 bg-emerald-card/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-slate-500 gap-2">
                    <span className="material-symbols-outlined text-4xl">history</span>
                    <p className="text-sm">No recent activity for this game.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Spacer */}
        <div className="h-20 md:hidden"></div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#051510] border-t border-white/5 px-8 py-3 flex justify-between items-center z-50">
        <a className="flex flex-col items-center gap-1 text-slate-400" href="/user/dashboard">
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[9px] font-bold uppercase">Dashboard</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary-emerald" href="/user/games">
          <span className="material-symbols-outlined text-xl">playing_cards</span>
          <span className="text-[9px] font-bold uppercase">Games</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="/historial">
          <span className="material-symbols-outlined text-xl">history</span>
          <span className="text-[9px] font-bold uppercase">History</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[9px] font-bold uppercase">Profile</span>
        </a>
      </div>
    </div>
  );
}
