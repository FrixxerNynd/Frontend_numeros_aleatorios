"use client";

import { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';

const ANALYTICS_LOGS = [
  { id: 'L1', user: 'User #X921', action: 'High Roller Win', game: 'Blackjack Table 04', amount: '+$12,450.00', time: '2024-03-12 23:14:02', status: 'Verified' },
  { id: 'L2', user: 'Vault Admin', action: 'System Override', game: 'Vault Terminal 01', amount: 'N/A', time: '2024-03-12 23:10:45', status: 'Authorized' },
  { id: 'L3', user: 'User #A102', action: 'Jackpot Payout', game: 'Slot #777 (Premium)', amount: '+$5,000.00', time: '2024-03-12 22:45:12', status: 'Completed' },
  { id: 'L4', user: 'User #Z554', action: 'Withdrawal Request', game: 'Financials', amount: '-$2,000.00', time: '2024-03-12 22:30:00', status: 'Pending' },
  { id: 'L5', user: 'System Bot', action: 'Daily Balance Audit', game: 'Global Ledger', amount: 'Verified', time: '2024-03-12 00:00:01', status: 'Success' },
  { id: 'L6', user: 'User #B882', action: 'Loss Recovery', game: 'Roulette Royale 02', amount: '-$4,200.00', time: '2024-03-11 23:55:10', status: 'Completed' },
  { id: 'L7', user: 'User #C119', action: 'New VIP Level', game: 'Mega Gold Slots', amount: 'PLATINUM', time: '2024-03-11 23:20:45', status: 'Promoted' },
];

export default function AdminAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = ANALYTICS_LOGS.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#04140F] text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.03) 0%, transparent 40%)'
      }}></div>

      <AdminSidebar activePath="/admin/analytics" />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h1 className="font-serif text-4xl text-[#D4AF37]">Detailed Analytics</h1>
              <p className="text-[#10B981]/60 text-sm">Full operational history and system-wide audit logs.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Filter logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#04140F]/60 border border-[#D4AF37]/20 rounded-xl py-2 px-10 text-sm text-white placeholder-[#10B981]/30 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none w-64"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/40 text-sm">search</span>
              </div>
              <button className="gold-button text-[#04140F] font-bold text-xs px-6 py-2 rounded-xl active:scale-95 transition-transform flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span>
                EXPORT CSV
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/10 bg-[#0A2A1F]/30">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">ID</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Entity / User</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Action</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Target / Game</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Value</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Time</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5 text-xs font-mono text-[#D4AF37]/60 group-hover:text-[#D4AF37]">{log.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] text-xs">
                            {log.user.slice(0, 1)}
                          </div>
                          <span className="text-sm font-semibold text-white">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-300 font-medium">{log.action}</span>
                      </td>
                      <td className="px-8 py-5 text-xs text-[#10B981]/50">{log.game}</td>
                      <td className="px-8 py-5">
                        <span className={`text-sm font-bold ${
                          log.amount.startsWith('+') ? 'text-[#00FF88]' : 
                          log.amount.startsWith('-') ? 'text-rose-500' : 'text-[#D4AF37]'
                        }`}>
                          {log.amount}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[10px] font-medium text-slate-500">{log.time}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          log.status === 'Completed' || log.status === 'Success' || log.status === 'Verified' ? 'bg-[#10B981]/10 text-[#00FF88] border border-[#10B981]/20' :
                          log.status === 'Pending' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' :
                          'bg-white/10 text-white border border-white/10'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
                <span className="material-symbols-outlined text-4xl">search_off</span>
                <p className="text-sm italic">No records found matching your selection.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
