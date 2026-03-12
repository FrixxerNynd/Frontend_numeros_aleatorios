"use client";

import { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';

const FINANCIAL_STATS = [
  { label: 'Total Deposits', value: '$12,450,000', icon: 'account_balance_wallet', color: 'text-[#00FF88]' },
  { label: 'Total Payouts', value: '$8,200,450', icon: 'payments', color: 'text-[#D4AF37]' },
  { label: 'Platform Fees', value: '$425,000', icon: 'percent', color: 'text-blue-400' },
  { label: 'Net Reserve', value: '$3,824,550', icon: 'savings', color: 'text-[#00FF88]' },
];

const FINANCIAL_LOGS = [
  { id: 'TX501', type: 'Deposit', method: 'Crypto (ETH)', user: 'User #X921', amount: '+$50,000.00', time: '2024-03-12 23:25:10', status: 'Success' },
  { id: 'TX502', type: 'Payout', method: 'Bank Wire', user: 'User #A102', amount: '-$12,500.00', time: '2024-03-12 23:15:45', status: 'Processing' },
  { id: 'TX503', type: 'Deposit', method: 'Credit Card', user: 'User #Z554', amount: '+$2,000.00', time: '2024-03-12 22:45:00', status: 'Success' },
  { id: 'TX504', type: 'Fee', method: 'Network Payout', user: 'System', amount: '-$150.00', time: '2024-03-12 22:30:12', status: 'Success' },
  { id: 'TX505', type: 'Deposit', method: 'Crypto (BTC)', user: 'User #B882', amount: '+$100,000.00', time: '2024-03-11 23:50:05', status: 'Success' },
  { id: 'TX506', type: 'Payout', method: 'Crypto (USDT)', user: 'User #C119', amount: '-$5,000.00', time: '2024-03-11 23:10:20', status: 'Completed' },
  { id: 'TX507', type: 'Adjustment', method: 'Admin Correction', user: 'Main Vault', amount: '+$1,200.00', time: '2024-03-11 22:45:10', status: 'Authorized' },
];

export default function AdminFinancialsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = FINANCIAL_LOGS.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#04140F] text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.03) 0%, transparent 40%)'
      }}></div>

      <AdminSidebar activePath="/admin/financials" />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-4xl text-[#D4AF37]">Financial Records</h1>
            <p className="text-[#10B981]/60 text-sm">Comprehensive audit of all monetary inflows and outflows.</p>
          </div>

          {/* Money Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FINANCIAL_STATS.map((stat) => (
              <div key={stat.label} className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={`material-symbols-outlined text-3xl ${stat.color}`}>{stat.icon}</span>
                  <span className="text-[9px] font-bold text-[#10B981]/40 uppercase tracking-widest">Global Reserve</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1 font-bold">{stat.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0A2A1F]/20 p-6 rounded-2xl border border-[#D4AF37]/5">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#04140F]/60 border border-[#D4AF37]/20 rounded-xl py-3 px-12 text-sm text-white focus:ring-1 focus:ring-[#D4AF37]/50 outline-none"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40">search</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">Filter by Date</button>
              <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors uppercase tracking-widest">Download Ledger</button>
            </div>
          </div>

          {/* Financial Table */}
          <div className="glass-panel rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/10 bg-[#0A2A1F]/30">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Reference</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Type</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">User / Entity</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Method</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5 text-xs font-mono text-[#D4AF37]/60">{log.id}</td>
                      <td className="px-8 py-5">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          log.type === 'Deposit' ? 'text-[#00FF88]' : 
                          log.type === 'Payout' ? 'text-[#D4AF37]' : 'text-blue-400'
                        }`}>{log.type}</span>
                        <div className="text-[9px] text-slate-500 mt-0.5">{log.time}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-semibold text-white">{log.user}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="material-symbols-outlined text-sm text-[#10B981]/50">shield</span>
                          {log.method}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-sm font-bold ${
                          log.amount.startsWith('+') ? 'text-[#00FF88]' : 'text-rose-500'
                        }`}>
                          {log.amount}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          log.status === 'Success' || log.status === 'Completed' || log.status === 'Authorized' ? 'bg-[#10B981]/10 text-[#00FF88] border border-[#10B981]/20' :
                          log.status === 'Processing' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' :
                          'bg-white/10 text-white'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
