"use client";

import { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';
import { useAdminHistory } from '@/lib/hooks/useAdminHistory';

export default function AdminAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { logs, isLoading, error, downloadCsv } = useAdminHistory();

  const filteredLogs = logs.filter(log =>
    log.idUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#04140F] text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.03) 0%, transparent 40%)'
      }}></div>

      <AdminSidebar activePath="/admin/analytics" />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h1 className="font-serif text-4xl text-[#D4AF37]">Detailed Analytics</h1>
              <p className="text-[#10B981]/60 text-sm">Full operational history and system-wide audit logs.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Filter logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#04140F]/60 border border-[#D4AF37]/40 rounded-xl py-2 px-10 text-sm text-white placeholder-[#10B981]/30 focus:ring-1 focus:ring-[#D4AF37] outline-none w-64 transition-all"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] text-sm">search</span>
              </div>
              <button
                onClick={downloadCsv}
                className="bg-gradient-to-r from-[#D4AF37] via-[#F3D784] to-[#AA8E39] text-[#04140F] font-bold text-xs px-6 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] shadow-lg shadow-[#D4AF37]/10"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                EXPORT CSV
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] overflow-hidden">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
                <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                <p className="text-sm italic">Cargando auditoría del casino...</p>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center justify-center text-rose-400 gap-3">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p className="text-sm italic">Error al cargar: {error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/10 bg-[#0A2A1F]/30">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">ID</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Usuario</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Categoría</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Descripción</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Valor</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] text-right">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/5">
                    {filteredLogs.map((log) => {
                      const valor = log.fichas != null
                        ? `${log.fichas > 0 ? '+' : ''}${log.fichas} fichas`
                        : log.dinero != null
                        ? `${log.dinero > 0 ? '+' : ''}$${Math.abs(log.dinero)} MXN`
                        : 'N/A';
                      const isPositive = (log.fichas ?? log.dinero ?? 0) > 0;
                      return (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5 text-xs font-mono text-[#D4AF37]/60 group-hover:text-[#D4AF37]">{log.id.slice(0, 8)}...</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] text-xs">
                                {log.idUsuario.slice(0, 1).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-white">{log.idUsuario}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#10B981]/10 text-[#00FF88] border border-[#10B981]/20">
                              {log.categoria}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-300 font-medium">{log.descripcion}</td>
                          <td className="px-8 py-5">
                            <span className={`text-sm font-bold ${isPositive ? 'text-[#00FF88]' : 'text-rose-500'}`}>
                              {valor}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[10px] font-medium text-slate-500 text-right">
                            {new Date(log.fecha).toLocaleString('es-MX')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                    <p className="text-sm italic">No se encontraron registros.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
