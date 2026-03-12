'use client';

import { useState, useEffect } from 'react';

export interface AdminLog {
  id: string;
  idUsuario: string;
  categoria: string;
  descripcion: string;
  fecha: string;
  dinero?: number;
  fichas?: number;
}

export function useAdminHistory() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:3000/history/admin');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: AdminLog[] = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message ?? 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminHistory();
  }, []);

  const downloadCsv = async () => {
    try {
      const res = await fetch('http://localhost:3000/history/admin/export');
      if (!res.ok) throw new Error('No se pudo generar el CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'casino_historial.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error al descargar CSV:', err.message);
    }
  };

  return { logs, isLoading, error, downloadCsv };
}
