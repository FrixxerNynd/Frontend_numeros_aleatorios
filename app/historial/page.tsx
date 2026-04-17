'use client';
import React, { useState } from 'react';
import { History, Search, Filter, TrendingUp, PieChart } from 'lucide-react';
import ActivityList from '@/components/wallet/ActivityList';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

// Datos estaticos de rendimiento para las graficas
const performanceData = [
  { name: '10 Abr', balance: 5000, depositado: 1000 },
  { name: '11 Abr', balance: 4800, depositado: 0 },
  { name: '12 Abr', balance: 7500, depositado: 500 },
  { name: '13 Abr', balance: 7200, depositado: 0 },
  { name: '14 Abr', balance: 6900, depositado: 0 },
  { name: '15 Abr', balance: 10500, depositado: 1500 },
  { name: 'Hoy', balance: 11000, depositado: 200 },
];

const distributionData = [
  { name: 'Ruleta', value: 4500, color: '#00F580' },
  { name: 'Tragamonedas', value: 3000, color: '#C9962F' },
  { name: 'Blackjack', value: 2000, color: '#3b82f6' },
  { name: 'Póker', value: 1500, color: '#a855f7' },
];

export default function HistorialPage() {
  const mockActivities = [
    {
      title: 'Premio en Ruleta Multipolo',
      type: 'GAMING',
      date: new Date(Date.now() - 1000 * 60 * 30).toLocaleString('es-MX'),
      chips: 500,
      status: 'Success' as const,
    },
    {
      title: 'Entrada a Mesa de Blackjack',
      type: 'ENTRY FEE',
      date: new Date(Date.now() - 1000 * 60 * 60).toLocaleString('es-MX'),
      chips: -50,
      status: 'Success' as const,
    },
    {
      title: 'Compra de paquete VIP',
      type: 'WALLET',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString('es-MX'),
      chips: 10000,
      status: 'Success' as const,
    },
    {
      title: 'Bono diario de conexión',
      type: 'PROMO',
      date: new Date(Date.now() - 1000 * 60 * 60 * 25).toLocaleString('es-MX'),
      chips: 100,
      status: 'Success' as const,
    },
    {
      title: 'Retiro de ganancias',
      type: 'WALLET',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleString('es-MX'),
      chips: -2500,
      status: 'Pending' as const,
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-3 shadow-xl backdrop-blur-sm z-50 relative">
          <p className="mb-1 text-sm font-bold text-white">{label}</p>
          <div className="flex flex-col gap-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload.color }} />
                <span className="text-white/70">{entry.name}:</span>
                <span className="font-bold text-white">{entry.value.toLocaleString()}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="historial-main pt-20">
      <div className="relative mx-auto max-w-5xl px-6 py-10">
        <section className="mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <History className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/50">Todos tus movimientos</div>
              <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,245,128,0.15)]">
                Historial de Cuenta
              </h1>
            </div>
          </div>
          <p className="mt-4 text-white/55 max-w-2xl text-sm leading-relaxed">
            Consulta todas tus transacciones, jugadas, bonos y movimientos de recargas o retiros en un solo lugar. 
          </p>
        </section>

        {/* Cajas de Graficas de Rendimiento */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Grafica de Evolucion de Balance */}
          <div className="flex flex-col rounded-[30px] border border-[rgba(0,245,128,0.15)] bg-[linear-gradient(160deg,rgba(18,38,25,0.98)_0%,rgba(13,31,24,1)_100%)] p-6 shadow-[0_0_0_1px_rgba(0,245,128,0.05),0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Rendimiento</div>
                <h3 className="text-lg font-black text-white">Evolución de Balance</h3>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F580" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F580" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="balance" name="Fichas Totales" stroke="#00F580" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grafica de Distribucion de Juegos */}
          <div className="flex flex-col rounded-[30px] border border-[rgba(201,150,47,0.15)] bg-[linear-gradient(160deg,rgba(38,32,18,0.98)_0%,rgba(24,20,13,1)_100%)] p-6 shadow-[0_0_0_1px_rgba(201,150,47,0.05),0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-2 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-yellow-300/20 bg-yellow-300/10 text-yellow-300">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Preferencias</div>
                <h3 className="text-lg font-black text-white">Distribución de Jugadas</h3>
              </div>
            </div>

            <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
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
                    content={(props) => {
                      const { payload } = props;
                      return (
                        <ul className="flex flex-wrap justify-center gap-4 mt-2">
                          {payload?.map((entry: any, index: number) => (
                            <li key={`item-${index}`} className="flex items-center text-xs text-white/70">
                              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.payload.color }} />
                              {entry.value}
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Filters bar */}
        <section className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between rounded-[24px] border border-white/6 bg-black/15 px-4 py-4 backdrop-blur-sm">
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
             <input 
               type="text" 
               placeholder="Buscar movimiento..." 
               className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-white/40 focus:border-emerald-400/40 focus:bg-white/10 focus:outline-none transition-all"
             />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all">
               <Filter className="h-3 w-3" />
               Filtros
             </button>
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/20 transition-all">
               Últimos 7 días
             </button>
           </div>
        </section>

        <section className="grid gap-6">
          <ActivityList activities={mockActivities} />
        </section>
      </div>
    </main>
  );
}
