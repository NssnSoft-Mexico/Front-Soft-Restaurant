import React from 'react';
import { AssetStatus } from '../types/asset';

interface StatusBadgeProps {
  status: AssetStatus | 'Operativo' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isMaintenance = status === 'Mantenimiento';
  const isEnAlmacen = status === 'En almacén';
  const isAsignadoOrOperativo = status === 'Asignado' || status === 'Operativo';

  let borderBgClass = 'border-[#222B38] bg-[#161C26] text-[#7E8B9E]';

  if (isAsignadoOrOperativo) {
    borderBgClass = 'border-[#10B981] bg-[rgba(16,185,129,0.12)] text-[#34D399]';
  } else if (isEnAlmacen) {
    borderBgClass = 'border-[#0284C7] bg-[rgba(2,132,199,0.12)] text-[#38BDF8]';
  } else if (isMaintenance) {
    borderBgClass = 'border-[#F57200] bg-[rgba(245,114,0,0.15)] text-[#FF9838]';
  }

  const heightClass = size === 'sm' ? 'h-[18px] text-[10px] px-1.5' : 'h-[22px] text-[11px] px-2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none font-semibold uppercase tracking-[0.06em] border tabular-nums shrink-0 select-none ${heightClass} ${borderBgClass}`}
    >
      {isMaintenance && (
        <span className="w-1 h-1 bg-[#F57200] shrink-0" aria-hidden="true" />
      )}
      {isAsignadoOrOperativo && (
        <span className="w-1 h-1 bg-[#10B981] shrink-0" aria-hidden="true" />
      )}
      {isEnAlmacen && (
        <span className="w-1 h-1 bg-[#0284C7] shrink-0" aria-hidden="true" />
      )}
      <span className="truncate">{status}</span>
    </span>
  );
};
