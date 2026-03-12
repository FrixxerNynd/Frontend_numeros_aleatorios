export function EarningsOverview() {
  return (
    <div className="lg:col-span-2 bg-emerald-card rounded-2xl p-6 glow-card border border-white/5 relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 text-white">
        <h3 className="font-serif text-2xl text-gold">Earnings Overview</h3>
        <select className="bg-black/20 border-white/10 rounded-lg text-[10px] text-slate-400 py-1 px-3 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="flex-1 relative min-h-[150px]">
        <div className="absolute inset-0 line-graph-bg opacity-50"></div>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path
            d="M0 80 L15 75 L30 85 L45 65 L60 70 L75 55 L90 40 L100 45"
            fill="none"
            stroke="#00FF88"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          ></path>
          <circle cx="0" cy="80" fill="#00FF88" r="1.5"></circle>
          <circle cx="15" cy="75" fill="#00FF88" r="1.5"></circle>
          <circle cx="30" cy="85" fill="#00FF88" r="1.5"></circle>
          <circle cx="45" cy="65" fill="#00FF88" r="1.5"></circle>
          <circle cx="60" cy="70" fill="#00FF88" r="1.5"></circle>
          <circle cx="75" cy="55" fill="#00FF88" r="1.5"></circle>
          <circle cx="90" cy="40" fill="#00FF88" r="1.5"></circle>
          <circle cx="100" cy="45" fill="#00FF88" r="1.5"></circle>
        </svg>
      </div>
    </div>
  );
}
