import { useState } from 'react';
import { Database, Coins, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulatorPanelProps {
  onSimulated: () => void;
}

export function SimulatorPanel({ onSimulated }: SimulatorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const triggerSimulation = async (endpoint: string, body: any, label: string) => {
    setLoading(true);
    setLastAction(label);
    try {
      await fetch(`http://localhost:3000/simulator/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setTimeout(() => {
        onSimulated();
        setLoading(false);
      }, 500);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 border rounded-md bg-card">
      {/* Header strip */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            Panel de Simulación (Demo)
          </span>
        </div>
        {loading && lastAction && (
          <span className="text-[10px] text-amber-700 animate-pulse">Ejecutando: {lastAction}...</span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground mb-4 max-w-lg">
          Genera transacciones simuladas para demostrar el funcionamiento y estilo visual interactivo.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => triggerSimulation(
              'deposito',
              { id_usuario: `Demo_${Math.floor(Math.random() * 100)}`, cantidad: 500 },
              'Depósito'
            )}
            className="w-full sm:w-auto"
          >
            <Database className="w-4 h-4 mr-2" />
            Depósito +$500
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerSimulation(
              'conversion',
              { id_usuario: `Demo_${Math.floor(Math.random() * 100)}`, cantidad: 500 },
              'Conversión'
            )}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Coins className="w-4 h-4 mr-2" />
            Convertir fichas
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerSimulation(
              'juego',
              {
                id_usuario: `Demo_${Math.floor(Math.random() * 100)}`,
                nombre_juego: 'Ruleta',
                apuesta: 100,
                resuelto: true,
                ganancia: Math.random() > 0.5 ? 200 : 0,
              },
              'Ruleta'
            )}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Jugar Ruleta (±)
          </Button>
        </div>
      </div>
    </div>
  );
}