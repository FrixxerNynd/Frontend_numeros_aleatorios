'use client';

import { motion } from 'framer-motion';
import { getNumberBgClass } from '@/core/engines/roulette.engine';

interface Bet {
  type: string;
  value: string | number;
  amount: number;
}

interface BettingTableProps {
  bets: Bet[];
  selectedChip: number;
  onPlaceBet: (bet: Omit<Bet, 'amount'>) => void;
  disabled: boolean;
}

export function BettingTable({ bets, selectedChip, onPlaceBet, disabled }: BettingTableProps) {
  const getBetAmount = (type: string, value: string | number) => {
    return bets
      .filter(bet => bet.type === type && bet.value === value)
      .reduce((sum, bet) => sum + bet.amount, 0);
  };

  const renderChip = (amount: number) => {
    if (amount === 0) return null;
    
    const chipColor = amount >= 100 ? 'bg-purple-600' : amount >= 50 ? 'bg-red-600' : amount >= 25 ? 'bg-green-600' : amount >= 10 ? 'bg-blue-600' : 'bg-yellow-600';
    
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${chipColor} border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold z-10 pointer-events-none`}
      >
        ${amount}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-2xl shadow-2xl border-4 border-white/5">
        {/* Main number grid */}
        <div
          className="grid gap-1 mb-4"
          style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, 1fr)' }}
        >
          {/* 0 ocupa las 3 filas */}
          <button
            onClick={() => onPlaceBet({ type: 'straight', value: 0 })}
            disabled={disabled}
            style={{ gridRow: '1 / 4' }}
            className={`relative ${getNumberBgClass(0)} rounded font-bold text-xl hover:opacity-80 disabled:cursor-not-allowed py-2 border-2 border-yellow-500/50 transition-all flex items-center justify-center`}
          >
            0
            {renderChip(getBetAmount('straight', 0))}
          </button>

          {/* Fila 1 top=3,6,9... | Fila 2 mid=2,5,8... | Fila 3 bottom=1,4,7... */}
          {[3, 2, 1].map((startRow) =>
            Array.from({ length: 12 }, (_, col) => startRow + col * 3).map((num) => (
              <button
                key={num}
                onClick={() => onPlaceBet({ type: 'straight', value: num })}
                disabled={disabled}
                className={`relative ${getNumberBgClass(num)} rounded font-bold text-sm hover:opacity-80 disabled:cursor-not-allowed py-4 border-2 border-yellow-500/50 transition-all`}
              >
                {num}
                {renderChip(getBetAmount('straight', num))}
              </button>
            ))
          )}
        </div>

        {/* Outside bets */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: '1-18' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-4 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            1 to 18
            {renderChip(getBetAmount('outside', '1-18'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: 'even' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-4 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            EVEN
            {renderChip(getBetAmount('outside', 'even'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: 'red' })}
            disabled={disabled}
            className="relative bg-red-600 text-white rounded py-4 font-bold hover:bg-red-500 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            RED
            {renderChip(getBetAmount('outside', 'red'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: 'black' })}
            disabled={disabled}
            className="relative bg-zinc-900 text-white rounded py-4 font-bold hover:bg-zinc-800 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            BLACK
            {renderChip(getBetAmount('outside', 'black'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: 'odd' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-4 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            ODD
            {renderChip(getBetAmount('outside', 'odd'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'outside', value: '19-36' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-4 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all text-xs"
          >
            19 to 36
            {renderChip(getBetAmount('outside', '19-36'))}
          </button>
        </div>

        {/* Dozens */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => onPlaceBet({ type: 'dozen', value: '1st-12' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-3 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all"
          >
            1st 12
            {renderChip(getBetAmount('dozen', '1st-12'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'dozen', value: '2nd-12' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-3 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all"
          >
            2nd 12
            {renderChip(getBetAmount('dozen', '2nd-12'))}
          </button>
          <button
            onClick={() => onPlaceBet({ type: 'dozen', value: '3rd-12' })}
            disabled={disabled}
            className="relative bg-zinc-700 text-white rounded py-3 font-bold hover:bg-zinc-600 disabled:cursor-not-allowed border-2 border-yellow-500/50 transition-all"
          >
            3rd 12
            {renderChip(getBetAmount('dozen', '3rd-12'))}
          </button>
        </div>
      </div>
    </div>
  );
}
