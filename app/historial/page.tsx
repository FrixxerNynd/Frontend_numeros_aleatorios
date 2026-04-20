'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  History,
  Search,
  TrendingUp,
  PieChart,
  RefreshCw,
  Download,
  X,
  Gamepad2,
  Wallet,
  Zap,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import ActivityList from '@/components/wallet/ActivityList';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  getResumen,
  getHistory,
  type PerformanceDayData,
  type DistributionItem,
  type Transaction,
} from '@/services/walletApi';

// ─── Tipos ───────────────────────────────────────────────────

interface Activity {
  title: string;
  type: string;
  date: string;
  chips: number;
  status: 'Success' | 'Pending';
  _txId: string;
}

// ─── Helpers ─────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  BET: 'Apuesta',
  WIN: 'Premio',
  DEPOSIT: 'Depósito',
  CONVERT_TO_CHIPS: 'Conversión',
  WITHDRAW: 'Retiro',
};

function txToActivity(tx: Transaction): Activity {
  const dateStr = new Date(tx.date).toLocaleString('es-MX');
  switch (tx.action) {
    case 'WIN': {
      const title = tx.description.replace(/:\s*\{[\s\S]*\}$/, '').trim();
      return { title, type: 'GAMING', date: dateStr, chips: tx.amount, status: 'Success', _txId: tx.id };
    }
    case 'BET':
      return { title: tx.description, type: 'ENTRY FEE', date: dateStr, chips: -tx.amount, status: 'Success', _txId: tx.id };
    case 'DEPOSIT':
    case 'CONVERT_TO_CHIPS':
      return { title: tx.description, type: 'WALLET', date: dateStr, chips: tx.amount, status: 'Success', _txId: tx.id };
    case 'WITHDRAW':
      return { title: tx.description, type: 'WALLET', date: dateStr, chips: -tx.amount, status: 'Success', _txId: tx.id };
    default:
      return { title: tx.description, type: 'WALLET', date: dateStr, chips: tx.amount, status: 'Success', _txId: tx.id };
  }
}

function downloadCSV(transactions: Transaction[]) {
  const headers = ['ID', 'Fecha', 'Tipo', 'Descripción', 'Moneda', 'Monto'];
  const escape = (s: string) => `"${s.replace(/"/g, '""').replace(/:\s*\{[\s\S]*\}$/, '').trim()}"`;
  const rows = transactions.map((tx) => [
    escape(tx.id),
    escape(new Date(tx.date).toLocaleString('es-MX')),
    escape(ACTION_LABELS[tx.action] ?? tx.action),
    escape(tx.description),
    escape(tx.currencyType),
    String(tx.amount),
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historial-regnum-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Constantes ───────────────────────────────────────────────

const DAY_OPTIONS = [
  { label: '7 días', value: 7 },
  { label: '30 días', value: 30 },
  { label: '90 días', value: 90 },
  { label: 'Todo', value: 3650 },
];

const PAGE_SIZE = 20;

// ─── Empty State ─────────────────────────────────────────────

function EmptyHistorialState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <div className="grid h-20 w-20 place-items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <Gamepad2 className="h-10 w-10" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-300/20 text-[10px] font-bold text-yellow-300">
          0
        </span>
      </div>
      <h3 className="mb-2 text-xl font-black text-white">Aún no hay actividad</h3>
      <p className="mb-8 max-w-xs text-sm text-white/50">
        Tu historial aparecerá aquí en cuanto realices tu primera recarga o juegues una partida.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/wallet"
          className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition-all hover:bg-emerald-400/25"
        >
          <Wallet className="h-4 w-4" />
          Recargar fichas
        </a>
        <a
          href="/games"
          className="flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-5 py-2.5 text-sm font-semibold text-yellow-200 transition-all hover:bg-yellow-300/20"
        >
          <Zap className="h-4 w-4" />
          Ir a juegos
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/8 bg-white/5 text-white/30">
        <Zap className="h-5 w-5" />
      </div>
      <p className="text-sm text-white/35">{message}</p>
    </div>
  );
}

// ─── Modal de Detalle ─────────────────────────────────────────

function TransactionModal({
  tx,
  onClose,
}: {
  tx: Transaction;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const copyId = () => {
    navigator.clipboard.writeText(tx.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isPositive = ['WIN', 'DEPOSIT', 'CONVERT_TO_CHIPS'].includes(tx.action);
  const chipsDisplay = isPositive ? `+${tx.amount.toLocaleString()}` : `-${tx.amount.toLocaleString()}`;
  const cleanDescription = tx.description.replace(/:\s*\{[\s\S]*\}$/, '').trim();

  const fields = [
    { label: 'Tipo de movimiento', value: ACTION_LABELS[tx.action] ?? tx.action },
    { label: 'Descripción', value: cleanDescription },
    { label: 'Fecha completa', value: new Date(tx.date).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'medium' }) },
    { label: 'Moneda', value: tx.currencyType === 'chips' ? 'Fichas' : 'Dinero real' },
    { label: 'Estado', value: 'Completado' },
  ];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
    >
      <div className="w-full max-w-md rounded-t-[32px] border border-white/10 bg-[#0c0c0f] p-6 shadow-2xl sm:rounded-[32px] sm:mx-4">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Detalle del movimiento</div>
            <div className={`mt-1 text-2xl font-black ${isPositive ? 'text-emerald-300' : 'text-yellow-200'}`}>
              {chipsDisplay} <span className="text-base font-semibold text-white/50">fichas</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ID */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-widest">ID de transacción</div>
            <div className="mt-0.5 font-mono text-xs text-white/60 break-all">{tx.id || 'N/A'}</div>
          </div>
          {tx.id && (
            <button
              onClick={copyId}
              className="ml-3 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Fields */}
        <ul className="space-y-2">
          {fields.map((f) => (
            <li key={f.label} className="flex justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
              <span className="text-xs text-white/40">{f.label}</span>
              <span className="text-right text-xs font-semibold text-white/80">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────

export default function HistorialPage() {
  const [selectedDays, setSelectedDays] = useState(7);
  const [actionFilter, setActionFilter] = useState('');

  // Datos de gráficas
  const [performanceData, setPerformanceData] = useState<PerformanceDayData[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionItem[]>([]);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState<string | null>(null);

  // Transacciones + paginación
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  // Modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // ── Fetch gráficas ────────────────────────────────────────
  const fetchResumen = useCallback(async () => {
    setLoadingResumen(true);
    setErrorResumen(null);
    try {
      const data = await getResumen(selectedDays);
      setPerformanceData(data.performanceData);
      setDistributionData(data.distributionData);
    } catch (err: any) {
      setErrorResumen(err.message ?? 'Error al cargar el resumen');
    } finally {
      setLoadingResumen(false);
    }
  }, [selectedDays]);

  // ── Fetch primera página de movimientos ──────────────────
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    setErrorHistory(null);
    setCurrentPage(1);
    try {
      const data = await getHistory(undefined, { 
        page: 1, 
        limit: PAGE_SIZE,
        ...(actionFilter ? { action: actionFilter } : {})
      });
      setRawTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotalCount(data.total);
    } catch (err: any) {
      setErrorHistory(err.message ?? 'Error al cargar el historial');
    } finally {
      setLoadingHistory(false);
    }
  }, [actionFilter]);

  // ── Cargar más ────────────────────────────────────────────
  const loadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getHistory(undefined, { 
        page: nextPage, 
        limit: PAGE_SIZE,
        ...(actionFilter ? { action: actionFilter } : {})
      });
      setRawTransactions((prev) => [...prev, ...data.transactions]);
      setCurrentPage(nextPage);
    } catch {
      // silencioso — el usuario puede reintentar
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchResumen(); }, [fetchResumen]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // ── Actividades derivadas ─────────────────────────────────
  const allActivities = rawTransactions.map(txToActivity);

  // ── Modal handler ─────────────────────────────────────────
  const handleActivityClick = (index: number) => {
    const txId = allActivities[index]?._txId;
    const tx = rawTransactions.find((t) => t.id === txId);
    if (tx) setSelectedTx(tx);
  };

  // ── Chart tooltip ─────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-3 shadow-xl backdrop-blur-sm z-50 relative">
        <p className="mb-1 text-sm font-bold text-white">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload?.color }} />
              <span className="text-white/70">{entry.name}:</span>
              <span className="font-bold text-white">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  const isAllZeroBalance = performanceData.length > 0 && performanceData.every((d) => d.balance === 0);
  const isEmpty = !loadingHistory && !loadingResumen && totalCount === 0 && actionFilter === '';

  return (
    <main className="historial-main pt-20">
      <div className="relative mx-auto max-w-5xl px-6 py-10">

        {/* ── Encabezado ── */}
        <section className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <History className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/50">
                  Todos tus movimientos
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,245,128,0.15)]">
                  Historial de Cuenta
                </h1>
              </div>
            </div>

            {/* Botón exportar CSV */}
            {rawTransactions.length > 0 && (
              <button
                onClick={() => downloadCSV(rawTransactions)}
                className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition-all hover:bg-emerald-400/20"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar CSV
              </button>
            )}
          </div>
          <p className="mt-4 text-white/55 max-w-2xl text-sm leading-relaxed">
            Consulta todas tus transacciones, jugadas, bonos y movimientos de recargas o retiros en un solo lugar.
          </p>
        </section>

        {/* ── Empty state global ── */}
        {isEmpty ? (
          <div className="rounded-[30px] border border-[rgba(0,245,128,0.12)] bg-[linear-gradient(160deg,rgba(18,38,25,0.95)_0%,rgba(13,31,24,1)_100%)] p-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <EmptyHistorialState />
          </div>
        ) : (
          <>
            {/* ── Gráficas ── */}
            <section className="mb-8 grid gap-6 lg:grid-cols-2">

              {/* Evolución de Balance */}
              <div className="flex flex-col rounded-[30px] border border-[rgba(0,245,128,0.15)] bg-[linear-gradient(160deg,rgba(18,38,25,0.98)_0%,rgba(13,31,24,1)_100%)] p-6 shadow-[0_0_0_1px_rgba(0,245,128,0.05),0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Rendimiento</div>
                      <h3 className="text-lg font-black text-white">Evolución de Balance</h3>
                    </div>
                  </div>
                  {loadingResumen && <RefreshCw className="h-4 w-4 animate-spin text-emerald-400/60" />}
                </div>

                {/* Filtros de días — afectan al gráfico de evolución */}
                <div className="mb-4 flex gap-1.5">
                  {DAY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedDays(opt.value)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                        selectedDays === opt.value
                          ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                          : 'bg-white/5 text-white/40 border border-white/8 hover:text-white/70'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {errorResumen ? (
                  <div className="flex h-52 items-center justify-center text-sm text-red-400/70">{errorResumen}</div>
                ) : loadingResumen ? (
                  <div className="h-52 w-full animate-pulse rounded-2xl bg-white/5" />
                ) : isAllZeroBalance ? (
                  <div className="h-52 w-full"><EmptyChartState message="Sin datos de balance en este período" /></div>
                ) : (
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F580" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00F580" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#ffffff40"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          name="Fichas Totales"
                          stroke="#00F580"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorBalance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Distribución de Jugadas */}
              <div className="flex flex-col rounded-[30px] border border-[rgba(201,150,47,0.15)] bg-[linear-gradient(160deg,rgba(38,32,18,0.98)_0%,rgba(24,20,13,1)_100%)] p-6 shadow-[0_0_0_1px_rgba(201,150,47,0.05),0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-yellow-300/20 bg-yellow-300/10 text-yellow-300">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Preferencias</div>
                      <h3 className="text-lg font-black text-white">Distribución de Jugadas</h3>
                    </div>
                  </div>
                  {loadingResumen && <RefreshCw className="h-4 w-4 animate-spin text-yellow-400/60" />}
                </div>

                {errorResumen ? (
                  <div className="flex h-[260px] items-center justify-center text-sm text-red-400/70">{errorResumen}</div>
                ) : loadingResumen ? (
                  <div className="h-[260px] w-full animate-pulse rounded-2xl bg-white/5" />
                ) : distributionData.length === 0 ? (
                  <div className="h-[260px] w-full">
                    <EmptyChartState message="Juega una partida para ver tu distribución" />
                  </div>
                ) : (
                  <div className="h-[260px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          content={(props) => (
                            <ul className="flex flex-wrap justify-center gap-4 mt-2">
                              {props.payload?.map((entry: any, index: number) => (
                                <li key={`item-${index}`} className="flex items-center text-xs text-white/70">
                                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.payload.color }} />
                                  {entry.value}
                                </li>
                              ))}
                            </ul>
                          )}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </section>

            {/* ── Filtros ── */}
            <section className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-[24px] border border-white/6 bg-black/15 px-4 py-4 backdrop-blur-sm overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {[
                  { label: 'Todos', value: '' },
                  { label: 'Apuestas', value: 'BET' },
                  { label: 'Premios', value: 'WIN' },
                  { label: 'Depósitos', value: 'DEPOSIT' },
                  { label: 'Retiros', value: 'WITHDRAW' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setActionFilter(opt.value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      actionFilter === opt.value
                        ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                        : 'bg-white/5 text-white/40 border border-white/8 hover:text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-white/35">
                <span>
                  {rawTransactions.length} de {totalCount} movimiento{totalCount !== 1 ? 's' : ''}
                </span>
              </div>
            </section>

            {/* ── Lista de actividad ── */}
            <section className="grid gap-6">
              {loadingHistory ? (
                <div className="rounded-[30px] border border-[rgba(0,245,128,0.15)] bg-[linear-gradient(160deg,rgba(18,38,25,0.98)_0%,rgba(13,31,24,1)_100%)] p-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-[24px] bg-white/5" />
                    ))}
                  </div>
                </div>
              ) : errorHistory ? (
                <div className="rounded-[30px] border border-red-400/20 bg-red-400/5 p-6 text-center text-sm text-red-400/70">
                  {errorHistory}
                </div>
              ) : (
                <>
                  <ActivityList
                    activities={allActivities}
                    onItemClick={handleActivityClick}
                  />

                  {/* Botón "Cargar más" */}
                  {currentPage < totalPages && (
                    <div className="flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : null}
                        {loadingMore ? 'Cargando...' : `Cargar más (${totalCount - rawTransactions.length} restantes)`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>

      {/* ── Modal de detalle ── */}
      {selectedTx && (
        <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </main>
  );
}
