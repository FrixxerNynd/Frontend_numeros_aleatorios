'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  createWallet,
  getBalance,
  getHistory,
  getPackages,
  depositMoney,
  depositPackage,
  withdrawChips,
  type BalanceResponse,
  type Transaction,
  type PackagesResponse,
  type Wallet,
} from './walletApi';

// ─── useBalance ───────────────────────────────────────────────
// Obtiene saldo + historial completo del usuario
export function useBalance(userId: string) {
  const [data, setData] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getBalance(userId);
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ─── useHistory ───────────────────────────────────────────────
export function useHistory(userId: string, filters?: { action?: string; currencyType?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getHistory(userId, filters);
      setTransactions(res.transactions);
      setTotal(res.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId, filters?.action, filters?.currencyType]);

  useEffect(() => { refetch(); }, [refetch]);

  return { transactions, total, loading, error, refetch };
}

// ─── usePackages ──────────────────────────────────────────────
export function usePackages() {
  const [data, setData] = useState<PackagesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPackages()
      .then(setData)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// ─── useDeposit ───────────────────────────────────────────────
export function useDeposit(userId: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  // Depósito libre en MXN
  const depositFree = async (moneyAmount: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await depositMoney(userId, moneyAmount);
      setWallet(res.wallet);
      onSuccess?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Depósito por paquete
  const depositPkg = async (packageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await depositPackage(userId, packageIndex);
      setWallet(res.wallet);
      onSuccess?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { depositFree, depositPkg, loading, error, wallet };
}

// ─── useWithdraw ──────────────────────────────────────────────
export function useWithdraw(userId: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const withdraw = async (chipsAmount: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await withdrawChips(userId, chipsAmount);
      setWallet(res.wallet);
      onSuccess?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error, wallet };
}

// ─── useCreateWallet ──────────────────────────────────────────
export function useCreateWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const create = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createWallet(userId);
      setWallet(res.wallet);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, wallet };
}
