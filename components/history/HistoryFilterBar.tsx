import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HistoryFilterBarProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: { ip: string; gameType: string; amountRange: [number, number] }) => void;
}

export function HistoryFilterBar({ onSearch, onFilterChange }: HistoryFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ip, setIp] = useState('');
  const [gameType, setGameType] = useState('All');
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const notifyChange = (newIp: string, newGameType: string, newRange: [number, number]) => {
    onFilterChange({ ip: newIp, gameType: newGameType, amountRange: newRange });
  };

  return (
    <div className="bg-[#0a2f25] border border-[#d4af37]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end shadow-lg w-full">
      {/* Search Input */}
      <div className="flex-1 w-full">
        <label className="text-sm text-[#d4af37] font-sans block mb-1">Search ID/Username</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            className="w-full bg-[#06261d] border border-[#d4af37]/30 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#d4af37] font-sans placeholder-gray-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* IP Address */}
      <div className="flex-1 w-full">
        <label className="text-sm text-[#d4af37] font-sans block mb-1">IP Address</label>
        <input
          type="text"
          className="w-full bg-[#06261d] border border-[#d4af37]/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#d4af37] font-sans placeholder-gray-500"
          placeholder="e.g. 192.168.1.1"
          value={ip}
          onChange={(e) => {
            setIp(e.target.value);
            notifyChange(e.target.value, gameType, amountRange);
          }}
        />
      </div>

      {/* Game Type */}
      <div className="flex-1 w-full">
        <label className="text-sm text-[#d4af37] font-sans block mb-1">Game Type</label>
        <select
          className="w-full bg-[#06261d] border border-[#d4af37]/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#d4af37] font-sans appearance-none"
          value={gameType}
          onChange={(e) => {
            setGameType(e.target.value);
            notifyChange(ip, e.target.value, amountRange);
          }}
        >
          <option value="All">All Games</option>
          <option value="Slots">Slots</option>
          <option value="Roulette">Roulette</option>
          <option value="Blackjack">Blackjack</option>
        </select>
      </div>

      {/* Range Slider */}
      <div className="flex-1 w-full min-w-[200px]">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-[#d4af37] font-sans">Amount Range</label>
          <span className="text-xs text-white font-sans">${amountRange[0]} - ${amountRange[1] === 10000 ? '10K+' : amountRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          className="w-full accent-[#d4af37]"
          value={amountRange[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setAmountRange([0, val]);
            notifyChange(ip, gameType, [0, val]);
          }}
        />
      </div>
    </div>
  );
}
