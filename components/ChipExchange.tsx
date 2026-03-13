import React, { useState } from 'react';

export default function ChipExchange({ rate, onDeposit, depositLoading, depositError, onWithdraw, withdrawLoading, withdrawError }: {
  rate: number;
  onDeposit: (payload: { chips: number }) => void;
  depositLoading: boolean;
  depositError: any;
  onWithdraw: (payload: { chips: number }) => void;
  withdrawLoading: boolean;
  withdrawError: any;
}) {
  const [chips, setChips] = useState(0);
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const cashValue = chips * rate;

  const handleSubmit = () => {
    if (action === 'deposit') {
      onDeposit({ chips });
    } else {
      onWithdraw({ chips });
    }
  };

  return (
    <section className="bg-green-800 rounded-lg p-6 mb-4">
      <div className="text-green-300 text-lg font-semibold mb-2">Instant Chip Exchange</div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-green-200 text-xs mb-1">CHIPS</label>
          <input
            type="number"
            value={chips}
            onChange={e => setChips(Number(e.target.value))}
            className="w-full bg-green-900 text-green-300 px-4 py-2 rounded text-lg border-none focus:outline-none"
            min={0}
          />
        </div>
        <div className="flex-1">
          <label className="block text-green-200 text-xs mb-1">EQUIVALENT CASH VALUE</label>
          <input
            type="text"
            value={`$${cashValue.toFixed(2)}`}
            readOnly
            className="w-full bg-green-900 text-green-300 px-4 py-2 rounded text-lg border-none focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          className={`casino-btn green ${action === 'deposit' ? 'opacity-100' : 'opacity-70'}`}
          onClick={() => setAction('deposit')}
        >Depositar</button>
        <button
          className={`casino-btn yellow ${action === 'withdraw' ? 'opacity-100' : 'opacity-70'}`}
          onClick={() => setAction('withdraw')}
        >Retirar</button>
      </div>
      <button
        className="bg-green-400 text-green-900 px-6 py-2 rounded font-bold w-full"
        onClick={handleSubmit}
        disabled={depositLoading || withdrawLoading || chips <= 0}
      >
        {action === 'deposit' ? (depositLoading ? 'Depositando...' : 'Confirmar Depósito') : (withdrawLoading ? 'Retirando...' : 'Confirmar Retiro')}
      </button>
      {(depositError || withdrawError) && (
        <div className="text-red-400 mt-2 text-sm">{depositError?.message || withdrawError?.message}</div>
      )}
    </section>
  );
}
