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
    
    try {
      const response = await fetch('http://localhost:3000/history/demo_user_123');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: HistorialRecord[] = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err instanceof Error ? err.message : 'Error desconocido de red');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { history, isLoading, error, fetchHistory };
}
