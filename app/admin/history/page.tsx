"use client";

import React, { useState } from 'react';
import { Bell, UserCircle2, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { HistoryFilterBar } from '@/components/history/HistoryFilterBar';
import { HistoryLogCard } from '@/components/history/HistoryLogCard';
import { StatsOverview } from '@/components/history/StatsOverview';
import { BottomNav } from '@/components/history/BottomNav';

// Mock Data
const MOCK_STATS = [
  { label: 'Total Balance Flow', value: '$1.4M', trend: '+12.5%', trendUp: true },
  { label: 'Active Users (24h)', value: '8,234', trend: '+4.2%', trendUp: true },
  { label: 'Total Conversions', value: '45.2K', trend: '-1.1%', trendUp: false },
  { label: 'Pending Verifications', value: '142', trend: '+12', trendUp: false },
];

const MOCK_PIE_DATA = [
  { name: 'Slots', value: 400 },
  { name: 'Roulette', value: 300 },
  { name: 'Blackjack', value: 300 },
  { name: 'Poker', value: 200 },
];
const COLORS = ['#d4af37', '#00ff88', '#0a2f25', '#ff4d4d'];

const MOCK_LOGS = Array.from({ length: 15 }).map((_, i) => ({
  id: `log-${i}`,
  userId: `USR-${1000 + i}`,
  category: i % 3 === 0 ? 'conversion' : 'game',
  description: i % 3 === 0 ? 'Money to Chips Conversion' : 'Played Aztec Slots',
  date: new Date(Date.now() - i * 3600000).toLocaleString(),
  ip: `192.168.1.${i % 255}`,
  amount: i % 4 === 0 ? 500 : -100,
  currency: i % 3 === 0 ? 'money' : 'chips',
}));

export default function AdminHistoryPage() {
  const [logs, setLogs] = useState(MOCK_LOGS);

  const handleSearch = (term: string) => {
    if (!term) return setLogs(MOCK_LOGS);
    setLogs(MOCK_LOGS.filter(log => log.userId.includes(term) || log.id.includes(term)));
  };

  const handleFilterChange = (filters: any) => {
    // Basic mock filtering logic
    let filtered = [...MOCK_LOGS];
    if (filters.ip) {
      filtered = filtered.filter(log => log.ip.includes(filters.ip));
    }
    setLogs(filtered);
  };

  return (
    <div className="min-h-screen bg-[#06261d] text-white font-sans pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a2f25]/90 backdrop-blur-md border-b border-[#d4af37]/20 px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-serif text-[#d4af37] font-bold tracking-wide">Admin History</h1>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-[#d4af37]/10 rounded-full transition-colors relative">
            <Bell className="w-6 h-6 text-[#d4af37]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff4d4d] rounded-full border-2 border-[#0a2f25]"></span>
          </button>
          <button className="p-2 hover:bg-[#d4af37]/10 rounded-full transition-colors">
            <UserCircle2 className="w-6 h-6 text-[#d4af37]" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <section>
          <StatsOverview stats={MOCK_STATS} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-serif text-white mb-4">Filter Logs</h2>
              <HistoryFilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-white">History Logs</h2>
                <span className="text-sm text-gray-400 font-sans">{logs.length} results found</span>
              </div>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar pb-10">
                {logs.map((log: any) => (
                  <HistoryLogCard key={log.id} {...log} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <section className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-serif text-white mb-6">Global Distribution</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a2f25', borderColor: '#d4af37', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {MOCK_PIE_DATA.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-gray-300 font-sans">{entry.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-20 md:bottom-8 right-6 p-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform z-50">
        <Plus className="w-6 h-6 text-[#06261d]" />
      </button>

      <BottomNav />
    </div>
  );
}
