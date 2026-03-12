"use client";

import { useEffect } from 'react';
import { useHistory } from '@/lib/hooks/useHistory';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { RecentActivitySummary } from '@/components/RecentActivitySummary';
import { EarningsOverview } from '@/components/EarningsOverview';
import { ActivityHistoryTable } from '@/components/ActivityHistoryTable';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HistorialPage() {
  const { history, isLoading, error, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-emerald-dark font-sans text-slate-100">
      <DashboardSidebar activePath="/historial" />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader />

        <div className="p-6 md:p-8 space-y-8">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de Conexión</AlertTitle>
              <AlertDescription>
                {error} — ¿Backend activo en puerto 3000?
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary-emerald" />
                <p className="text-sm text-slate-400">Cargando registros...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-emerald-card/20 rounded-2xl border border-white/5">
                <span className="material-symbols-outlined text-4xl text-slate-500">history</span>
                <p className="text-slate-300 text-sm font-medium">Sin registros en el historial.</p>
              </div>
            ) : (
              <ActivityHistoryTable data={history} />
            )}
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="h-20 md:hidden"></div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#051510] border-t border-white/5 px-8 py-3 flex justify-between items-center z-50">
        <a className="flex flex-col items-center gap-1 text-slate-400" href="/user/dashboard">
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[9px] font-bold uppercase">Dashboard</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined text-xl">playing_cards</span>
          <span className="text-[9px] font-bold uppercase">Games</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary-emerald" href="/historial">
          <span className="material-symbols-outlined text-xl">history</span>
          <span className="text-[9px] font-bold uppercase">History</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[9px] font-bold uppercase">Profile</span>
        </a>
      </div>
    </div>
  );
}