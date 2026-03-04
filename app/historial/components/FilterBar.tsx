import { HistoryFilters } from '@/lib/hooks/useHistory';
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  filters: HistoryFilters;
  onChange: (f: HistoryFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

const inputClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block';

export function FilterBar({ filters, onChange, onSearch, onClear }: FilterBarProps) {
  return (
    <div className="border rounded-md bg-card p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">

        <div className="flex-1 min-w-[130px]">
          <label className={labelClass}>Categoría</label>
          <Select 
            value={filters.Categoria || ''} 
            onValueChange={(val) => onChange({ ...filters, Categoria: val === 'all' ? undefined : val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Juego">Juego</SelectItem>
              <SelectItem value="Deposito">Depósito</SelectItem>
              <SelectItem value="Convercion">Conversión</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className={labelClass}>Usuario (ID)</label>
          <input
            type="text"
            placeholder="Ej: Id_314264..."
            value={filters.Usuario || ''}
            onChange={(e) => onChange({ ...filters, Usuario: e.target.value || undefined })}
            className={inputClass}
          />
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className={labelClass}>Fecha inicial</label>
          <input
            type="date"
            value={filters.Fecha_inicial || ''}
            onChange={(e) => onChange({ ...filters, Fecha_inicial: e.target.value || undefined })}
            className={inputClass}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className={labelClass}>Fecha final</label>
          <input
            type="date"
            value={filters.Fecha_final || ''}
            onChange={(e) => onChange({ ...filters, Fecha_final: e.target.value || undefined })}
            className={inputClass}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button onClick={onSearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

      </div>
    </div>
  );
}