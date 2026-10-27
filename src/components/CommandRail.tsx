import React from 'react';
import {
  Server,
  Layers,
  Wrench,
  Compass,
  Archive,
  ChevronLeft,
  ChevronRight,
  Building2,
  Cpu,
  Radio,
  UserCheck,
} from 'lucide-react';

export type ActiveView = 'assets' | 'racks' | 'maintenance' | 'zones' | 'stockroom';

interface CommandRailProps {
  currentView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeProperty: string;
  onPropertyChange: (property: string) => void;
  assetCount: number;
  maintenanceCount: number;
}

const PROPERTIES = [
  'Grand Miramar Resort & Spa',
  'Metropolitan Hotel Tower',
  'Pacific Ocean Villas & Marina',
];

export const CommandRail: React.FC<CommandRailProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  activeProperty,
  onPropertyChange,
  assetCount,
  maintenanceCount,
}) => {
  const navItems = [
    {
      id: 'assets' as ActiveView,
      label: 'Flota de Activos',
      sublabel: 'Hardware & Terminales',
      icon: Server,
      badge: assetCount.toString(),
    },
    {
      id: 'racks' as ActiveView,
      label: 'Armarios & Racks 42U',
      sublabel: 'MDF / IDF Closets',
      icon: Layers,
    },
    {
      id: 'maintenance' as ActiveView,
      label: 'Órdenes & Tickets',
      sublabel: 'SLA y Reparaciones',
      icon: Wrench,
      badge: maintenanceCount > 0 ? maintenanceCount.toString() : undefined,
      alert: maintenanceCount > 0,
    },
    {
      id: 'zones' as ActiveView,
      label: 'Topología de Zonas',
      sublabel: 'Pisos y Áreas F&B',
      icon: Compass,
    },
    {
      id: 'stockroom' as ActiveView,
      label: 'Registro de Almacén',
      sublabel: 'Repuestos & Spares',
      icon: Archive,
    },
  ];

  return (
    <aside
      className={`h-screen bg-[#0F141C] border-r border-[#222B38] flex flex-col justify-between select-none transition-[width] duration-150 ease-out shrink-0 z-30 ${
        isCollapsed ? 'w-[64px]' : 'w-[260px]'
      }`}
    >
      {/* Brand & Property Selector */}
      <div className="flex flex-col border-b border-[#222B38]">
        {/* Brand Header */}
        <div className="h-14 px-3 flex items-center justify-between border-b border-[#222B38]/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 bg-[#161C26] border border-[#F57200] flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-[#F57200]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-semibold text-sm tracking-tight text-[#F0F4F8] truncate">
                  OPS CONSOLE
                </span>
                <span className="text-[10px] text-[#7E8B9E] tracking-wider uppercase font-mono">
                  HOSPITALITY IT INFRA
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expandir consola (260px)' : 'Colapsar consola'}
            className="w-7 h-7 flex items-center justify-center text-[#7E8B9E] hover:text-[#F0F4F8] hover:bg-[#161C26] border border-transparent hover:border-[#3E4C60] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Property Selector */}
        {!isCollapsed ? (
          <div className="p-3 bg-[#0A0E14] border-b border-[#222B38]/50">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B9E] mb-1 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-[#F57200]" />
              <span>Propiedad Activa</span>
            </div>
            <select
              value={activeProperty}
              onChange={(e) => onPropertyChange(e.target.value)}
              className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] py-1.5 px-2 focus:border-[#F57200] focus:outline-none rounded-none cursor-pointer"
            >
              {PROPERTIES.map((prop) => (
                <option key={prop} value={prop} className="bg-[#0F141C] text-[#F0F4F8]">
                  {prop}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div
            className="h-10 flex items-center justify-center border-b border-[#222B38]/50 cursor-pointer text-[#7E8B9E] hover:text-[#F57200]"
            title={`Propiedad activa: ${activeProperty}`}
          >
            <Building2 className="w-4 h-4 text-[#F57200]" />
          </div>
        )}
      </div>

      {/* Navigation Command Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.08em] text-[#7E8B9E]">
            Módulos de Control
          </div>
        )}

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center text-left transition-colors relative py-2 ${
                isCollapsed ? 'justify-center px-0' : 'px-2.5 gap-3'
              } ${
                isActive
                  ? 'bg-[#161C26] text-[#F0F4F8] border border-[#2F3B4D]'
                  : 'text-[#7E8B9E] hover:bg-[#161C26]/60 hover:text-[#F0F4F8] border border-transparent'
              }`}
            >
              {/* Active neon orange marker line */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#F57200]" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#F57200]' : 'text-[#7E8B9E]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#F0F4F8] truncate flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                          item.alert
                            ? 'bg-[rgba(245,114,0,0.15)] border-[#F57200] text-[#FF9838]'
                            : 'bg-[#090D12] border-[#222B38] text-[#7E8B9E]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#7E8B9E] truncate">
                    {item.sublabel}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operator & Telemetry Footer */}
      <div className="border-t border-[#222B38] bg-[#0A0E14] p-3 space-y-2">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#7E8B9E] border-b border-[#222B38]/60 pb-2">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#00E5FF]" />
                <span>IDF-02 Core Link</span>
              </span>
              <span className="text-[#34D399] font-medium">99.4% ONLINE</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 bg-[#161C26] border border-[#3E4C60] flex items-center justify-center shrink-0 text-[#F57200]">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-[#F0F4F8] truncate">
                  S. Rivera (Field Lead)
                </div>
                <div className="text-[10px] text-[#7E8B9E] font-mono truncate">
                  IP: 10.24.1.4 · Shift 01
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col items-center gap-2 text-[#7E8B9E]"
            title="S. Rivera (Field Lead) - 99.4% Online"
          >
            <Radio className="w-4 h-4 text-[#00E5FF]" />
          </div>
        )}
      </div>
    </aside>
  );
};
