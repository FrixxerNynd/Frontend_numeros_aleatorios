import React from 'react';
import { Dices, Wallet, ShieldCheck, Info } from 'lucide-react';

interface HistoryLogCardProps {
  id: string;
  userId: string;
  category: 'game' | 'deposit' | 'conversion';
  description: string;
  date: string;
  ip: string;
  amount: number; // positive or negative
  currency: 'money' | 'chips';
}

export function HistoryLogCard({
  userId,
  category,
  description,
  date,
  ip,
  amount,
  currency,
}: HistoryLogCardProps) {
  const isPositive = amount > 0;
  const isGame = category === 'game';
  
  return (
    <div className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-[#d4af37]/50 transition-colors">
      <div className="flex justify-between items-start">
        {/* Left Side: Icon & Info */}
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-[#06261d] rounded-lg border border-[#d4af37]/30">
            {isGame ? (
              <Dices className="text-[#d4af37] w-6 h-6" />
            ) : (
              <Wallet className="text-[#d4af37] w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-white font-serif text-lg leading-tight">{description}</h3>
            <p className="text-gray-400 font-sans text-xs mt-1">
              User ID: <span className="text-gray-300">{userId}</span> • IP: {ip}
            </p>
            <p className="text-gray-500 font-sans text-xs mt-1">{date}</p>
          </div>
        </div>

        {/* Right Side: Amount */}
        <div className="text-right">
          <span
            className={`font-sans font-bold text-lg block ${
              isPositive ? 'text-[#00ff88]' : 'text-[#ff4d4d]'
            }`}
          >
            {isPositive ? '+' : ''}{amount} {currency === 'chips' ? 'Chips' : 'USD'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-[#d4af37]/10">
        <button className="flex-1 flex items-center justify-center gap-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#06261d] transition-colors rounded-lg py-2 text-sm font-sans font-medium">
          <Info className="w-4 h-4" />
          Details
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#06261d] hover:brightness-110 transition-all rounded-lg py-2 text-sm font-sans font-bold">
          <ShieldCheck className="w-4 h-4" />
          Verify Action
        </button>
      </div>
    </div>
  );
}
