export function AdminHeader() {
  return (
    <header className="h-20 border-b border-[#D4AF37]/10 flex items-center justify-between px-10 bg-[#04140F]/50 backdrop-blur-sm">
      <div className="flex gap-8">
        <div>
          <p className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-[0.2em] mb-0.5">Global Liquidity</p>
          <p className="text-xl font-bold text-white">$4,282,450.00</p>
        </div>
        <div className="h-10 w-[1px] bg-[#D4AF37]/10"></div>
        <div>
          <p className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-[0.2em] mb-0.5">Active Terminals</p>
          <p className="text-xl font-bold text-white">12,402</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-[#10B981]/60 hover:text-[#D4AF37] transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37] rounded-full"></span>
        </button>
        <div className="h-10 px-4 rounded-full border border-[#D4AF37]/20 flex items-center gap-2 bg-[#0A2A1F]/40">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
          <span className="text-[10px] font-bold text-[#00FF88] uppercase tracking-widest">System Live</span>
        </div>
      </div>
    </header>
  );
}
