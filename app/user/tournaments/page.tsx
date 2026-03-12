"use client";

import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

const TOURNAMENT_STATS = [
  { label: 'Trophies Won', value: '12', icon: 'emoji_events', color: 'text-gold' },
  { label: 'Top 3 Finishes', value: '28', icon: 'military_tech', color: 'text-slate-300' },
  { label: 'Total Prize Money', value: '$85,200', icon: 'payments', color: 'text-primary-emerald' },
  { label: 'Avg. Final Rank', value: '#14', icon: 'leaderboard', color: 'text-blue-400' },
];

const RECENT_TOURNAMENTS = [
  {
    id: 't1',
    name: 'Emerald Weekly Masters',
    date: 'Mar 24, 2024',
    rank: '#3',
    participants: '500',
    prize: '+$12,500.00',
    game: 'Blackjack VIP',
    status: 'Completed'
  },
  {
    id: 't2',
    name: 'High Roller Slots Cup',
    date: 'Mar 20, 2024',
    rank: '#1',
    participants: '200',
    prize: '+$25,000.00',
    game: 'Mega Gold Slots',
    status: 'Completed'
  },
  {
    id: 't3',
    name: 'Midnight Roulette Sensation',
    date: 'Mar 15, 2024',
    rank: '#15',
    participants: '1,000',
    prize: '+$500.00',
    game: 'Roulette Royale',
    status: 'Completed'
  },
  {
    id: 't4',
    name: 'Golden Ace Invitational',
    date: 'Mar 10, 2024',
    rank: '#42',
    participants: '150',
    prize: '$0.00',
    game: 'Poker Texas Hold\'em',
    status: 'Completed'
  }
];

export default function TournamentsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-emerald-dark font-sans text-slate-100">
      <DashboardSidebar activePath="/user/tournaments" />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader />

        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-4xl text-gold">Tournament Statistics</h1>
            <p className="text-slate-400 text-sm">Your competitive performance and global ranking.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TOURNAMENT_STATS.map((stat) => (
              <div key={stat.label} className="bg-emerald-card p-6 rounded-3xl glow-card border border-white/5 flex flex-col gap-4">
                <span className={`material-symbols-outlined text-4xl ${stat.color}`}>
                  {stat.icon}
                </span>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Participation History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-gold">Participation History</h2>
              <button className="flex items-center gap-2 text-primary-emerald text-sm font-medium hover:underline">
                <span className="material-symbols-outlined text-sm">filter_alt</span>
                All Seasons
              </button>
            </div>

            <div className="bg-emerald-card/40 rounded-3xl border border-white/5 overflow-hidden">
              <div className="hidden md:grid grid-cols-6 px-8 py-5 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-primary-emerald/70">
                <span>Tournament</span>
                <span>Date</span>
                <span>Final Rank</span>
                <span>Participants</span>
                <span>Game</span>
                <span className="text-right">Prize Won</span>
              </div>
              <div className="divide-y divide-white/5">
                {RECENT_TOURNAMENTS.map((t) => (
                  <div key={t.id} className="grid grid-cols-2 md:grid-cols-6 items-center px-8 py-5 hover:bg-white/5 transition-colors group">
                    <div className="col-span-1 md:col-span-1">
                      <div className="text-sm font-bold text-white group-hover:text-primary-emerald transition-colors">{t.name}</div>
                      <div className="md:hidden text-[10px] text-slate-500 mt-1">{t.date}</div>
                    </div>
                    <div className="hidden md:block text-xs text-slate-400 font-medium">{t.date}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.rank === '#1' ? 'bg-gold text-emerald-dark' : 
                        t.rank === '#3' ? 'bg-slate-300 text-emerald-dark' : 
                        'bg-white/10 text-white'
                      }`}>
                        {t.rank}
                      </span>
                    </div>
                    <div className="hidden md:block text-xs text-slate-400">{t.participants} players</div>
                    <div className="hidden md:block">
                      <span className="text-xs font-medium text-slate-300">{t.game}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${t.prize !== '$0.00' ? 'text-win-green' : 'text-slate-500'}`}>
                        {t.prize}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-8 py-4 border-t border-white/5 flex items-center justify-end text-xs text-slate-500 italic">
                Data updated every 24 hours
              </div>
            </div>
          </div>
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
        <a className="flex flex-col items-center gap-1 text-slate-400" href="/user/games">
          <span className="material-symbols-outlined text-xl">playing_cards</span>
          <span className="text-[9px] font-bold uppercase">Games</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary-emerald" href="/user/tournaments">
          <span className="material-symbols-outlined text-xl">emoji_events</span>
          <span className="text-[9px] font-bold uppercase">Tournaments</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="/historial">
          <span className="material-symbols-outlined text-xl">history</span>
          <span className="text-[9px] font-bold uppercase">History</span>
        </a>
      </div>
    </div>
  );
}
