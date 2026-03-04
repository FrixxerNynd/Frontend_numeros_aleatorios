"use client";

import { useEffect, useState } from 'react';
import { useHistory, HistoryFilters } from '@/lib/hooks/useHistory';
import { FilterBar } from './components/FilterBar';
import { SimulatorPanel } from './components/SimulatorPanel';
import { Activity, Loader2, AlertCircle } from 'lucide-react';
import { DataTable } from './components/data-table';
import { columns } from './columns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function HistorialPage() {
  const { history, isLoading, error, fetchHistory } = useHistory();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchHistory(filters);
  const handleClear = () => { setFilters({}); fetchHistory({}); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative max-w-5xl mx-auto px-6 py-10 sm:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 border-b pb-6 mt-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Historial Operativo
            </h1>
            <p className="mt-2 text-muted-foreground">
              Registro inmutable de todas las transacciones.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSimulator(!showSimulator)}
            >
              {showSimulator ? 'Cerrar Demo' : 'Panel Demo'}
            </Button>
          </div>
        </div>

        {showSimulator && (
          <SimulatorPanel onSimulated={() => fetchHistory({})} />
        )}

        <FilterBar filters={filters} onChange={setFilters} onSearch={handleSearch} onClear={handleClear} />

        {/* Content Area */}
        <div className="mt-6 flex flex-col gap-4">

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de Conexión</AlertTitle>
              <AlertDescription>
                {error} — ¿Backend activo en puerto 3000?
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando registros...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 border rounded-md">
              <Activity className="w-8 h-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Sin registros en el historial.</p>
              <p className="text-muted-foreground text-xs">Usa el panel simulador para generar datos de prueba.</p>
            </div>
          ) : (
            <div>
              <DataTable columns={columns} data={history} />
            </div>
          )}
        </div>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Registro auditado · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}