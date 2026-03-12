"use client";

import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminDistributionChart } from '@/components/AdminDistributionChart';
import { AdminHistoryLogs } from '@/components/AdminHistoryLogs';

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#04140F] text-slate-100 font-sans antialiased">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)'
      }}></div>

      <AdminSidebar activePath="/admin" />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
          <AdminDistributionChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Filter Intelligence Section */}
            <section className="glass-panel rounded-[1.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-2xl text-[#D4AF37] italic">Filter Intelligence</h3>
                <span className="material-symbols-outlined text-[#10B981]/30">tune</span>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#10B981]/60 uppercase tracking-widest mb-2">Registry Search</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-[#04140F]/60 border border-[#D4AF37]/10 rounded-xl py-4 px-5 text-white placeholder-[#10B981]/20 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none transition-all" 
                        placeholder="User ID, Username or Transaction..." 
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40">search</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#10B981]/60 uppercase tracking-widest mb-2">Source IP</label>
                    <input 
                      className="w-full bg-[#04140F]/60 border border-[#D4AF37]/10 rounded-xl py-4 px-5 text-white placeholder-[#10B981]/20 focus:ring-1 focus:ring-[#D4AF37]/30 outline-none" 
                      placeholder="0.0.0.0" 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#10B981]/60 uppercase tracking-widest mb-2">Category</label>
                    <select className="w-full bg-[#04140F]/60 border border-[#D4AF37]/10 rounded-xl py-4 px-5 text-white focus:ring-1 focus:ring-[#D4AF37]/30 outline-none appearance-none">
                      <option>All Modules</option>
                      <option>Casino Floors</option>
                      <option>Live Lobby</option>
                      <option>Vault Access</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <label className="block text-[10px] font-bold text-[#10B981]/60 uppercase tracking-widest mb-6">Value Intensity Range</label>
                  <div className="relative px-2">
                    <div className="h-[2px] bg-[#D4AF37]/10 w-full rounded-full"></div>
                    <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                    <div className="absolute -top-1.5 left-1/4 h-3.5 w-3.5 bg-[#D4AF37] rounded-full border-2 border-[#04140F]"></div>
                    <div className="absolute -top-1.5 right-1/4 h-3.5 w-3.5 bg-[#D4AF37] rounded-full border-2 border-[#04140F]"></div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold tracking-tighter uppercase text-[#10B981]/40">
                      <span>$0.00</span>
                      <span className="text-[#D4AF37]">$10k - $50k</span>
                      <span>$250k+</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <AdminHistoryLogs />
          </div>
        </div>
      </main>
    </div>
  );
}
