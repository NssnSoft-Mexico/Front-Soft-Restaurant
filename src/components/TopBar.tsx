import React from 'react';
import { Search, Plus, Download, Activity, RefreshCw } from 'lucide-react';
import { ActiveView } from './CommandRail';

interface TopBarProps {
  currentView: ActiveView;
  activeProperty: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilterTag: string | null;
  onFilterTagClick: (tag: string) => void;
  onOpenNewAssetModal: () => void;
  onExportCsv: () => void;
  onRunDiagnostics: () => void;
  isScanning: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  activeProperty,
  searchQuery,
  onSearchChange,
  activeFilterTag,
  onFilterTagClick,
  onOpenNewAssetModal,
  onExportCsv,
  onRunDiagnostics,
  isScanning,
}) => {
  const viewTitles: Record<ActiveView, string> = {
    assets: 'Flota de Activos',
    racks: 'Armarios & Racks 42U',
    maintenance: 'Órdenes de Mantenimiento',
    zones: 'Topología de Zonas',
    stockroom: 'Registro de Almacén',
  };

  const quickTags = ['POS', 'Cisco', 'Wi-Fi 6', 'Mantenimiento'];

  return (
    <header className="h-14 bg-[#0F141C] border-b border-[#222B38] px-4 flex items-center justify-between gap-4 select-none shrink-0 z-20">
      {/* Zone 1: Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs text-[#7E8B9E] min-w-0 shrink-0">
        <span className="font-semibold text-[#F0F4F8] truncate max-w-[150px] sm:max-w-[190px]">
          {activeProperty.split(' ')[0]} {activeProperty.split(' ')[1] || ''}
        </span>
        <span className="text-[#3E4C60]">/</span>
        <span className="text-[#7E8B9E] hidden md:inline">Operaciones TI</span>
        <span className="text-[#3E4C60] hidden md:inline">/</span>
        <span className="text-[#F57200] font-medium truncate">
          {viewTitles[currentView]}
        </span>
      </div>

      {/* Zone 2: Global Search with integrated quick-filter tags */}
      <div className="flex-1 max-w-xl mx-2 relative flex items-center">
        <div className="relative w-full flex items-center bg-[#090D12] border border-[#222B38] focus-within:border-[#F57200] px-2.5 py-1">
          <Search className="w-3.5 h-3.5 text-[#7E8B9E] shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Buscar por tag, serial, MAC, IP, modelo o ubicación..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-xs text-[#F0F4F8] placeholder-[#7E8B9E] font-mono focus:outline-none"
          />

          {/* Quick-filter tags inside search box */}
          <div className="hidden lg:flex items-center gap-1 ml-2 shrink-0">
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onFilterTagClick(tag)}
                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 border transition-colors ${
                  activeFilterTag === tag
                    ? 'bg-[#F57200] text-[#090D12] border-[#F57200] font-semibold'
                    : 'bg-[#161C26] text-[#7E8B9E] border-[#2F3B4D] hover:text-[#F0F4F8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Diagnostic Sweep */}
        <button
          onClick={onRunDiagnostics}
          disabled={isScanning}
          title="Ejecutar barrido de ping ICMP y telemetría de red"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#161C26] text-[#F0F4F8] border border-[#3E4C60] hover:border-[#F57200] text-xs transition-colors cursor-pointer"
        >
          {isScanning ? (
            <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
          )}
          <span className="font-mono text-[11px]">
            {isScanning ? 'PINGING...' : 'BARRIDO PING'}
          </span>
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCsv}
          title="Descargar manifiesto de hardware CSV"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#161C26] text-[#F0F4F8] border border-[#3E4C60] hover:border-[#F57200] text-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#7E8B9E]" />
          <span className="font-mono text-[11px]">CSV</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenNewAssetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F57200] text-[#090D12] font-semibold text-xs transition-colors hover:bg-[#D96500] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="uppercase tracking-wider text-[11px] font-mono">
            Nuevo Activo
          </span>
        </button>
      </div>
    </header>
  );
};
