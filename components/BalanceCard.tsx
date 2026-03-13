import React from 'react';

export default function BalanceCard({ balance, vip, onCashOut, onBuyChips, cashOutLoading, buyChipsLoading }: {
  balance: number;
  vip: boolean;
  onCashOut?: () => void;
  onBuyChips?: () => void;
  cashOutLoading?: boolean;
  buyChipsLoading?: boolean;
}) {
  return (
    <section className="bg-green-800 rounded-lg p-6 mb-4 flex flex-col items-start">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-yellow-400 text-lg font-semibold">TOTAL CHIP BALANCE</div>
          <div className="text-4xl font-bold text-white mt-2">{balance.toLocaleString()}</div>
          <div className="text-green-300 text-xs mt-1">Premium last night's session</div>
        </div>
        {vip && <button className="bg-yellow-400 text-green-900 px-4 py-2 rounded font-bold ml-4">$ VIP Gold</button>}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-yellow-400 text-green-900 px-6 py-2 rounded font-bold"
          onClick={onCashOut}
          disabled={cashOutLoading}
        >{cashOutLoading ? 'Retirando...' : '$ Cash Out'}</button>
        <button
          className="bg-green-400 text-green-900 px-6 py-2 rounded font-bold"
          onClick={onBuyChips}
          disabled={buyChipsLoading}
        >{buyChipsLoading ? 'Comprando...' : 'Buy Chips'}</button>
      </div>
    </section>
  );
}
