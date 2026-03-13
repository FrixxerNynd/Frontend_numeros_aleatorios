"use client";
import React, { useState } from 'react';
import './wallet.css';
import BalanceCard from '@/components/BalanceCard';
import CashValueCard from '@/components/CashValueCard';
import ChipExchange from '@/components/ChipExchange';
import LifetimeWinningsCard from '@/components/LifetimeWinningsCard';
import ActivityList from '@/components/ActivityList';


export default function WalletPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBuyPackagesModal, setShowBuyPackagesModal] = useState(false);
  const vip = true;
  const balance = 125480;
  const cashValue = 12548;
  const winnings = 42900.5;
  const rate = 0.01;
  const activities = [
    {
      title: 'Blackjack Winnings', type: 'GAMING', date: 'Oct 24, 2023, 11:42 PM', chips: 2500, status: 'Success',
    },
    {
      title: 'Chip Conversion to Cash', type: 'WALLET', date: 'Oct 24, 2023, 09:15 PM', chips: -5000, status: 'Pending',
    },
    {
      title: 'Poker Tournament Entry', type: 'ENTRY FEE', date: 'Oct 23, 2023, 08:00 PM', chips: -1000, status: 'Success',
    },
    {
      title: 'Monthly VIP Bonus', type: 'PROMO', date: 'Oct 23, 2023, 12:00 AM', chips: 10000, status: 'Success',
    },
  ];
  return (
    <main className="wallet-main">
      <div className="mt-8">
        <div className="mb-8">
          <BalanceCard balance={balance} vip={vip} />
          <div className="flex gap-4 mt-4">
            <button className="casino-btn green" onClick={() => setShowBuyModal(true)}>Comprar fichas</button>
            <button className="casino-btn yellow" onClick={() => setShowBuyPackagesModal(true)}>Comprar fichas por paquetes</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <CashValueCard cashValue={cashValue} />
          <LifetimeWinningsCard winnings={winnings} />
        </div>
        <div className="mb-8">
          <ChipExchange rate={rate} />
        </div>
        <div className="mb-8">
          <ActivityList activities={activities} />
        </div>
        {/* Modales */}
        {showBuyModal && (
          <Modal onClose={() => setShowBuyModal(false)}>
            <BuyModal onClose={() => setShowBuyModal(false)} />
          </Modal>
        )}
        {showBuyPackagesModal && (
          <Modal onClose={() => setShowBuyPackagesModal(false)}>
            <BuyPackagesModal onClose={() => setShowBuyPackagesModal(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}


// Modal genérico
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-green-900 rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-yellow-400 font-bold" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}


// Modal de apuesta

// Modal de compra
function BuyModal({ onClose }) {
  const [moneyAmount, setMoneyAmount] = useState(0);
  return (
    <div>
      <h3 className="text-yellow-400 text-xl font-bold mb-4 text-center">Comprar fichas</h3>
      <input
        type="number"
        value={moneyAmount}
        onChange={e => setMoneyAmount(Number(e.target.value))}
        className="w-full bg-green-900 text-green-300 px-4 py-2 rounded text-lg border-none focus:outline-none mb-4"
        min={0}
        placeholder="Monto en dinero"
      />
      <button className="casino-btn green w-full" onClick={onClose} disabled={moneyAmount <= 0}>Confirmar compra</button>
      <button className="casino-btn yellow w-full mt-2" onClick={onClose}>Cerrar</button>
    </div>
  );
}

// Modal para comprar fichas por paquetes
function BuyPackagesModal({ onClose }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const packages = [
    { name: 'Paquete Básico', chips: 1000, price: 100 },
    { name: 'Paquete Premium', chips: 5000, price: 450 },
    { name: 'Paquete VIP', chips: 20000, price: 1600 },
  ];
  return (
    <div>
      <h3 className="text-yellow-400 text-xl font-bold mb-4 text-center">Comprar fichas por paquetes</h3>
      <div className="mb-4">
        {packages.map(pkg => (
          <label key={pkg.name} className="block mb-2">
            <input
              type="radio"
              name="package"
              value={pkg.name}
              checked={selectedPackage === pkg.name}
              onChange={() => setSelectedPackage(pkg.name)}
              className="mr-2"
            />
            {pkg.name} - {pkg.chips} fichas por ${pkg.price}
          </label>
        ))}
      </div>
      <button className="casino-btn yellow w-full" onClick={onClose} disabled={!selectedPackage}>Confirmar compra</button>
      <button className="casino-btn green w-full mt-2" onClick={onClose}>Cerrar</button>
    </div>
  );
}