import React from 'react';

interface StatsProps {
  label: string;
  value: string;
  trend?: string; // e.g. "+5.2%"
  trendUp?: boolean;
}

export function StatsOverview({ stats }: { stats: StatsProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          {/* Subtle background glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/5 to-[#d4af37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg rounded-xl"></div>
          
          <div className="relative z-10">
            <h4 className="text-[#d4af37] font-sans text-sm font-medium uppercase tracking-wide mb-2">{stat.label}</h4>
            <p className="text-white font-serif text-3xl font-bold">{stat.value}</p>
            
            {stat.trend && (
              <p className={`font-sans text-xs mt-2 font-medium ${stat.trendUp ? 'text-[#00ff88]' : 'text-[#ff4d4d]'}`}>
                {stat.trend} from last week
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
