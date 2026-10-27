import React, { useRef } from 'react';
import { Asset } from '../types/asset';
import { X, Printer, Download, QrCode } from 'lucide-react';

interface BarcodeModalProps {
  asset: Asset | null;
  property: string;
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  asset,
  property,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!asset) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate stylized deterministic barcode pattern from asset ID + serial
  const barcodeBars = [
    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4,
    1, 2, 3, 4, 1, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1A222E] border border-[#3E4C60] shadow-none">
        {/* Header */}
        <div className="bg-[#161C26] border-b border-[#3E4C60] p-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#F0F4F8] font-mono uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#F57200]" />
            <span>Etiqueta Técnica de Activo Físico</span>
          </span>
          <button
            onClick={onClose}
            className="text-[#7E8B9E] hover:text-[#F0F4F8] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sticker Preview Area */}
        <div className="p-6 bg-[#090D12] flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[380px] bg-white text-black p-4 border-2 border-black font-mono select-none"
            style={{ fontFamily: 'Geist Mono, monospace' }}
          >
            {/* Header */}
            <div className="border-b-2 border-black pb-2 mb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-tight uppercase">
                  {property.toUpperCase()}
                </div>
                <div className="text-[8px] text-neutral-600 font-bold uppercase">
                  DEPARTAMENTO DE TECNOLOGÍA & REDES
                </div>
              </div>
              <div className="text-[10px] font-black border border-black px-1.5 py-0.5">
                TI-OPS
              </div>
            </div>

            {/* Asset ID Giant */}
            <div className="my-2 text-center">
              <div className="text-2xl font-black tracking-widest leading-none">
                {asset.id}
              </div>
              <div className="text-[10px] text-neutral-700 tracking-wider mt-0.5 font-bold">
                {asset.category.toUpperCase()}
              </div>
            </div>

            {/* Simulated Code 128 Barcode */}
            <div className="bg-neutral-50 p-2 my-2 border border-black/30 flex flex-col items-center">
              <div className="h-12 w-full flex items-stretch justify-center gap-[2px]">
                {barcodeBars.map((width, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${
                      idx % 2 === 0 ? 'bg-black' : 'bg-transparent'
                    }`}
                    style={{ width: `${width * 1.5}px` }}
                  />
                ))}
              </div>
              <div className="text-[9px] tracking-[0.25em] font-bold mt-1">
                *{asset.id.replace(/-/g, '')}*
              </div>
            </div>

            {/* Details Grid */}
            <div className="text-[9px] grid grid-cols-2 gap-x-2 gap-y-1 border-t border-black pt-2 leading-tight">
              <div>
                <span className="font-bold">MODELO:</span> {asset.model}
              </div>
              <div>
                <span className="font-bold">SERIAL:</span> {asset.serialNumber}
              </div>
              <div>
                <span className="font-bold">MAC:</span> {asset.macAddress}
              </div>
              <div>
                <span className="font-bold">IP FIJA:</span> {asset.ipAddress}
              </div>
              <div className="col-span-2">
                <span className="font-bold">UBICACIÓN:</span> {asset.location}
              </div>
            </div>

            {/* Warning strip */}
            <div className="mt-3 pt-1 border-t-2 border-dashed border-black text-center text-[7px] font-black tracking-wider uppercase">
              PROPIEDAD EXCLUSIVA DEL RESORT — NO RETIRAR ESTA IDENTIFICACIÓN
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#161C26] border-t border-[#3E4C60] p-3 flex items-center justify-between font-mono text-xs">
          <span className="text-[10px] text-[#7E8B9E]">
            FORMATO ETIQUETADORA ZEBRA ZD421 (100x50mm)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#161C26] text-[#F0F4F8] border border-[#3E4C60] hover:bg-[#222B38] text-[11px] uppercase"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#F57200] text-[#090D12] font-bold text-[11px] hover:bg-[#D96500] flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Etiqueta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
