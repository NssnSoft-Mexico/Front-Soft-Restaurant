import React, { useState } from 'react';
import { StockItem } from '../types/asset';
import {
  Archive,
  Package,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  DollarSign,
  TrendingDown,
} from 'lucide-react';

interface StockroomLedgerProps {
  stockItems: StockItem[];
  onUpdateQuantity: (sku: string, delta: number) => void;
}

export const StockroomLedger: React.FC<StockroomLedgerProps> = ({
  stockItems,
  onUpdateQuantity,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  const totalValue = stockItems.reduce((acc, item) => acc + item.quantityOnHand * item.unitCostUsd, 0);
  const lowStockCount = stockItems.filter((i) => i.quantityOnHand <= i.minThreshold).length;

  const filteredItems = stockItems.filter((item) => {
    if (filterCategory !== 'Todas' && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F141C] border border-[#222B38] mx-4 mb-4 select-none">
      {/* Header & Metrics */}
      <div className="bg-[#161C26] border-b border-[#222B38] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <Archive className="w-4 h-4 text-[#F57200]" />
          <div>
            <span className="text-xs font-semibold text-[#F0F4F8] font-mono">
              REGISTRO DE ALMACÉN & REPUESTOS DE HOT-SWAP
            </span>
            <span className="text-[10px] text-[#7E8B9E] font-mono ml-2">
              (Inventario de reserva para contingencias operativas)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="text-[#7E8B9E]">
            VALOR EN BODEGA:{' '}
            <span className="text-[#34D399] font-semibold tabular-nums">
              ${totalValue.toLocaleString()} USD
            </span>
          </div>
          {lowStockCount > 0 && (
            <div className="px-2 py-0.5 border border-[#F57200] bg-[rgba(245,114,0,0.15)] text-[#FF9838] flex items-center gap-1 text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              <span>{lowStockCount} ÍTEMS BAJO MÍNIMO</span>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#161C26] sticky top-0 z-10 border-b border-[#222B38] text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E]">
            <tr>
              <th className="py-2 px-3">CÓDIGO SKU</th>
              <th className="py-2 px-3">DESCRIPCIÓN DEL REPUESTO</th>
              <th className="py-2 px-3">CATEGORÍA</th>
              <th className="py-2 px-3">UBICACIÓN BODEGA</th>
              <th className="py-2 px-3 text-right">COSTO UNIT.</th>
              <th className="py-2 px-3 text-center">STOCK / MÍNIMO</th>
              <th className="py-2 px-3 text-center">ESTADO</th>
              <th className="py-2 px-3 text-center w-28">AJUSTE RÁPIDO</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1C232E] text-xs">
            {filteredItems.map((item) => {
              const isLow = item.quantityOnHand <= item.minThreshold && item.quantityOnHand > 0;
              const isOut = item.quantityOnHand === 0;

              return (
                <tr
                  key={item.sku}
                  className="bg-[#0F141C] hover:bg-[#161C26] transition-colors"
                >
                  <td className="py-2 px-3 font-mono text-[#F57200] font-semibold whitespace-nowrap">
                    {item.sku}
                  </td>
                  <td className="py-2 px-3 font-medium text-[#F0F4F8]">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-[#7E8B9E] font-mono">
                      Proveedor: {item.supplier}
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono text-[#7E8B9E] whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-2 px-3 font-mono text-[#00E5FF] whitespace-nowrap">
                    {item.binLocation}
                  </td>
                  <td className="py-2 px-3 font-mono text-right text-[#F0F4F8] tabular-nums whitespace-nowrap">
                    ${item.unitCostUsd} USD
                  </td>
                  <td className="py-2 px-3 font-mono text-center tabular-nums whitespace-nowrap">
                    <span
                      className={`text-sm font-bold ${
                        isOut
                          ? 'text-[#F87171]'
                          : isLow
                          ? 'text-[#FF9838]'
                          : 'text-[#34D399]'
                      }`}
                    >
                      {item.quantityOnHand}
                    </span>
                    <span className="text-[#7E8B9E] text-[10px] ml-1">
                      (Mín: {item.minThreshold})
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] uppercase font-mono px-2 py-0.5 border font-semibold ${
                        isOut
                          ? 'border-[#DC2626] bg-[rgba(220,38,38,0.15)] text-[#F87171]'
                          : isLow
                          ? 'border-[#F57200] bg-[rgba(245,114,0,0.15)] text-[#FF9838]'
                          : 'border-[#10B981] bg-[rgba(16,185,129,0.12)] text-[#34D399]'
                      }`}
                    >
                      {isOut ? 'Agotado' : isLow ? 'Stock Bajo' : 'Óptimo'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 font-mono">
                      <button
                        onClick={() => onUpdateQuantity(item.sku, -1)}
                        disabled={item.quantityOnHand <= 0}
                        title="Despachar 1 unidad para reemplazo"
                        className="w-6 h-6 flex items-center justify-center bg-[#161C26] border border-[#3E4C60] hover:border-[#F57200] text-[#7E8B9E] hover:text-[#F0F4F8] disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onUpdateQuantity(item.sku, 1)}
                        title="Ingresar 1 unidad por recepción de proveedor"
                        className="w-6 h-6 flex items-center justify-center bg-[#161C26] border border-[#3E4C60] hover:border-[#F57200] text-[#7E8B9E] hover:text-[#F0F4F8]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
