// API service for wallet backend
// Adjust BASE_URL as needed
const BASE_URL = process.env.NEXT_PUBLIC_WALLET_API_URL || 'http://localhost:3000';

export async function createWallet(data) {
  const res = await fetch(`${BASE_URL}/wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getBalance(walletId) {
  const res = await fetch(`${BASE_URL}/wallet/${walletId}/balance`);
  return res.json();
}

export async function depositChips(walletId, data) {
  const res = await fetch(`${BASE_URL}/wallet/${walletId}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function withdrawChips(walletId, data) {
  const res = await fetch(`${BASE_URL}/wallet/${walletId}/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getHistory(walletId) {
  const res = await fetch(`${BASE_URL}/wallet/${walletId}/history`);
  return res.json();
}

export async function creditWinner(walletId, data) {
  const res = await fetch(`${BASE_URL}/wallet/${walletId}/credit-winner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
