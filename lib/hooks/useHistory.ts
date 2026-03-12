import { useState, useCallback } from 'react';

export interface HistorialRecord {
  id: string;
  idUsuario: string;
  categoria: 'Juego' | 'Deposito' | 'Convercion';
  descripcion: string;
  dinero?: number;
  fichas?: number;
  fecha: string;
}

export interface HistoryFilters {
  Categoria?: string;
  Fecha_inicial?: string;
  Fecha_final?: string;
  Usuario?: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistorialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (filters?: HistoryFilters) => {
    setIsLoading(true);
    setError(null);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockData: HistorialRecord[] = [
      {
        id: '1',
        idUsuario: 'user123',
        categoria: 'Juego',
        descripcion: 'Mega Gold Slots',
        dinero: 450.00,
        fecha: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      },
      {
        id: '2',
        idUsuario: 'user123',
        categoria: 'Juego',
        descripcion: 'Blackjack VIP',
        dinero: -200.00,
        fecha: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
      },
      {
        id: '3',
        idUsuario: 'user123',
        categoria: 'Juego',
        descripcion: 'Roulette Royale',
        dinero: 3600.00,
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '4',
        idUsuario: 'user123',
        categoria: 'Convercion',
        descripcion: 'Moneda a Fichas',
        dinero: -100.00,
        fichas: 1000,
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
      {
        id: '5',
        idUsuario: 'user123',
        categoria: 'Deposito',
        descripcion: 'Depósito Tarjeta',
        dinero: 500.00,
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      }
    ];

    setHistory(mockData);
    setIsLoading(false);
  }, []);

  return { history, isLoading, error, fetchHistory };
}
