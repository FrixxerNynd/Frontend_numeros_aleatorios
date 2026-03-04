"use client";

import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { HistoryLogCard } from '@/components/history/HistoryLogCard';
import { BottomNav } from '@/components/history/BottomNav';

// Mock Data
const EARNINGS_DATA = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 900 },
  { day: 'Wed', amount: 1500 },
  { day: 'Thu', amount: 800 },
  { day: 'Fri', amount: 2100 },
  { day: 'Sat', amount: 2400 },
  { day: 'Sun', amount: 1800 },
];

const MOCK_LOGS = Array.from({ length: 8 }).map((_, i) => ({
  id: `usr-log-${i}`,
  userId: `Me`,
  category: i === 0 ? 'deposit' : i % 3 === 0 ? 'conversion' : 'game',
  description: i === 0 ? 'Deposit via Crypto' : i % 3 === 0 ? 'Convert to Chips' : 'Played Aztec Slots',
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  ip: `192.168.1.100`,
  amount: i % 2 === 0 ? 250 : -50,
  currency: i % 3 === 0 ? 'chips' : 'money',
}));

export default function UserHistoryPage() {
  const [showAll, setShowAll] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const visibleLogs = showAll 
    ? MOCK_LOGS.filter(log => filterCategory === 'All' || log.category === filterCategory.toLowerCase())
    : MOCK_LOGS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#06261d] text-white font-sans pb-24 md:pb-8">
      {/* Header Area showing Balances */}
      <header className="bg-[#0a2f25] border-b border-[#d4af37]/30 pt-8 pb-6 px-4 md:px-8 shadow-2xl rounded-b-3xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00ff88]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-gray-400 font-sans text-sm tracking-widest uppercase">Money Balance</span>
              <span className="text-[#00ff88] font-serif text-3xl md:text-4xl font-bold">$12,450.00</span>
            </div>
            <div className="w-px h-12 bg-[#d4af37]/20 self-center"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-sans text-sm tracking-widest uppercase">Chips Balance</span>
              <span className="text-[#d4af37] font-serif text-3xl md:text-4xl font-bold">45,800</span>
            </div>
          </div>

          <button className="w-full md:w-auto bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#06261d] px-8 py-4 rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 hover:shadow-[0_4px_25px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-3">
            <ArrowLeftRight className="w-5 h-5" />
            Convert Money to Chips
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Area Chart: Earnings Overview */}
        <section className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-serif text-white mb-6">Earnings Overview (7 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" opacity={0.1} vertical={false} />
                <XAxis dataKey="day" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#06261d', borderColor: '#00ff88', borderRadius: '8px' }}
                  itemStyle={{ color: '#00ff88', fontWeight: 'bold' }}
                  labelStyle={{ color: '#aaa' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#00ff88" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Activity List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-white">{showAll ? 'Full History' : 'Recent Activity'}</h2>
            
            {!showAll && (
              <button 
                onClick={() => setShowAll(true)}
                className="text-[#d4af37] text-sm font-sans hover:underline flex items-center gap-1"
              >
                View All History
              </button>
            )}
          </div>

          {showAll && (
            <div className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-6 shadow-md">
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Category</label>
                <div className="relative">
                  <Filter className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    className="w-full bg-[#06261d] border border-[#d4af37]/30 text-white pl-9 pr-4 py-2 rounded-lg font-sans focus:outline-none focus:border-[#d4af37] appearance-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Game">Juego (Game)</option>
                    <option value="Deposit">Deposito (Deposit)</option>
                    <option value="Conversion">Convercion (Conversion)</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 w-full">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="date"
                    className="w-full bg-[#06261d] border border-[#d4af37]/30 text-white pl-9 pr-4 py-2 rounded-lg font-sans focus:outline-none focus:border-[#d4af37] color-scheme-dark"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {visibleLogs.map((log: any) => (
              <HistoryLogCard key={log.id} {...log} />
            ))}
            
            {visibleLogs.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No activity found for these filters.
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
