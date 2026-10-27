import React, { useState } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { Plus, X, Server } from 'lucide-react';

interface NewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: Asset) => void;
  existingCount: number;
}

const CATEGORIES: AssetCategory[] = [
  'POS Terminals',
  'Racks & Switches',
  'Key Encoders',
  'Access Points',
  'IoT / Signage',
  'Servidores & PBX',
];

export const NewAssetModal: React.FC<NewAssetModalProps> = ({
  isOpen,
  onClose,
  onAddAsset,
  existingCount,
}) => {
  const nextId = `AST-${String(existingCount + 850).padStart(4, '0')}`;

  const [id, setId] = useState(nextId);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('POS Terminals');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState('');
  const [rackPosition, setRackPosition] = useState('IDF-01 · Planta Baja');
  const [status, setStatus] = useState<AssetStatus>('Asignado');
  const [firmware, setFirmware] = useState('v1.0.0-rt');
  const [switchPort, setSwitchPort] = useState('SW-IDF1-01 : ge-0/0/01 (VLAN 40)');
  const [assignedDept, setAssignedDept] = useState('Operaciones');
  const [vlan, setVlan] = useState('VLAN 40 (POS/F&B)');
  const [powerWatts, setPowerWatts] = useState<number>(45);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Asset = {
      id: id.trim() || nextId,
      name: name.trim() || 'Nuevo Dispositivo',
      category,
      model: model.trim() || 'Modelo Estándar',
      manufacturer: manufacturer.trim() || 'OEM Vendor',
      serialNumber: serialNumber.trim() || `SN-${Date.now().toString().slice(-6)}`,
      macAddress: macAddress.trim() || '00:E0:4C:AA:BB:CC',
      ipAddress: ipAddress.trim() || '10.24.12.99',
      location: location.trim() || 'Recepción Principal',
      rackPosition: rackPosition.trim(),
      status,
      firmware,
      lastPing: '2ms',
      lastAudit: new Date().toISOString().split('T')[0],
      warrantyExpiry: '2028-12-31',
      switchPort,
      assignedDept,
      vlan,
      powerDrawWatts: powerWatts,
      notes,
      history: [
        {
          id: `H-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          technician: 'S. Rivera',
          action: 'Alta inicial en inventario',
          notes: 'Dispositivo desembalado, probado y registrado en la flota operativa.',
        },
      ],
    };

    onAddAsset(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1A222E] border border-[#3E4C60] my-8 shadow-none">
        {/* Header */}
        <div className="bg-[#161C26] border-b border-[#3E4C60] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#F57200]" />
            <div>
              <h3 className="text-sm font-semibold text-[#F0F4F8] font-mono uppercase tracking-wider">
                Registrar Nuevo Activo de Hardware
              </h3>
              <p className="text-[11px] text-[#7E8B9E] font-mono">
                Incorporación de equipo a la consola de operaciones y monitoreo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7E8B9E] hover:text-[#F0F4F8] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Asset Tag ID *
              </label>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F57200] font-bold p-2 focus:outline-none rounded-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Nombre del Equipo *
              </label>
              <input
                type="text"
                required
                placeholder={'ej. Terminal Touch 15" i3 Barra'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Fabricante
              </label>
              <input
                type="text"
                placeholder="ej. NCR Voyix / Cisco"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Modelo
              </label>
              <input
                type="text"
                placeholder="ej. RealPOS XR7 Plus"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Número de Serie *
              </label>
              <input
                type="text"
                required
                placeholder="SN-XXXX-XXXX"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Dirección MAC *
              </label>
              <input
                type="text"
                required
                placeholder="00:E0:4C:XX:XX:XX"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Dirección IP *
              </label>
              <input
                type="text"
                required
                placeholder="10.24.XX.XX"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#00E5FF] p-2 focus:outline-none rounded-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Ubicación Física *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Restaurante La Cava - Estación 01"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Armario / Rack de Distribución
              </label>
              <input
                type="text"
                value={rackPosition}
                onChange={(e) => setRackPosition(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Estado Operativo Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none cursor-pointer"
              >
                <option value="Asignado">Asignado (En operación)</option>
                <option value="En almacén">En almacén (Reserva)</option>
                <option value="Mantenimiento">Mantenimiento (Revisión)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Puerto Conmutador / Switch
              </label>
              <input
                type="text"
                placeholder="SW-IDF1-01 : ge-0/0/01"
                value={switchPort}
                onChange={(e) => setSwitchPort(e.target.value)}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
                Consumo AC (Watts)
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                value={powerWatts}
                onChange={(e) => setPowerWatts(Number(e.target.value))}
                className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#7E8B9E] mb-1">
              Notas Técnicas de Instalación
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Periféricos asociados, fecha de puesta en marcha, responsable..."
              className="w-full bg-[#0F141C] border border-[#222B38] focus:border-[#F57200] text-[#F0F4F8] p-2 focus:outline-none rounded-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3E4C60]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#161C26] text-[#F0F4F8] border border-[#3E4C60] hover:bg-[#222B38] uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F57200] text-[#090D12] font-bold uppercase tracking-wider hover:bg-[#D96500] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar y Dar de Alta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
