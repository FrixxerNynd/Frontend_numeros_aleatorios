export function RecentActivitySummary() {
  return (
    <div className="bg-emerald-card rounded-2xl p-6 glow-card border border-white/5">
      <h3 className="font-serif text-2xl text-gold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Blackjack Win</span>
          <span className="text-win-green font-bold">+$450.00</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Slots Spin</span>
          <span className="text-lose-red font-bold">-$20.00</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Roulette Win</span>
          <span className="text-win-green font-bold">+$1,200.00</span>
        </div>
      </div>
      <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors text-white">
        View All History
      </button>
    </div>
  );
}
