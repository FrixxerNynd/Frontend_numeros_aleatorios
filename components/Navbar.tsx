import React from 'react';

const variants = ["Variant 1", "Variant 2", "Variant 3", "Variant 4"];

export default function Navbar({ selectedVariant, onSelectVariant }: {
  selectedVariant: number;
  onSelectVariant: (idx: number) => void;
}) {
  return (
    <nav className="flex items-center justify-between bg-green-900 p-4">
      <h1 className="text-2xl font-bold text-green-300">Casino Wallet Variants</h1>
      <div className="flex gap-2">
        {variants.map((v, idx) => (
          <button
            key={v}
            className={`px-4 py-2 rounded font-semibold ${selectedVariant === idx ? 'bg-green-400 text-green-900' : 'bg-green-800 text-green-300'}`}
            onClick={() => onSelectVariant(idx)}
          >
            {v}
          </button>
        ))}
      </div>
    </nav>
  );
}
