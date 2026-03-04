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
      const queryParams = new URLSearchParams();
      
      if (filters?.Categoria) queryParams.append('Categoria', filters.Categoria);
      if (filters?.Fecha_inicial) queryParams.append('Fecha_inicial', filters.Fecha_inicial);
      if (filters?.Fecha_final) queryParams.append('Fecha_final', filters.Fecha_final);
      if (filters?.Usuario) queryParams.append('Usuario', filters.Usuario);

      // Si el backend sigue corriendo en el puerto 3000
      const url = `http://localhost:3000/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener el historial');
      }

      const data: HistorialRecord[] = await response.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { history, isLoading, error, fetchHistory };
}
