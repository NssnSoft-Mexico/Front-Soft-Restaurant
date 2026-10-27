import React, { useState } from 'react';
import { WorkOrder, Asset } from '../types/asset';
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  User,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface MaintenanceQueueProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  onUpdateWorkOrderStatus: (id: string, status: WorkOrder['status']) => void;
  onCreateWorkOrder: (order: Omit<WorkOrder, 'id' | 'createdAt'>) => void;
  onSelectAssetById: (assetId: string) => void;
}

export const MaintenanceQueue: React.FC<MaintenanceQueueProps> = ({
  workOrders,
  assets,
  onUpdateWorkOrderStatus,
  onCreateWorkOrder,
  onSelectAssetById,
}) => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todas');

  // Form states
  const [newAssetId, setNewAssetId] = useState(assets[0]?.id || '');
  const [newPriority, setNewPriority] = useState<'Crítica' | 'Alta' | 'Media' | 'Baja'>('Alta');
  const [newLocation, setNewLocation] = useState(assets[0]?.location || '');
  const [newDescription, setNewDescription] = useState('');
  const [newTech, setNewTech] = useState('S. Rivera');
  const [newSla, setNewSla] = useState('Hoy 18:00 (4h restantes)');

  const handleAssetSelectInForm = (assetId: string) => {
    setNewAssetId(assetId);
    const found = assets.find((a) => a.id === assetId);
    if (found) {
      setNewLocation(found.location);
    }
  };

  const handleSubmitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const assetObj = assets.find((a) => a.id === newAssetId);
    onCreateWorkOrder({
      assetId: newAssetId,
      assetName: assetObj ? assetObj.name : 'Activo Seleccionado',
      priority: newPriority,
      location: newLocation,
      issueDescription: newDescription,
      assignedTech: newTech,
      slaDeadline: newSla,
      status: 'Abierto',
    });
    setShowNewOrderModal(false);
    setNewDescription('');
  };

  const filteredOrders = workOrders.filter((wo) => {
    if (filterPriority !== 'Todas' && wo.priority !== filterPriority) return false;
    if (filterStatus !== 'Todas' && wo.status !== filterStatus) return false;
    return true;
  });

  const getPriorityStyle = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'Crítica':
        return 'border-[#DC2626] bg-[rgba(220,38,38,0.15)] text-[#F87171]';
      case 'Alta':
        return 'border-[#F57200] bg-[rgba(245,114,0,0.15)] text-[#FF9838]';
      case 'Media':
        return 'border-[#FBBF24] bg-[rgba(251,191,36,0.15)] text-[#FBBF24]';
      case 'Baja':
        return 'border-[#3E4C60] bg-[#161C26] text-[#7E8B9E]';
    }
  };

  const getStatusStyle = (status: WorkOrder['status']) => {
    switch (status) {
      case 'Abierto':
        return 'border-[#DC2626] text-[#F87171]';
      case 'En diagnóstico':
        return 'border-[#F57200] text-[#FF9838]';
      case 'Pieza en tránsito':
        return 'border-[#0284C7] text-[#38BDF8]';
      case 'Resuelto':
        return 'border-[#10B981] text-[#34D399]';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F141C] border border-[#222B38] mx-4 mb-4 select-none">
      {/* Queue Toolbar */}
      <div className="bg-[#161C26] border-b border-[#222B38] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <Wrench className="w-4 h-4 text-[#F57200]" />
          <div>
            <span className="text-xs font-semibold text-[#F0F4F8] font-mono">
              COLA DE ÓRDENES & SERVICIOS SLA
            </span>
            <span className="text-[10px] text-[#7E8B9E] font-mono ml-2">
              (Gestión de incidencias de hardware en sitio)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#090D12] border border-[#222B38] text-xs text-[#F0F4F8] py-1 px-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
          >
            <option value="Todas">Todas las Prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#090D12] border border-[#222B38] text-xs text-[#F0F4F8] py-1 px-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
          >
            <option value="Todas">Todos los Estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En diagnóstico">En diagnóstico</option>
            <option value="Pieza en tránsito">Pieza en tránsito</option>
            <option value="Resuelto">Resuelto</option>
          </select>

          {/* Add Order Button */}
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="py-1 px-2.5 bg-[#F57200] text-[#090D12] font-semibold text-xs flex items-center gap-1 hover:bg-[#D96500] font-mono uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Ticket</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-auto divide-y divide-[#1C232E]">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-[#7E8B9E] font-mono">
            <CheckCircle className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
            <p className="text-sm text-[#F0F4F8]">Sin órdenes de mantenimiento pendientes.</p>
            <p className="text-xs">Toda la infraestructura de hardware se encuentra operando dentro de SLA.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="p-4 bg-[#0F141C] hover:bg-[#161C26] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side: ID, Priority, Asset & Description */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F57200]">
                      {order.id}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.2 border font-semibold ${getPriorityStyle(
                        order.priority
                      )}`}
                    >
                      {order.priority}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.2 border ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-[10px] text-[#7E8B9E] font-mono">
                      Creado: {order.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#F0F4F8] truncate">
                      {order.assetName}
                    </h4>
                    <button
                      onClick={() => onSelectAssetById(order.assetId)}
                      className="text-[10px] font-mono text-[#00E5FF] hover:underline"
                    >
                      [{order.assetId}]
                    </button>
                  </div>

                  <p className="text-xs text-[#7E8B9E] font-mono">
                    {order.issueDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#7E8B9E] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F57200]" />
                      <span>{order.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#cebff3]" />
                      <span>Técnico: {order.assignedTech}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#FF9838]">
                      <Clock className="w-3 h-3" />
                      <span>SLA: {order.slaDeadline}</span>
                    </span>
                  </div>
                </div>

                {/* Right side: Change status buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <span className="text-[10px] font-mono text-[#7E8B9E] uppercase mr-1">
                    Estado:
                  </span>
                  {(['En diagnóstico', 'Pieza en tránsito', 'Resuelto'] as WorkOrder['status'][]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateWorkOrderStatus(order.id, st)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 border transition-colors ${
                          order.status === st
                            ? 'bg-[#F57200] text-[#090D12] border-[#F57200] font-bold'
                            : 'bg-[#161C26] text-[#7E8B9E] border-[#2F3B4D] hover:text-[#F0F4F8]'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Work Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#1A222E] border border-[#3E4C60] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
              <h3 className="text-sm font-semibold text-[#F0F4F8] font-mono uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#F57200]" />
                <span>Generar Ticket de Servicio Técnico</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-[#7E8B9E] hover:text-[#F0F4F8] text-sm font-mono"
              >
                [ESC / CERRAR]
              </button>
            </div>

            <form onSubmit={handleSubmitNewOrder} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7E8B9E] mb-1">
                  Dispositivo Afectado
                </label>
                <select
                  value={newAssetId}
                  onChange={(e) => handleAssetSelectInForm(e.target.value)}
                  className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] p-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.id}] {a.name} - {a.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#7E8B9E] mb-1">
                    Nivel de Prioridad SLA
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] p-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
                  >
                    <option value="Crítica">Crítica (&lt; 2h SLA)</option>
                    <option value="Alta">Alta (&lt; 6h SLA)</option>
                    <option value="Media">Media (&lt; 24h SLA)</option>
                    <option value="Baja">Baja (&lt; 72h SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#7E8B9E] mb-1">
                    Técnico Asignado
                  </label>
                  <select
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] p-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
                  >
                    <option value="S. Rivera">S. Rivera (Líder Hardware)</option>
                    <option value="L. Morales">L. Morales (Especialista Redes)</option>
                    <option value="M. Chen">M. Chen (Sistemas PMS/POS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7E8B9E] mb-1">
                  Ubicación Física
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] p-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7E8B9E] mb-1">
                  Descripción Técnica del Fallo
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalle síntoma, mensaje de error, comportamiento anómalo..."
                  required
                  className="w-full bg-[#0F141C] border border-[#222B38] text-xs text-[#F0F4F8] p-2 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-3 py-1.5 bg-[#161C26] text-[#F0F4F8] border border-[#3E4C60] hover:bg-[#222B38] text-xs font-mono uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#F57200] text-[#090D12] font-semibold text-xs hover:bg-[#D96500] font-mono uppercase tracking-wider"
                >
                  Registrar Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
