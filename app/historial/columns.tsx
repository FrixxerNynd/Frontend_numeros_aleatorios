"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HistorialRecord } from "@/lib/hooks/useHistory"
import { ArrowDownRight, ArrowUpRight, Gamepad2, Landmark, RefreshCcw } from 'lucide-react';

const CATEGORY_ICONS = {
  Juego: Gamepad2,
  Deposito: Landmark,
  Convercion: RefreshCcw,
};

export const columns: ColumnDef<HistorialRecord>[] = [
  {
    accessorKey: "categoria",
    header: "Categoría",
    cell: ({ row }) => {
      const record = row.original;
      const Icon = CATEGORY_ICONS[record.categoria as keyof typeof CATEGORY_ICONS] ?? Gamepad2;
      const displayCategory = record.categoria === 'Convercion' ? 'Conversión' : record.categoria;

      return (
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <span className="font-medium">
            {displayCategory}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="max-w-[200px] sm:max-w-xs xl:max-w-md truncate">
          <span className="text-muted-foreground">{record.descripcion}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "idUsuario",
    header: "Usuario",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <span className="font-mono text-muted-foreground">
          {record.idUsuario.slice(0, 10)}
        </span>
      )
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const record = row.original;
      const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(record.fecha));

      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {formattedDate}
        </span>
      )
    },
  },
  {
    id: "impacto",
    header: () => <div className="text-right">Impacto</div>,
    cell: ({ row }) => {
      const record = row.original;
      
      return (
        <div className="flex flex-col items-end gap-1">
          {record.dinero !== null && record.dinero !== undefined && (
            <span className="font-medium">
              {record.dinero > 0 ? '+' : record.dinero < 0 ? '-' : ''}
              ${Math.abs(record.dinero).toFixed(2)}
            </span>
          )}
          {record.fichas !== null && record.fichas !== undefined && (
            <span className="text-xs text-muted-foreground">
              {record.fichas > 0 ? '+' : record.fichas < 0 ? '-' : ''}
              {Math.abs(record.fichas)} fichas
            </span>
          )}
        </div>
      )
    },
  },
]
