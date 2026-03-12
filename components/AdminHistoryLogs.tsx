export function AdminHistoryLogs() {
  const logs = [
    { id: 1, title: 'High Roller Win', meta: 'User #X921 • Blackjack Table 04', amount: '+$12,450', time: '2 min ago', type: 'win' },
    { id: 2, title: 'System Override', meta: 'Vault Terminal 01 • Authorized', text: 'SECURED', time: '14 min ago', type: 'system' },
    { id: 3, title: 'Jackpot Payout', meta: 'Slot #777 • Level 2 Floor', amount: '+$5,000', time: '45 min ago', type: 'win' },
  ];

  return (
    <section className="glass-panel rounded-[1.5rem] p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-2xl text-[#D4AF37] italic">History Logs</h3>
        <button className="text-[10px] font-bold text-[#D4AF37]/60 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 hover:bg-[#D4AF37]/10 transition-all uppercase tracking-widest">Generate Report</button>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="group flex items-center justify-between p-4 rounded-xl bg-[#0A2A1F]/20 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/5 flex items-center justify-center border border-[#D4AF37]/10 group-hover:bg-[#D4AF37]/10 transition-colors">
                <span className="material-symbols-outlined text-[#D4AF37]">
                  {log.type === 'win' ? 'payments' : log.type === 'system' ? 'shield_lock' : 'casino'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{log.title}</h4>
                <p className="text-[10px] text-[#10B981]/40 font-bold uppercase tracking-tighter">{log.meta}</p>
              </div>
            </div>
            <div className="text-right">
              {log.amount ? (
                <p className="text-emerald-vibrant font-bold text-lg">{log.amount}</p>
              ) : (
                <p className="text-[#D4AF37] font-bold text-lg">{log.text}</p>
              )}
              <p className="text-[9px] text-[#10B981]/30 font-bold uppercase tracking-widest">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
