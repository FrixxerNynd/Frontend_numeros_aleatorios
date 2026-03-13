// ─── Config ──────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Token JWT (temporal hasta tener Auth — lo lees de localStorage cuando lo implementes)
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper para manejar errores de la API
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`);
  }
  return data as T;
}

// ─── Tipos ───────────────────────────────────────────────────
export interface Wallet {
  id: string;
  userId: string;
  money: number;   // Pesos MXN
  chips: number;   // Fichas virtuales
}

export interface Transaction {
  id: string;
  userId: string;
  action: 'DEPOSIT' | 'BET' | 'WIN' | 'CONVERT_TO_CHIPS' | 'WITHDRAW';
  date: string;
  description: string;
  currencyType: 'chips' | 'money';
  amount: number;
}

export interface BalanceResponse {
  wallet: Wallet;
  chipsInMoney: number;
  chipColor: string;
  transactions: Transaction[];
}

export interface ChipPackage {
  price: number;
  chips: number;
}

export interface PackagesResponse {
  exchangeRate: string;
  packages: ChipPackage[];
  chipColors: { color: string; value: number }[];
}

// ─── Endpoints ───────────────────────────────────────────────

// POST /api/wallet/create
export async function createWallet(userId: string): Promise<{ message: string; wallet: Wallet }> {
  const res = await fetch(`${BASE_URL}/wallet/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });
  return handleResponse(res);
}

// GET /api/wallet/:userId
export async function getBalance(userId: string): Promise<BalanceResponse> {
  const res = await fetch(`${BASE_URL}/wallet/${userId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// GET /api/wallet/:userId/history
export async function getHistory(
  userId: string,
  filters?: { action?: string; currencyType?: string; from?: string; to?: string },
): Promise<{ userId: string; total: number; transactions: Transaction[] }> {
  const params = new URLSearchParams();
  if (filters?.action) params.append('action', filters.action);
  if (filters?.currencyType) params.append('currencyType', filters.currencyType);
  if (filters?.from) params.append('from', filters.from);
  if (filters?.to) params.append('to', filters.to);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/wallet/${userId}/history${qs}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// GET /api/wallet/info/packages
export async function getPackages(): Promise<PackagesResponse> {
  const res = await fetch(`${BASE_URL}/wallet/info/packages`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// POST /api/wallet/deposit — Modo libre ($MXN)
export async function depositMoney(userId: string, moneyAmount: number): Promise<{ message: string; wallet: Wallet }> {
  const res = await fetch(`${BASE_URL}/wallet/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, moneyAmount }),
  });
  return handleResponse(res);
}

// POST /api/wallet/deposit — Modo paquete (packageIndex 0-4)
export async function depositPackage(userId: string, packageIndex: number): Promise<{ message: string; wallet: Wallet }> {
  const res = await fetch(`${BASE_URL}/wallet/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, packageIndex }),
  });
  return handleResponse(res);
}

// POST /api/wallet/withdraw
export async function withdrawChips(userId: string, chipsAmount: number): Promise<{ message: string; wallet: Wallet }> {
  const res = await fetch(`${BASE_URL}/wallet/withdraw`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, chipsAmount }),
  });
  return handleResponse(res);
}
