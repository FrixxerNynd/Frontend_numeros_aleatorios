export function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-6 border-b border-white/5 gap-4">
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">MONEY BALANCE</span>
          <span className="text-xl font-bold text-white">$12,450.00</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">CHIPS</span>
          <span className="text-xl font-bold text-primary-emerald">5,000</span>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <button className="gold-button text-emerald-dark font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-sm">currency_exchange</span>
          Convert Money to Chips
        </button>
        <div className="flex items-center gap-3 bg-white/5 p-1.5 pr-4 rounded-full border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-emerald-dark font-bold text-xs">JD</div>
          <span className="text-xs font-medium text-white">Juan Delgado</span>
        </div>
      </div>
    </header>
  );
}
