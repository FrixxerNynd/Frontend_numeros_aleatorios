import { useState, useEffect } from 'react';
import {
  createWallet,
  getBalance,
  depositChips,
  withdrawChips,
  getHistory,
  creditWinner,
} from './walletApi';

export function useCreateWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createWallet(payload);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, data };
}

export function useBalance(walletId) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletId) return;
    setLoading(true);
    getBalance(walletId)
      .then(setBalance)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [walletId]);

  return { balance, loading, error };
}

export function useDeposit(walletId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deposit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await depositChips(walletId, payload);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { deposit, loading, error, data };
}

export function useWithdraw(walletId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const withdraw = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await withdrawChips(walletId, payload);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error, data };
}

export function useHistory(walletId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletId) return;
    setLoading(true);
    getHistory(walletId)
      .then(setHistory)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [walletId]);

  return { history, loading, error };
}

export function useCreditWinner(walletId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const credit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await creditWinner(walletId, payload);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { credit, loading, error, data };
}
