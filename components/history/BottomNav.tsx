import React from 'react';
import { Home, Dices, Clock, User } from 'lucide-react';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#06261d] border-t border-[#d4af37]/20 md:hidden">
      <div className="flex justify-around items-center p-3">
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-sans">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
          <Dices className="w-5 h-5" />
          <span className="text-[10px] font-sans">Games</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#d4af37] transition-colors">
          {/* Active state */}
          <div className="relative">
            <Clock className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00ff88] rounded-full"></div>
          </div>
          <span className="text-[10px] font-sans font-bold">History</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-sans">Profile</span>
        </button>
      </div>
    </div>
  );
}
