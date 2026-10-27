import React, { useState } from 'react';
import { RackUnit, Asset } from '../types/asset';
import { StatusBadge } from './StatusBadge';
import {
  Server,
  Zap,
  Thermometer,
  ShieldAlert,
  HardDrive,
  Cpu,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface RackExplorerProps {
  rackUnits: RackUnit[];
  assets: Asset[];
  onSelectAssetById: (assetId: string) => void;
}

const RACK_LOCATIONS = [
  { id: 'MDF-01', name: 'MDF Central - Datacenter Subsuelo (Rack R01)', temp: '21.8°C', power: '5.2 kW', load: '76%' },
  { id: 'IDF-01', name: 'IDF-01 - Conmutador Planta Baja & Lobby', temp: '23.1°C', power: '2.1 kW', load: '58%' },
  { id: 'IDF-02', name: 'IDF-02 - Distribuidor Piso 2 F&B y Cocina', temp: '24.5°C', power: '1.8 kW', load: '64%' },
  { id: 'IDF-03', name: 'IDF-03 - Torre Poniente Habitaciones', temp: '22.0°C', power: '2.9 kW', load: '82%' },
];

export const RackExplorer: React.FC<RackExplorerProps> = ({
  rackUnits,
  assets,
  onSelectAssetById,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(RACK_LOCATIONS[0].id);
  const [activeUnit, setActiveUnit] = useState<RackUnit | null>(rackUnits.find((u) => u.assetId) || null);

  const selectedLocData = RACK_LOCATIONS.find((l) => l.id === selectedLocation) || RACK_LOCATIONS[0];

  const totalOccupiedU = rackUnits.filter((u) => u.type !== 'empty').reduce((acc, u) => acc + u.sizeU, 0);

  const getUnitColor = (unit: RackUnit) => {
    if (unit.type === 'empty') return 'border-[#1C232E] bg-[#0A0E14] text-[#3E4C60]';
    if (unit.status === 'Mantenimiento') return 'border-[#F57200] bg-[rgba(245,114,0,0.12)] text-[#FF9838]';
    if (unit.type === 'switch') return 'border-[#2F3B4D] bg-[#161C26] text-[#F0F4F8] hover:border-[#00E5FF]';
    if (unit.type === 'server') return 'border-[#3E4C60] bg-[#161C26] text-[#cebff3] hover:border-[#F57200]';
    if (unit.type === 'ups') return 'border-[#2F3B4D] bg-[#11161F] text-[#38BDF8]';
    if (unit.type === 'pdu') return 'border-[#222B38] bg-[#0C1017] text-[#7E8B9E]';
    return 'border-[#222B38] bg-[#161C26] text-[#7E8B9E]';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F141C] border border-[#222B38] mx-4 mb-4 select-none">
      {/* Rack Header & Switcher */}
      <div className="bg-[#161C26] border-b border-[#222B38] p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-[#F57200]" />
          <div>
            <div className="text-xs font-semibold text-[#F0F4F8] flex items-center gap-2">
              <span>EXPLORADOR DE ARMARIOS 42U</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#3E4C60] bg-[#090D12] text-[#00E5FF]">
                CHASSIS STANDARD EIA-310
              </span>
            </div>
            <div className="text-[11px] text-[#7E8B9E] font-mono">
              Visualización topológica de bahías, switches de borde y servidores core
            </div>
          </div>
        </div>

        {/* Location selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-[#7E8B9E]">Armario:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#090D12] border border-[#222B38] text-xs text-[#F0F4F8] py-1 px-2.5 focus:border-[#F57200] focus:outline-none rounded-none cursor-pointer font-mono"
          >
            {RACK_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-[#0F141C] text-[#F0F4F8]">
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Bar of Rack */}
      <div className="bg-[#0A0E14] border-b border-[#222B38] px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#F57200]" />
          <div>
            <span className="text-[10px] text-[#7E8B9E] block">OCUPACIÓN TOTAL</span>
            <span className="text-[#F0F4F8] font-semibold tabular-nums">{totalOccupiedU}/42 U ({Math.round((totalOccupiedU / 42) * 100)}%)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#00E5FF]" />
          <div>
            <span className="text-[10px] text-[#7E8B9E] block">TEMP. RETORNO TÉRMICO</span>
            <span className="text-[#00E5FF] font-semibold tabular-nums">{selectedLocData.temp}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <span className="text-[10px] text-[#7E8B9E] block">CONSUMO ACTIVO AC</span>
            <span className="text-[#F0F4F8] font-semibold tabular-nums">{selectedLocData.power}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#34D399]" />
          <div>
            <span className="text-[10px] text-[#7E8B9E] block">ALIMENTACIÓN REDUNDANTE</span>
            <span className="text-[#34D399] font-semibold">FEED A+B ACTIVO</span>
          </div>
        </div>
      </div>

      {/* Main split: 42U Visual Chassis on left, Unit Inspector on right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left: 42U Vertical Chassis */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#090D12]/70 flex justify-center">
          <div className="w-full max-w-2xl bg-[#0F141C] border-2 border-[#222B38] p-2 flex flex-col gap-1 shadow-none">
            {/* Rack Crown */}
            <div className="bg-[#161C26] border border-[#222B38] px-3 py-1 flex items-center justify-between text-[10px] font-mono text-[#7E8B9E]">
              <span>RACK-01 · 42U ENCLOSURE</span>
              <span className="text-[#34D399]">STATUS: NOMINAL</span>
            </div>

            {/* 42U Units List */}
            <div className="flex flex-col gap-0.5">
              {rackUnits.map((unit) => {
                const isSelected = activeUnit?.uNumber === unit.uNumber;
                const isEmpty = unit.type === 'empty';

                return (
                  <div
                    key={unit.uNumber}
                    onClick={() => setActiveUnit(unit)}
                    className={`flex items-stretch border transition-all cursor-pointer ${getUnitColor(
                      unit
                    )} ${
                      isSelected
                        ? 'ring-1 ring-[#F57200] border-[#F57200]'
                        : ''
                    } ${
                      unit.sizeU > 1 ? `min-h-[${unit.sizeU * 24}px]` : 'h-7'
                    }`}
                  >
                    {/* U Position label */}
                    <div className="w-8 bg-[#090D12] border-r border-[#222B38] flex items-center justify-center font-mono text-[10px] text-[#7E8B9E] select-none shrink-0 font-bold">
                      U{unit.uNumber < 10 ? `0${unit.uNumber}` : unit.uNumber}
                    </div>

                    {/* Unit Content */}
                    <div className="flex-1 px-3 py-1 flex items-center justify-between overflow-hidden">
                      <div className="flex items-center gap-2 truncate">
                        {/* Status LED */}
                        <div
                          className={`w-1.5 h-1.5 shrink-0 ${
                            unit.status === 'Mantenimiento'
                              ? 'bg-[#F57200]'
                              : unit.status === 'Operativo'
                              ? 'bg-[#10B981]'
                              : 'bg-[#3E4C60]'
                          }`}
                        />
                        <span className="text-xs font-mono font-medium truncate">
                          {unit.deviceName || (isEmpty ? '--- Bahía Disponible ---' : unit.type.toUpperCase())}
                        </span>
                        {unit.model && (
                          <span className="text-[10px] text-[#7E8B9E] font-mono hidden sm:inline truncate">
                            ({unit.model})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[10px] shrink-0 text-[#7E8B9E]">
                        {unit.ip && (
                          <span className="text-[#00E5FF] hidden md:inline">{unit.ip}</span>
                        )}
                        {unit.tempCelsius && (
                          <span className="hidden sm:inline">{unit.tempCelsius}°C</span>
                        )}
                        {unit.powerWatts && (
                          <span className="hidden sm:inline">{unit.powerWatts}W</span>
                        )}
                        <span className="text-[9px] uppercase px-1 border border-[#3E4C60]">
                          {unit.sizeU}U
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rack Base Plinth */}
            <div className="bg-[#161C26] border border-[#222B38] px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-[#7E8B9E]">
              <span>TIERRA FÍSICA: CONECTADA (&lt; 2 OHMS)</span>
              <span>PATAS NIVELADORAS BLOQUEADAS</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Unit Technical Inspector */}
        <div className="w-full lg:w-[360px] bg-[#0F141C] border-t lg:border-t-0 lg:border-l border-[#222B38] p-4 flex flex-col justify-between overflow-y-auto">
          {activeUnit && activeUnit.type !== 'empty' ? (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B9E] mb-1">
                  DETALLE DE BAHÍA RACK U{activeUnit.uNumber}
                </div>
                <h3 className="text-sm font-semibold text-[#F0F4F8] leading-tight">
                  {activeUnit.deviceName}
                </h3>
                <div className="text-xs text-[#7E8B9E] font-mono mt-0.5">
                  {activeUnit.model || 'Dispositivo de Infraestructura'}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#222B38] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7E8B9E]">ESTADO OPERATIVO</span>
                  <StatusBadge status={activeUnit.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#7E8B9E]">DIRECCIÓN IP</span>
                  <span className="text-[#00E5FF] font-medium">{activeUnit.ip || 'No asignada'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#7E8B9E]">TAMAÑO EN RACK</span>
                  <span className="text-[#F0F4F8]">{activeUnit.sizeU}U Estándar</span>
                </div>
                {activeUnit.portsTotal && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7E8B9E]">PUERTOS UTILIZADOS</span>
                    <span className="text-[#34D399] font-medium">
                      {activeUnit.portsUsed} / {activeUnit.portsTotal} ({Math.round(((activeUnit.portsUsed || 0) / activeUnit.portsTotal) * 100)}%)
                    </span>
                  </div>
                )}
                {activeUnit.tempCelsius && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7E8B9E]">TEMPERATURA NÚCLEO</span>
                    <span className="text-[#F0F4F8]">{activeUnit.tempCelsius}°C</span>
                  </div>
                )}
                {activeUnit.powerWatts && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7E8B9E]">CARGA ELÉCTRICA</span>
                    <span className="text-[#F0F4F8]">{activeUnit.powerWatts} Watts</span>
                  </div>
                )}
              </div>

              {activeUnit.assetId && (
                <div className="bg-[#161C26] border border-[#2F3B4D] p-3 space-y-2">
                  <div className="text-[10px] font-mono text-[#7E8B9E] uppercase">
                    VINCULADO A ACTIVO GLOBAL
                  </div>
                  <div className="text-xs font-mono font-bold text-[#F57200]">
                    {activeUnit.assetId}
                  </div>
                  <button
                    onClick={() => activeUnit.assetId && onSelectAssetById(activeUnit.assetId)}
                    className="w-full mt-2 py-1.5 px-3 bg-[#F57200] text-[#090D12] text-xs font-semibold hover:bg-[#D96500] flex items-center justify-center gap-1.5 font-mono uppercase tracking-wider"
                  >
                    <span>Inspeccionar en Flota</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-[#7E8B9E] font-mono space-y-2">
              <HardDrive className="w-8 h-8 text-[#3E4C60] mx-auto" />
              <p className="text-xs text-[#F0F4F8]">Bahía Vacía U{activeUnit?.uNumber || '---'}</p>
              <p className="text-[11px]">Espacio disponible para expansión de switches o servidores blade.</p>
            </div>
          )}

          <div className="text-[10px] text-[#7E8B9E] font-mono border-t border-[#222B38] pt-3">
            ÚLTIMA TELEMETRÍA ICMP: HACE 12 SEGUNDOS
          </div>
        </div>
      </div>
    </div>
  );
};
