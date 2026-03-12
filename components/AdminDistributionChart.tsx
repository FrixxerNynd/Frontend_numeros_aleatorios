"use client";

import { useEffect, useState } from 'react';

export function AdminDistributionChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="glass-panel rounded-[2rem] p-12 relative overflow-hidden">
      {/* Animated background glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="font-serif text-5xl text-[#D4AF37] tracking-tight leading-tight">Distribución Global<br/><span className="text-white italic">de Juegos</span></h2>
            <p className="text-[#10B981]/60 max-w-md leading-relaxed mt-4">Detailed real-time breakdown of game engagement across all active nodes in the global network. Data synchronized every 60 seconds.</p>
          </div>

          <div className={`grid grid-cols-2 gap-8 pt-8 border-t border-[#D4AF37]/10 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-sm bg-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.3)]"></div>
                <span className="text-sm font-medium text-white">Slots Premium</span>
                <span className="text-xs text-[#10B981]/50 ml-auto">45%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-sm bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                <span className="text-sm font-medium text-white">Blackjack VIP</span>
                <span className="text-xs text-[#10B981]/50 ml-auto">25%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-sm bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                <span className="text-sm font-medium text-white">Live Roulette</span>
                <span className="text-xs text-[#10B981]/50 ml-auto">15%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-sm bg-[#AA8E39]/50"></div>
                <span className="text-sm font-medium text-white">Other Tables</span>
                <span className="text-xs text-[#10B981]/50 ml-auto">15%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-80 h-80 lg:w-[400px] lg:h-[400px] flex items-center justify-center">
          {/* Main Chart Container */}
          <div 
            className={`pie-chart-large w-full h-full gold-glow transition-all duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${mounted ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 -rotate-12'}`}
          >
            {/* Shimmer Overlay */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-[3000ms] ease-in-out ${mounted ? 'translate-x-full' : ''}`}></div>
          </div>

          {/* Center Content */}
          <div className={`absolute flex flex-col items-center justify-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <span className="text-4xl font-bold text-white">100%</span>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold">Coverage</span>
            
            {/* Decorative Pulse */}
            <div className={`absolute w-32 h-32 border border-[#D4AF37]/20 rounded-full ${mounted ? 'animate-ping-slow' : ''}`}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pie-chart-large {
          background: conic-gradient(
            #00FF88 0% 45%, 
            #D4AF37 45% 70%, 
            #10B981 70% 85%, 
            #AA8E39 85% 100%
          );
          border-radius: 50%;
          position: relative;
          overflow: hidden;
        }
        .pie-chart-large::after {
          content: '';
          position: absolute;
          inset: 15%;
          background: #0A2A1F;
          border-radius: 50%;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
          z-index: 2;
        }
        .gold-glow {
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.1), 0 0 80px rgba(212, 175, 55, 0.05);
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
