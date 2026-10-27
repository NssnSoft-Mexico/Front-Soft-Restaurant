import React from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Box, Wifi } from 'lucide-react';

interface KpiMetricsProps {
  totalAssets: number;
  inStock: number;
  maintenanceAlerts: number;
  pingRate: number;
  onFilterByStatus?: (status: string) => void;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  totalAssets,
  inStock,
  maintenanceAlerts,
  pingRate,
  onFilterByStatus,
}) => {
  const cards = [
    {
      title: 'TOTAL FLOTA ACTIVA',
      value: totalAssets.toLocaleString(),
      subtext: '+12 ESTE MES · DESPLIEGUE CONTINUO',
      delta: '+0.9%',
      isPositive: true,
      stripeColor: 'bg-[#4B3F6B]',
      icon: CheckCircle2,
      iconColor: 'text-[#cebff3]',
      filterStatus: 'Asignado',
    },
    {
      title: 'EN ALMACÉN / RESERVA',
      value: inStock.toLocaleString(),
      subtext: 'DISPONIBILIDAD PARA HOT-SWAP',
      delta: 'NOMINAL',
      isPositive: true,
      stripeColor: 'bg-[#0284C7]',
      icon: Box,
      iconColor: 'text-[#38BDF8]',
      filterStatus: 'En almacén',
    },
    {
      title: 'MANTENIMIENTO CRÍTICO',
      value: maintenanceAlerts.toString(),
      subtext: '4 TICKETS SLA < 2H RESTANTES',
      delta: maintenanceAlerts > 0 ? '+2 ALERTAS' : '0 PENDIENTES',
      isPositive: maintenanceAlerts === 0,
      stripeColor: 'bg-[#F57200]',
      icon: AlertTriangle,
      iconColor: 'text-[#FF9838]',
      filterStatus: 'Mantenimiento',
    },
    {
      title: 'TELEMETRÍA RED / PING',
      value: `${pingRate}%`,
      subtext: 'LATENCIA MEDIA: 2.8ms EN CORE',
      delta: 'NOMINAL',
      isPositive: true,
      stripeColor: 'bg-[#00E5FF]',
      icon: Wifi,
      iconColor: 'text-[#00E5FF]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 select-none shrink-0">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => card.filterStatus && onFilterByStatus?.(card.filterStatus)}
            className={`relative bg-[#0F141C] border border-[#222B38] p-4 flex flex-col justify-between transition-colors ${
              card.filterStatus ? 'cursor-pointer hover:border-[#2F3B4D]' : ''
            }`}
          >
            {/* Top 2px accent stripe */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${card.stripeColor}`} />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#7E8B9E]">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-[#F0F4F8] tabular-nums font-mono leading-none">
                {card.value}
              </div>
              <div
                className={`text-[11px] font-mono flex items-center gap-0.5 ${
                  card.isPositive ? 'text-[#34D399]' : 'text-[#F87171]'
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{card.delta}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#7E8B9E] font-mono tracking-wider truncate border-t border-[#222B38]/60 pt-2">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
