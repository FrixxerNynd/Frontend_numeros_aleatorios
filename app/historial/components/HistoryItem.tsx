import { HistorialRecord } from '@/lib/hooks/useHistory';
import { ArrowDownRight, ArrowUpRight, Gamepad2, Landmark, RefreshCcw } from 'lucide-react';

interface HistoryItemProps {
  record: HistorialRecord;
  index: number;
}

const CATEGORY_CONFIG = {
  Juego: {
    icon: Gamepad2,
    color: 'text-violet-400',
    bg: 'bg-violet-950/40',
    border: 'border-violet-900/50',
    tag: 'text-violet-500',
  },
  Deposito: {
    icon: Landmark,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-900/50',
    tag: 'text-emerald-500',
  },
  Convercion: {
    icon: RefreshCcw,
    color: 'text-sky-400',
    bg: 'bg-sky-950/40',
    border: 'border-sky-900/50',
    tag: 'text-sky-500',
  },
} as const;

const DEFAULT_CONFIG = {
  icon: Gamepad2,
  color: 'text-zinc-400',
  bg: 'bg-zinc-900/40',
  border: 'border-zinc-800',
  tag: 'text-zinc-500',
};

export function HistoryItem({ record, index }: HistoryItemProps) {
  const cfg = CATEGORY_CONFIG[record.categoria as keyof typeof CATEGORY_CONFIG] ?? DEFAULT_CONFIG;
  const Icon = cfg.icon;

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(record.fecha));

  const displayCategory = record.categoria === 'Convercion' ? 'Conversión' : record.categoria;

  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center px-4 py-3.5 border-b border-zinc-900 hover:bg-white/[0.02] transition-colors group"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Left: info */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Category icon */}
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border ${cfg.bg} ${cfg.border}`}>
          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.tag}`}>
              {displayCategory}
            </span>
            <span className="text-[10px] text-zinc-700 font-mono">
              {record.idUsuario.slice(0, 10)}
            </span>
          </div>
          <p className="text-sm text-zinc-300 mt-0.5 truncate">{record.descripcion}</p>
          <span className="text-[10px] text-zinc-700 mt-0.5 block">{formattedDate}</span>
        </div>
      </div>

      {/* Right: amounts */}
      <div className="flex flex-col items-end gap-1 pl-4 flex-shrink-0">
        {record.dinero !== null && record.dinero !== undefined && (
          <span className={`flex items-center gap-1 text-sm font-bold tabular-nums ${
            record.dinero > 0 ? 'text-emerald-400' : record.dinero < 0 ? 'text-rose-400' : 'text-zinc-400'
          }`}>
            {record.dinero > 0
              ? <ArrowUpRight className="w-3.5 h-3.5" />
              : record.dinero < 0
              ? <ArrowDownRight className="w-3.5 h-3.5" />
              : null}
            ${Math.abs(record.dinero).toFixed(2)}
          </span>
        )}
        {record.fichas !== null && record.fichas !== undefined && (
          <span className={`text-xs font-semibold tabular-nums ${
            record.fichas > 0 ? 'text-amber-400' : record.fichas < 0 ? 'text-orange-500' : 'text-zinc-600'
          }`}>
            {record.fichas > 0 ? '+' : record.fichas < 0 ? '−' : ''}
            {Math.abs(record.fichas)}{' '}
            <span className="text-zinc-700 font-normal uppercase text-[10px] tracking-wider">fch</span>
          </span>
        )}
      </div>
    </div>
  );
}