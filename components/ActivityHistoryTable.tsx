import { HistorialRecord } from '@/lib/hooks/useHistory';

interface Props {
  data: HistorialRecord[];
}

export function ActivityHistoryTable({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-gold">Historial de Actividad</h2>
        <button className="flex items-center gap-2 text-primary-emerald text-sm font-medium hover:underline">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter Results
        </button>
      </div>
      <div className="bg-emerald-card/40 rounded-2xl border border-white/5 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-6 py-4 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-primary-emerald/70">
          <span>Fecha</span>
          <span>Juego</span>
          <span>Apuesta / Desc</span>
          <span>Resultado</span>
          <span className="text-right">Balance</span>
        </div>
        <div className="divide-y divide-white/5">
          {data.map((record) => (
            <div key={record.id} className="grid grid-cols-2 md:grid-cols-5 items-center px-6 py-4 hover:bg-white/5 transition-colors text-white">
              <div className="col-span-1">
                <div className="text-xs font-medium">{new Date(record.fecha).toLocaleDateString()}</div>
                <div className="text-[10px] text-slate-400">{new Date(record.fecha).toLocaleTimeString()}</div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-emerald text-lg">
                    {record.categoria === 'Juego' ? 'casino' : record.categoria === 'Deposito' ? 'payments' : 'currency_exchange'}
                  </span>
                  <div className="text-sm font-medium">{record.descripcion}</div>
                </div>
              </div>
              <div className="hidden md:block text-sm font-mono">
                {record.dinero ? `$${record.dinero.toFixed(2)}` : `${record.fichas} chips`}
              </div>
              <div className="flex justify-start md:justify-start">
                <span className={`${(record.dinero || 0) >= 0 ? 'text-win-green' : 'text-lose-red'} font-bold text-sm`}>
                  {(record.dinero || 0) >= 0 ? '+' : ''}{record.dinero?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="text-right text-sm font-bold">$12,450.00</div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Page 1 of 12</span>
          <div className="flex gap-2">
            <button className="p-1 hover:text-primary-emerald transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="p-1 text-primary-emerald border-b border-primary-emerald">1</button>
            <button className="p-1 hover:text-primary-emerald">2</button>
            <button className="p-1 hover:text-primary-emerald">3</button>
            <button className="p-1 hover:text-primary-emerald transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
