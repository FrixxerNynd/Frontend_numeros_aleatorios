"use client";

import Link from 'next/link';
import { ShieldCheck, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06261d] flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-[#d4af37] font-bold tracking-tight">
            Premium Casino <br />
            <span className="text-white">History Module</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Selecciona la vista que deseas probar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/history" className="group relative bg-[#0a2f25] border border-[#d4af37]/30 rounded-2xl p-8 hover:border-[#d4af37] transition-all overflow-hidden flex flex-col items-center gap-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 to-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-[#06261d] rounded-full border border-[#d4af37]/50 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <ShieldCheck className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">Admin View</h2>
              <p className="text-sm text-gray-400">Panel de control completo con gráficas globales, y listado general de transacciones de usuarios.</p>
            </div>
          </Link>

          <Link href="/user/history" className="group relative bg-[#0a2f25] border border-[#d4af37]/30 rounded-2xl p-8 hover:border-[#d4af37] transition-all overflow-hidden flex flex-col items-center gap-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 to-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-[#06261d] rounded-full border border-[#d4af37]/50 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <User className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">User View</h2>
              <p className="text-sm text-gray-400">Historial personal del jugador, balances actuales y gráfica de ganancias de los últimos 7 días.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
