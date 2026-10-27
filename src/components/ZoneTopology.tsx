import React, { useState } from 'react';
import { FacilityZone, Asset } from '../types/asset';
import {
  Compass,
  Wifi,
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ZoneTopologyProps {
  zones: FacilityZone[];
  assets: Asset[];
  onSelectZoneFilter: (zoneName: string) => void;
}

export const ZoneTopology: React.FC<ZoneTopologyProps> = ({
  zones,
  assets,
  onSelectZoneFilter,
}) => {
  const [activeZoneId, setActiveZoneId] = useState(zones[0].id);

  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];
  const assetsInZone = assets.filter((a) =>
    a.location.toLowerCase().includes(activeZone.name.toLowerCase().split(' ')[0].toLowerCase()) ||
    a.rackPosition.toLowerCase().includes(activeZone.floor.toLowerCase().split(' ')[0].toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F141C] border border-[#222B38] mx-4 mb-4 select-none">
      {/* Header */}
      <div className="bg-[#161C26] border-b border-[#222B38] px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Compass className="w-4 h-4 text-[#F57200]" />
          <div>
            <span className="text-xs font-semibold text-[#F0F4F8] font-mono">
              TOPOLOGÍA DE ZONAS Y SECTORES DE INFRAESTRUCTURA
            </span>
            <span className="text-[10px] text-[#7E8B9E] font-mono ml-2">
              (Distribución de red por áreas operativas)
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#34D399] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VLAN TRUNKING 802.1Q SINCRONIZADO</span>
        </div>
      </div>

      {/* Grid of Zones */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
        {zones.map((zone) => {
          const isSelected = activeZoneId === zone.id;
          const hasAlerts = zone.activeAlerts > 0;

          return (
            <div
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={`p-3 bg-[#090D12] border transition-colors cursor-pointer relative ${
                isSelected
                  ? 'border-[#F57200] bg-[#161C26]'
                  : 'border-[#222B38] hover:border-[#2F3B4D]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#F57200]" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#F0F4F8] truncate">
                  {zone.name}
                </span>
                <span className="text-[10px] font-mono text-[#7E8B9E] px-1.5 py-0.5 border border-[#222B38] bg-[#0F141C]">
                  {zone.floor}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#222B38]/60 my-2 font-mono text-center">
                <div>
                  <span className="text-[10px] text-[#7E8B9E] block">ACTIVOS</span>
                  <span className="text-sm font-semibold text-[#F0F4F8] tabular-nums">
                    {zone.totalAssets}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E8B9E] block">POS TOUCH</span>
                  <span className="text-sm font-semibold text-[#F57200] tabular-nums">
                    {zone.posTerminals}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E8B9E] block">WI-FI APs</span>
                  <span className="text-sm font-semibold text-[#00E5FF] tabular-nums">
                    {zone.accessPoints}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-[#7E8B9E]">
                  Salud:{' '}
                  <span
                    className={
                      zone.networkHealthPct >= 98
                        ? 'text-[#34D399]'
                        : 'text-[#FF9838]'
                    }
                  >
                    {zone.networkHealthPct}%
                  </span>
                </span>

                {hasAlerts ? (
                  <span className="text-[#FF9838] flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{zone.activeAlerts} Alerta</span>
                  </span>
                ) : (
                  <span className="text-[#34D399] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Nominal</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Detail Inspector */}
      <div className="flex-1 bg-[#090D12]/50 border-t border-[#222B38] p-4 flex flex-col justify-between overflow-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F0F4F8] font-mono">
                MATRIZ DE DISTRIBUCIÓN: {activeZone.name.toUpperCase()}
              </h3>
              <p className="text-xs text-[#7E8B9E] font-mono">
                Conmutadores de acceso asociados: {activeZone.switches} switches dedicados en topología estrella redundante
              </p>
            </div>

            <button
              onClick={() => onSelectZoneFilter(activeZone.name)}
              className="px-3 py-1.5 bg-[#F57200] text-[#090D12] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#D96500] font-mono uppercase tracking-wider"
            >
              <span>Ver Activos en Tabla</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#161C26] border border-[#222B38] p-3 space-y-1">
              <span className="text-[10px] text-[#7E8B9E] uppercase">VLAN NATIVA DE SERVICIO</span>
              <div className="text-sm font-semibold text-[#00E5FF]">VLAN 10 (Admin), VLAN 40 (POS)</div>
              <p className="text-[10px] text-[#7E8B9E]">Aislamiento L2 estricto contra tráfico de huéspedes.</p>
            </div>
            <div className="bg-[#161C26] border border-[#222B38] p-3 space-y-1">
              <span className="text-[10px] text-[#7E8B9E] uppercase">PRESUPUESTO POE ENTREGADO</span>
              <div className="text-sm font-semibold text-[#34D399]">1,420W / 2,200W (64% en uso)</div>
              <p className="text-[10px] text-[#7E8B9E]">Capacidad disponible para 18 APs o cámaras adicionales.</p>
            </div>
            <div className="bg-[#161C26] border border-[#222B38] p-3 space-y-1">
              <span className="text-[10px] text-[#7E8B9E] uppercase">ÚLTIMA AUDITORÍA FÍSICA</span>
              <div className="text-sm font-semibold text-[#F0F4F8]">{activeZone.lastInspection}</div>
              <p className="text-[10px] text-[#7E8B9E]">Responsable: S. Rivera (Lead Field Engineer).</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[#7E8B9E] font-mono border-t border-[#222B38] pt-3 mt-4">
          CABLEADO ESTRUCTURADO: CAT6A F/UTP 500MHZ CERTIFICADO FLUKE NETWORKS
        </div>
      </div>
    </div>
  );
};
