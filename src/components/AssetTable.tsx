import React, { useState, useMemo } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { StatusBadge } from './StatusBadge';
import {
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles,
  Barcode,
  ExternalLink,
  ChevronDown,
  Trash2,
  CheckSquare,
} from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelectAsset: (asset: Asset) => void;
  onStatusChange: (assetId: string, newStatus: AssetStatus) => void;
  onBulkStatusChange: (assetIds: string[], newStatus: AssetStatus) => void;
  onDeleteAssets: (assetIds: string[]) => void;
  onOpenBarcode: (asset: Asset) => void;
  searchFilter: string;
}

type SortField = 'id' | 'name' | 'location' | 'status' | 'lastPing' | 'lastAudit';
type SortOrder = 'asc' | 'desc';

const CATEGORIES: ('Todos' | AssetCategory)[] = [
  'Todos',
  'POS Terminals',
  'Racks & Switches',
  'Key Encoders',
  'Access Points',
  'IoT / Signage',
  'Servidores & PBX',
];

const STATUS_FILTERS: ('Todos' | AssetStatus)[] = [
  'Todos',
  'Asignado',
  'En almacén',
  'Mantenimiento',
];

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onStatusChange,
  onBulkStatusChange,
  onDeleteAssets,
  onOpenBarcode,
  searchFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | AssetCategory>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | AssetStatus>('Todos');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filtered and sorted assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Category filter
      if (selectedCategory !== 'Todos' && asset.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'Todos' && asset.status !== selectedStatus) {
        return false;
      }
      // Search filter
      if (searchFilter.trim() !== '') {
        const query = searchFilter.toLowerCase().trim();
        const matchesQuery =
          asset.id.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query) ||
          asset.model.toLowerCase().includes(query) ||
          asset.manufacturer.toLowerCase().includes(query) ||
          asset.serialNumber.toLowerCase().includes(query) ||
          asset.macAddress.toLowerCase().includes(query) ||
          asset.ipAddress.toLowerCase().includes(query) ||
          asset.location.toLowerCase().includes(query) ||
          asset.rackPosition.toLowerCase().includes(query) ||
          asset.status.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, selectedCategory, selectedStatus, searchFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAssets.map((a) => a.id)));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkStatus = (status: AssetStatus) => {
    if (selectedIds.size === 0) return;
    onBulkStatusChange(Array.from(selectedIds), status);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`¿Confirmar desmantelamiento de ${selectedIds.size} activos de la base operativa?`)) {
      onDeleteAssets(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F141C] border border-[#222B38] mx-4 mb-4 select-none">
      {/* Table Toolbar & Filters */}
      <div className="bg-[#161C26] border-b border-[#222B38] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status Filter segmented control */}
          <div className="flex items-center border border-[#222B38] bg-[#090D12] p-0.5">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`text-[11px] font-mono uppercase px-2.5 py-1 transition-colors ${
                  selectedStatus === status
                    ? 'bg-[#161C26] text-[#F57200] border border-[#3E4C60] font-semibold'
                    : 'text-[#7E8B9E] hover:text-[#F0F4F8]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-[#090D12] border border-[#222B38] text-xs text-[#F0F4F8] py-1 px-2.5 pr-7 focus:border-[#F57200] focus:outline-none rounded-none cursor-pointer font-mono"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F141C] text-[#F0F4F8]">
                  {cat === 'Todos' ? 'Todas las Categorías' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#7E8B9E] absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Counter and Bulk Action Bar */}
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-1.5 bg-[#0A0E14] border border-[#F57200] px-2 py-0.5">
              <span className="text-[11px] font-mono text-[#F57200] font-semibold">
                {selectedIds.size} SELECCIONADOS
              </span>
              <span className="text-[#3E4C60]">|</span>
              <button
                onClick={() => handleBulkStatus('Asignado')}
                className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#161C26] text-[#34D399] hover:bg-[#10B981]/20 border border-[#10B981]/50"
              >
                Asignar
              </button>
              <button
                onClick={() => handleBulkStatus('En almacén')}
                className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#161C26] text-[#38BDF8] hover:bg-[#0284C7]/20 border border-[#0284C7]/50"
              >
                Almacén
              </button>
              <button
                onClick={() => handleBulkStatus('Mantenimiento')}
                className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#161C26] text-[#FF9838] hover:bg-[#F57200]/20 border border-[#F57200]/50"
              >
                Mantenimiento
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-[10px] uppercase font-mono px-1 py-0.5 text-[#F87171] hover:bg-[#DC2626]/20"
                title="Baja de inventario"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="text-[11px] font-mono text-[#7E8B9E]">
              MOSTRANDO <span className="text-[#F0F4F8] font-semibold">{filteredAssets.length}</span> DE{' '}
              <span className="text-[#F0F4F8]">{assets.length}</span> DISPOSITIVOS
            </div>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-[#161C26] sticky top-0 z-10 border-b border-[#222B38]">
            <tr>
              {/* Checkbox column */}
              <th className="w-8 py-2 px-3 text-center">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={`w-[14px] h-[14px] border border-[#3E4C60] flex items-center justify-center transition-colors ${
                    selectedIds.size === filteredAssets.length && filteredAssets.length > 0
                      ? 'bg-[#F57200] border-[#F57200]'
                      : 'bg-[#0F141C]'
                  }`}
                  aria-label="Seleccionar todos"
                >
                  {selectedIds.size === filteredAssets.length && filteredAssets.length > 0 && (
                    <div className="w-1.5 h-1.5 bg-[#090D12]" />
                  )}
                </button>
              </th>

              {/* Tag ID */}
              <th
                onClick={() => handleSort('id')}
                className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] cursor-pointer hover:text-[#F0F4F8]"
              >
                <div className="flex items-center gap-1">
                  <span>TAG ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Hardware / Name */}
              <th
                onClick={() => handleSort('name')}
                className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] cursor-pointer hover:text-[#F0F4F8]"
              >
                <div className="flex items-center gap-1">
                  <span>EQUIPO / MODELO</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Location & Rack */}
              <th
                onClick={() => handleSort('location')}
                className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] cursor-pointer hover:text-[#F0F4F8]"
              >
                <div className="flex items-center gap-1">
                  <span>UBICACIÓN / RACK</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* IP / MAC Address */}
              <th className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E]">
                IP / MAC ADDRESS
              </th>

              {/* Status */}
              <th
                onClick={() => handleSort('status')}
                className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] cursor-pointer hover:text-[#F0F4F8]"
              >
                <div className="flex items-center gap-1">
                  <span>ESTADO</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Ping Telemetry */}
              <th
                onClick={() => handleSort('lastPing')}
                className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] cursor-pointer hover:text-[#F0F4F8] text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PING</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Actions */}
              <th className="py-2 px-3 text-[11px] font-semibold font-mono uppercase tracking-[0.06em] text-[#7E8B9E] text-center w-20">
                ACCIONES
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#1C232E] text-xs">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#7E8B9E] font-mono">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-[#3E4C60]" />
                    <p className="text-sm text-[#F0F4F8]">No se encontraron activos con los filtros especificados.</p>
                    <p className="text-xs text-[#7E8B9E]">Modifique el término de búsqueda o restablezca las categorías.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const isChecked = selectedIds.has(asset.id);
                const isOffline = asset.lastPing === 'Timeout' || asset.lastPing === 'Offline';

                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className={`group relative cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#161C26] text-[#F0F4F8]'
                        : 'bg-[#0F141C] hover:bg-[#161C26]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-2 px-3 text-center"
                      onClick={(e) => toggleSelectOne(asset.id, e)}
                    >
                      {/* Left indicator mark on hover or active: 2px solid #F57200 */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${
                          isSelected
                            ? 'bg-[#F57200]'
                            : 'bg-transparent group-hover:bg-[#F57200]'
                        }`}
                      />
                      <div
                        className={`w-[14px] h-[14px] border border-[#3E4C60] flex items-center justify-center transition-colors mx-auto ${
                          isChecked ? 'bg-[#F57200] border-[#F57200]' : 'bg-[#0F141C]'
                        }`}
                      >
                        {isChecked && <div className="w-1.5 h-1.5 bg-[#090D12]" />}
                      </div>
                    </td>

                    {/* Tag ID */}
                    <td className="py-2 px-3 font-mono font-medium text-[#F0F4F8] whitespace-nowrap">
                      <span className="text-[#F57200] font-semibold">{asset.id}</span>
                      <div className="text-[10px] text-[#7E8B9E] uppercase tracking-wider">
                        {asset.category}
                      </div>
                    </td>

                    {/* Hardware Name & Model */}
                    <td className="py-2 px-3 max-w-[220px]">
                      <div className="font-medium text-[#F0F4F8] truncate">{asset.name}</div>
                      <div className="text-[11px] text-[#7E8B9E] font-mono truncate">
                        {asset.manufacturer} · {asset.model}
                      </div>
                    </td>

                    {/* Location & Rack Pos */}
                    <td className="py-2 px-3 max-w-[200px]">
                      <div className="text-[#F0F4F8] truncate">{asset.location}</div>
                      <div className="text-[11px] text-[#7E8B9E] font-mono truncate">
                        {asset.rackPosition}
                      </div>
                    </td>

                    {/* IP & MAC */}
                    <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">
                      <div className="text-[#00E5FF]">{asset.ipAddress}</div>
                      <div className="text-[#7E8B9E] text-[10px]">{asset.macAddress}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <StatusBadge status={asset.status} />
                    </td>

                    {/* Last Ping */}
                    <td className="py-2 px-3 font-mono text-right whitespace-nowrap">
                      <span
                        className={`inline-block tabular-nums font-semibold ${
                          isOffline
                            ? 'text-[#F87171]'
                            : asset.lastPing.includes('ms')
                            ? 'text-[#34D399]'
                            : 'text-[#7E8B9E]'
                        }`}
                      >
                        {asset.lastPing}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-2 px-3 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenBarcode(asset)}
                          title="Ver etiqueta técnica y código QR/Barras"
                          className="p-1 text-[#7E8B9E] hover:text-[#F57200] hover:bg-[#090D12] border border-transparent hover:border-[#3E4C60] transition-colors"
                        >
                          <Barcode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectAsset(asset)}
                          title="Inspeccionar telemetría completa"
                          className="p-1 text-[#7E8B9E] hover:text-[#00E5FF] hover:bg-[#090D12] border border-transparent hover:border-[#3E4C60] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
