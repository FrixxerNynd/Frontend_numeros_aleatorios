'use client';
import React, { useState } from 'react';

export default function ChipExchange({ rate, onWithdraw, withdrawLoading, withdrawError }: {
  rate: number;
  onWithdraw: (payload: { chips: number }) => void;
  withdrawLoading: boolean;
  withdrawError: { message: string } | null;
}) {
  const [amount, setAmount] = useState(0);
  const equivalent = `$${(amount * rate).toFixed(2)} MXN`;

  const handleSubmit = () => {
    onWithdraw({ chips: amount });
  };

  return (
    <section className="bg-green-800 rounded-lg p-6 mb-4">
      <div className="text-green-300 text-lg font-semibold mb-4"> Retiro de Fichas</div>

      {/* Retiro
      <div className="flex gap-2 mb-4">
        <button
          className="casino-btn yellow flex-1"
          onClick={() => setAmount(0)}
        >🏧 Retirar</button>
      </div> */}

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-green-200 text-xs mb-1">
            FICHAS A RETIRAR
          </label>
          <input
            type="number"
            value={amount || ''}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-green-950 text-white px-4 py-2 rounded text-lg border border-green-700 focus:outline-none focus:border-yellow-400"
            min={1}
            placeholder="Ej: 500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-green-200 text-xs mb-1">RECIBIRÁS</label>
          <div className="w-full bg-green-950 text-yellow-400 px-4 py-2 rounded text-lg border border-green-700 font-bold">
            {amount > 0 ? equivalent : '—'}
          </div>
        </div>
      </div>

      <button
        className="bg-green-400 text-green-900 px-6 py-2 rounded font-bold w-full text-lg"
        onClick={handleSubmit}
        disabled={withdrawLoading || amount <= 0}
      >
        {withdrawLoading
          ? 'Procesando...'
          : `Retirar ${amount} fichas → $${(amount * rate).toFixed(2)} MXN`}
      </button>

      {withdrawError && (
        <div className="text-red-400 mt-3 text-sm bg-red-950 p-2 rounded">
          ⚠️ {withdrawError.message}
        </div>
      )}
    </section>
  );
}
