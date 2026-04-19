// ─── Config ──────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('access_token') || localStorage.getItem('jwt_token'))
    : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    credentials: 'include',
    ...init,
  });
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    console.error('[API Error]', res.status, data);
    throw new Error(data.message || `Error ${res.status}`);
  }
  return data as T;
}

// ─── Tipos ───────────────────────────────────────────────────
export interface Wallet {
  id: string;
  userId: string;
  money: number;
  chips: number;
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

function getWalletScope(userId?: string): string {
  return userId ? `/wallet/${userId}` : '/wallet/me';
}

export async function createWallet(userId?: string): Promise<{ message: string; wallet: Wallet }> {
  const payload = userId ? { userId } : {};
  const res = await apiFetch(`${BASE_URL}/wallet/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getBalance(userId?: string): Promise<BalanceResponse> {
  const res = await apiFetch(`${BASE_URL}${getWalletScope(userId)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export interface HistoryResponse {
  userId: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  transactions: Transaction[];
}

export async function getHistory(
  userId?: string,
  filters?: {
    action?: string;
    currencyType?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  },
): Promise<HistoryResponse> {
  const params = new URLSearchParams();
  if (filters?.action) params.append('action', filters.action);
  if (filters?.currencyType) params.append('currencyType', filters.currencyType);
  if (filters?.from) params.append('from', filters.from);
  if (filters?.to) params.append('to', filters.to);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiFetch(`${BASE_URL}${getWalletScope(userId)}/history${qs}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── Tipos para el Historial ──────────────────────────────────

export interface PerformanceDayData {
  name: string;
  balance: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ResumenResponse {
  performanceData: PerformanceDayData[];
  distributionData: DistributionItem[];
  currentBalance: number;
  totalBet: number;
  totalWon: number;
}

export async function getResumen(
  days?: number,
): Promise<ResumenResponse> {
  const params = days ? `?days=${days}` : '';
  const res = await apiFetch(`${BASE_URL}/wallet/me/resumen${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getPackages(): Promise<PackagesResponse> {
  const res = await apiFetch(`${BASE_URL}/wallet/info/packages`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function depositMoney(userId: string | undefined, moneyAmount: number): Promise<{ message: string; wallet: Wallet }> {
  const payload = userId ? { userId, moneyAmount } : { moneyAmount };
  const res = await apiFetch(`${BASE_URL}/wallet/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function depositPackage(userId: string | undefined, packageIndex: number): Promise<{ message: string; wallet: Wallet }> {
  const payload = userId ? { userId, packageIndex } : { packageIndex };
  const res = await apiFetch(`${BASE_URL}/wallet/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function withdrawChips(userId: string | undefined, chipsAmount: number): Promise<{ message: string; wallet: Wallet }> {
  const payload = userId ? { userId, chipsAmount } : { chipsAmount };
  const res = await apiFetch(`${BASE_URL}/wallet/withdraw`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
