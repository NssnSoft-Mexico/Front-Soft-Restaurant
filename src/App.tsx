/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CommandRail, ActiveView } from './components/CommandRail';
import { TopBar } from './components/TopBar';
import { KpiMetrics } from './components/KpiMetrics';
import { AssetTable } from './components/AssetTable';
import { RackExplorer } from './components/RackExplorer';
import { MaintenanceQueue } from './components/MaintenanceQueue';
import { ZoneTopology } from './components/ZoneTopology';
import { StockroomLedger } from './components/StockroomLedger';
import { AssetInspector } from './components/AssetInspector';
import { NewAssetModal } from './components/NewAssetModal';
import { BarcodeModal } from './components/BarcodeModal';
import {
  INITIAL_ASSETS,
  INITIAL_RACK_UNITS,
  INITIAL_WORK_ORDERS,
  INITIAL_ZONES,
  INITIAL_STOCKROOM,
} from './data/mockData';
import { Asset, AssetStatus, WorkOrder, StockItem } from './types/asset';

export default function App() {
  // Navigation & Property
  const [currentView, setCurrentView] = useState<ActiveView>('assets');
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);
  const [activeProperty, setActiveProperty] = useState('Grand Miramar Resort & Spa');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  // Core Data States
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [rackUnits, setRackUnits] = useState(INITIAL_RACK_UNITS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [zones] = useState(INITIAL_ZONES);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCKROOM);

  // Inspector & Modal States
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(INITIAL_ASSETS[0]);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [barcodeAsset, setBarcodeAsset] = useState<Asset | null>(null);

  // Live Telemetry Scanning State
  const [isScanning, setIsScanning] = useState(false);

  // Quick filter tag toggling
  const handleFilterTagClick = (tag: string) => {
    if (activeFilterTag === tag) {
      setActiveFilterTag(null);
      setSearchQuery('');
    } else {
      setActiveFilterTag(tag);
      setSearchQuery(tag);
      setCurrentView('assets');
    }
  };

  // Asset CRUD & Status Change
  const handleStatusChange = (assetId: string, newStatus: AssetStatus) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            status: newStatus,
            lastPing: newStatus === 'Mantenimiento' ? 'Timeout' : newStatus === 'En almacén' ? 'En espera' : '2ms',
          };
        }
        return a;
      })
    );

    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              lastPing: newStatus === 'Mantenimiento' ? 'Timeout' : newStatus === 'En almacén' ? 'En espera' : '2ms',
            }
          : null
      );
    }
  };

  const handleBulkStatusChange = (assetIds: string[], newStatus: AssetStatus) => {
    const idSet = new Set(assetIds);
    setAssets((prev) =>
      prev.map((a) => {
        if (idSet.has(a.id)) {
          return {
            ...a,
            status: newStatus,
            lastPing: newStatus === 'Mantenimiento' ? 'Timeout' : newStatus === 'En almacén' ? 'En espera' : '2ms',
          };
        }
        return a;
      })
    );
  };

  const handleDeleteAssets = (assetIds: string[]) => {
    const idSet = new Set(assetIds);
    setAssets((prev) => prev.filter((a) => !idSet.has(a.id)));
    if (selectedAsset && idSet.has(selectedAsset.id)) {
      setSelectedAsset(null);
    }
  };

  const handleUpdateAsset = (updated: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAsset(updated);
  };

  const handleAddAsset = (newAsset: Asset) => {
    setAssets((prev) => [newAsset, ...prev]);
    setSelectedAsset(newAsset);
    setIsInspectorOpen(true);
    setCurrentView('assets');
  };

  // Work Orders Handlers
  const handleUpdateWorkOrderStatus = (id: string, status: WorkOrder['status']) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status } : wo))
    );
  };

  const handleCreateWorkOrder = (orderData: Omit<WorkOrder, 'id' | 'createdAt'>) => {
    const newWo: WorkOrder = {
      ...orderData,
      id: `WO-2026-${String(workOrders.length + 483).padStart(4, '0')}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setWorkOrders((prev) => [newWo, ...prev]);
  };

  // Stockroom adjustments
  const handleUpdateStockQuantity = (sku: string, delta: number) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newQty = Math.max(0, item.quantityOnHand + delta);
          return {
            ...item,
            quantityOnHand: newQty,
            status:
              newQty === 0
                ? 'Agotado'
                : newQty <= item.minThreshold
                ? 'Stock Bajo'
                : 'Stock Óptimo',
          };
        }
        return item;
      })
    );
  };

  // Navigation from other components directly to asset in inspector
  const handleSelectAssetById = (assetId: string) => {
    const found = assets.find((a) => a.id === assetId);
    if (found) {
      setSelectedAsset(found);
      setIsInspectorOpen(true);
      setCurrentView('assets');
    }
  };

  // Diagnostic Ping Sweep Simulation
  const handleRunDiagnostics = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.status === 'Asignado') {
            const randomLatency = Math.floor(Math.random() * 4) + 1;
            return { ...a, lastPing: `${randomLatency}ms` };
          }
          return a;
        })
      );
      setIsScanning(false);
    }, 1500);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Tag ID',
      'Name',
      'Category',
      'Manufacturer',
      'Model',
      'Serial Number',
      'MAC Address',
      'IP Address',
      'Location',
      'Rack Position',
      'Status',
      'Last Ping',
      'Warranty Expiry',
      'Switch Port',
      'VLAN',
    ];

    const rows = assets.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.category,
      a.manufacturer,
      a.model,
      a.serialNumber,
      a.macAddress,
      a.ipAddress,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.rackPosition.replace(/"/g, '""')}"`,
      a.status,
      a.lastPing,
      a.warrantyExpiry,
      `"${a.switchPort.replace(/"/g, '""')}"`,
      a.vlan,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Hardware_Manifest_${activeProperty.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Metrics
  const activeCount = useMemo(
    () => assets.filter((a) => a.status === 'Asignado').length,
    [assets]
  );
  const stockCount = useMemo(
    () => assets.filter((a) => a.status === 'En almacén').length,
    [assets]
  );
  const maintenanceCount = useMemo(
    () => assets.filter((a) => a.status === 'Mantenimiento').length,
    [assets]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090D12] text-[#F0F4F8] font-sans selection:bg-[#F57200]/30 selection:text-white">
      {/* 260px Collapsible Command Rail */}
      <CommandRail
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
        }}
        isCollapsed={isRailCollapsed}
        onToggleCollapse={() => setIsRailCollapsed(!isRailCollapsed)}
        activeProperty={activeProperty}
        onPropertyChange={setActiveProperty}
        assetCount={assets.length}
        maintenanceCount={maintenanceCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar with 3-Zone Contract */}
        <TopBar
          currentView={currentView}
          activeProperty={activeProperty}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilterTag={activeFilterTag}
          onFilterTagClick={handleFilterTagClick}
          onOpenNewAssetModal={() => setIsNewAssetModalOpen(true)}
          onExportCsv={handleExportCsv}
          onRunDiagnostics={handleRunDiagnostics}
          isScanning={isScanning}
        />

        {/* Global KPI Strip (Always visible or contextual) */}
        <KpiMetrics
          totalAssets={1284}
          inStock={186}
          maintenanceAlerts={maintenanceCount}
          pingRate={99.4}
          onFilterByStatus={(status) => {
            setCurrentView('assets');
            setSearchQuery(status);
          }}
        />

        {/* Content Viewport Split with Contextual 380px Inspector Drawer */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Active View Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {currentView === 'assets' && (
              <AssetTable
                assets={assets}
                selectedAsset={selectedAsset}
                onSelectAsset={(a) => {
                  setSelectedAsset(a);
                  setIsInspectorOpen(true);
                }}
                onStatusChange={handleStatusChange}
                onBulkStatusChange={handleBulkStatusChange}
                onDeleteAssets={handleDeleteAssets}
                onOpenBarcode={(a) => setBarcodeAsset(a)}
                searchFilter={searchQuery}
              />
            )}

            {currentView === 'racks' && (
              <RackExplorer
                rackUnits={rackUnits}
                assets={assets}
                onSelectAssetById={handleSelectAssetById}
              />
            )}

            {currentView === 'maintenance' && (
              <MaintenanceQueue
                workOrders={workOrders}
                assets={assets}
                onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
                onCreateWorkOrder={handleCreateWorkOrder}
                onSelectAssetById={handleSelectAssetById}
              />
            )}

            {currentView === 'zones' && (
              <ZoneTopology
                zones={zones}
                assets={assets}
                onSelectZoneFilter={(zoneName) => {
                  setCurrentView('assets');
                  setSearchQuery(zoneName.split(' ')[0]);
                }}
              />
            )}

            {currentView === 'stockroom' && (
              <StockroomLedger
                stockItems={stockItems}
                onUpdateQuantity={handleUpdateStockQuantity}
              />
            )}
          </main>

          {/* 380px Contextual Asset Inspector Drawer (Desktop split / Mobile overlay) */}
          {isInspectorOpen && selectedAsset && currentView === 'assets' && (
            <AssetInspector
              asset={selectedAsset}
              onClose={() => setIsInspectorOpen(false)}
              onStatusChange={handleStatusChange}
              onUpdateAsset={handleUpdateAsset}
              onOpenBarcode={(a) => setBarcodeAsset(a)}
            />
          )}
        </div>
      </div>

      {/* New Asset Creation Modal */}
      <NewAssetModal
        isOpen={isNewAssetModalOpen}
        onClose={() => setIsNewAssetModalOpen(false)}
        onAddAsset={handleAddAsset}
        existingCount={assets.length}
      />

      {/* Printable Barcode / Asset Tag Sticker Modal */}
      <BarcodeModal
        asset={barcodeAsset}
        property={activeProperty}
        onClose={() => setBarcodeAsset(null)}
      />
    </div>
  );
}
