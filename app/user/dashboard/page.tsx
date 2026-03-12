"use client";

import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { RecentActivitySummary } from '@/components/RecentActivitySummary';
import { EarningsOverview } from '@/components/EarningsOverview';

export default function UserDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-emerald-dark font-sans text-slate-100">
      <DashboardSidebar activePath="/user/dashboard" />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader />

        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-4xl text-gold">User Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, Juan. Here's your overview.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivitySummary />
            <EarningsOverview />
          </div>

          <div className="bg-emerald-card/20 rounded-2xl p-8 border border-white/5 flex flex-col items-center text-center gap-4">
            <span className="material-symbols-outlined text-5xl text-primary-emerald">playing_cards</span>
            <h2 className="text-xl font-bold">Ready to Play?</h2>
            <p className="text-slate-400 max-w-md">Try our latest slots or join a high-stakes Blackjack table.</p>
            <button className="gold-button text-emerald-dark font-bold px-8 py-3 rounded-full transition-transform active:scale-95">
              Explore All Games
            </button>
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="h-20 md:hidden"></div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#051510] border-t border-white/5 px-8 py-3 flex justify-between items-center z-50">
        <a className="flex flex-col items-center gap-1 text-primary-emerald" href="/user/dashboard">
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[9px] font-bold uppercase">Dashboard</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
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
