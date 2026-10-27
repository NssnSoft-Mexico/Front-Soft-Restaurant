import React, { useState } from 'react';
import { Asset, AssetStatus, ServiceHistoryItem } from '../types/asset';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Copy,
  Check,
  Terminal,
  Activity,
  Calendar,
  Layers,
  MapPin,
  ShieldAlert,
  Barcode,
  RotateCw,
  Edit2,
  Save,
  Clock,
  Send,
  Zap,
} from 'lucide-react';

interface AssetInspectorProps {
  asset: Asset | null;
  onClose: () => void;
  onStatusChange: (assetId: string, status: AssetStatus) => void;
  onUpdateAsset: (updated: Asset) => void;
  onOpenBarcode: (asset: Asset) => void;
}

type InspectorTab = 'specs' | 'diagnostics' | 'history';

export const AssetInspector: React.FC<AssetInspectorProps> = ({
  asset,
  onClose,
  onStatusChange,
  onUpdateAsset,
  onOpenBarcode,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('specs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ping diagnostic terminal simulation
  const [isPinging, setIsPinging] = useState(false);
  const [pingLogs, setPingLogs] = useState<string[]>([]);

  // Notes editing state
  const [newNote, setNewNote] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  if (!asset) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunPing = () => {
    setIsPinging(true);
    setPingLogs([
      `$ ping -c 4 -W 2 ${asset.ipAddress}`,
      `PING ${asset.ipAddress} (${asset.ipAddress}): 56 data bytes`,
    ]);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `64 bytes from ${asset.ipAddress}: icmp_seq=0 ttl=64 time=2.14 ms`,
      ]);
    }, 400);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `64 bytes from ${asset.ipAddress}: icmp_seq=1 ttl=64 time=1.89 ms`,
      ]);
    }, 800);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `64 bytes from ${asset.ipAddress}: icmp_seq=2 ttl=64 time=2.41 ms`,
      ]);
    }, 1200);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `64 bytes from ${asset.ipAddress}: icmp_seq=3 ttl=64 time=2.02 ms`,
        `--- ${asset.ipAddress} ping statistics ---`,
        `4 packets transmitted, 4 packets received, 0.0% packet loss`,
        `rtt min/avg/max = 1.89/2.11/2.41 ms [STATUS: NOMINAL]`,
      ]);
      setIsPinging(false);
    }, 1600);
  };

  const handleSaveNotes = () => {
    onUpdateAsset({
      ...asset,
      notes: notesDraft,
    });
    setIsEditingNotes(false);
  };

  const handleAddHistoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newItem: ServiceHistoryItem = {
      id: `H-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      technician: 'S. Rivera',
      action: 'Nota de Servicio',
      notes: newNote.trim(),
    };

    onUpdateAsset({
      ...asset,
      history: [newItem, ...asset.history],
    });
    setNewNote('');
  };

  return (
    <aside className="w-full lg:w-[380px] bg-[#1A222E] border-t lg:border-t-0 lg:border-l border-[#3E4C60] flex flex-col justify-between shrink-0 select-none z-20 overflow-hidden shadow-none">
      {/* Drawer Header */}
      <div className="bg-[#161C26] border-b border-[#3E4C60] p-3 flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#F57200]">
              {asset.id}
            </span>
            <StatusBadge status={asset.status} size="sm" />
          </div>
          <h2 className="text-xs font-semibold text-[#F0F4F8] truncate leading-tight">
            {asset.name}
          </h2>
          <div className="text-[10px] text-[#7E8B9E] font-mono truncate">
            {asset.manufacturer} · {asset.model}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onOpenBarcode(asset)}
            title="Generar etiqueta técnica imprimible con código QR"
            className="p-1 text-[#7E8B9E] hover:text-[#F57200] hover:bg-[#090D12] border border-transparent hover:border-[#3E4C60]"
          >
            <Barcode className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Cerrar inspector"
            className="p-1 text-[#7E8B9E] hover:text-[#F0F4F8] hover:bg-[#090D12] border border-transparent hover:border-[#3E4C60]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-[#0F141C] border-b border-[#3E4C60] flex items-center text-[10px] font-mono uppercase">
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 py-2 px-2 text-center transition-colors border-r border-[#222B38] ${
            activeTab === 'specs'
              ? 'bg-[#1A222E] text-[#F57200] font-semibold border-b border-b-[#F57200]'
              : 'text-[#7E8B9E] hover:text-[#F0F4F8]'
          }`}
        >
          Especificaciones
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex-1 py-2 px-2 text-center transition-colors border-r border-[#222B38] ${
            activeTab === 'diagnostics'
              ? 'bg-[#1A222E] text-[#F57200] font-semibold border-b border-b-[#F57200]'
              : 'text-[#7E8B9E] hover:text-[#F0F4F8]'
          }`}
        >
          Diagnóstico Ping
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-2 text-center transition-colors ${
            activeTab === 'history'
              ? 'bg-[#1A222E] text-[#F57200] font-semibold border-b border-b-[#F57200]'
              : 'text-[#7E8B9E] hover:text-[#F0F4F8]'
          }`}
        >
          Historial ({asset.history.length})
        </button>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: SPECIFICATIONS */}
        {activeTab === 'specs' && (
          <div className="space-y-4 text-xs font-mono">
            {/* Quick Status Control */}
            <div className="bg-[#0F141C] border border-[#222B38] p-2.5 space-y-1.5">
              <span className="text-[10px] text-[#7E8B9E] uppercase tracking-wider block">
                Modificar Estado Operativo
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(['Asignado', 'En almacén', 'Mantenimiento'] as AssetStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onStatusChange(asset.id, st)}
                    className={`py-1 text-[10px] uppercase font-semibold border transition-colors ${
                      asset.status === st
                        ? st === 'Asignado'
                          ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399]'
                          : st === 'En almacén'
                          ? 'bg-[#0284C7]/20 border-[#0284C7] text-[#38BDF8]'
                          : 'bg-[#F57200]/20 border-[#F57200] text-[#FF9838]'
                        : 'bg-[#161C26] border-[#222B38] text-[#7E8B9E] hover:text-[#F0F4F8]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifiers (Serial, MAC, IP) with copy button */}
            <div className="space-y-2 border-b border-[#3E4C60]/60 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">DIRECCIÓN IP</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00E5FF] font-semibold">{asset.ipAddress}</span>
                  <button
                    onClick={() => copyToClipboard(asset.ipAddress, 'ip')}
                    title="Copiar IP"
                    className="p-0.5 text-[#7E8B9E] hover:text-[#F0F4F8]"
                  >
                    {copiedKey === 'ip' ? (
                      <Check className="w-3 h-3 text-[#34D399]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">MAC ADDRESS</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F0F4F8]">{asset.macAddress}</span>
                  <button
                    onClick={() => copyToClipboard(asset.macAddress, 'mac')}
                    title="Copiar MAC"
                    className="p-0.5 text-[#7E8B9E] hover:text-[#F0F4F8]"
                  >
                    {copiedKey === 'mac' ? (
                      <Check className="w-3 h-3 text-[#34D399]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">NÚMERO DE SERIE</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F0F4F8]">{asset.serialNumber}</span>
                  <button
                    onClick={() => copyToClipboard(asset.serialNumber, 'serial')}
                    title="Copiar Serial"
                    className="p-0.5 text-[#7E8B9E] hover:text-[#F0F4F8]"
                  >
                    {copiedKey === 'serial' ? (
                      <Check className="w-3 h-3 text-[#34D399]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">FIRMWARE OS</span>
                <span className="text-[#cebff3]">{asset.firmware}</span>
              </div>
            </div>

            {/* Network & Physical Uplink */}
            <div className="space-y-2 border-b border-[#3E4C60]/60 pb-3">
              <div>
                <span className="text-[10px] text-[#7E8B9E] uppercase block">
                  UBICACIÓN FÍSICA
                </span>
                <span className="text-[#F0F4F8] font-sans text-xs">{asset.location}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#7E8B9E] uppercase block">
                  CONMUTADOR / PUERTO ASOCIADO
                </span>
                <span className="text-[#38BDF8] text-xs">{asset.switchPort}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">SEGMENTO DE RED</span>
                <span className="text-[#00E5FF]">{asset.vlan}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">DEPARTAMENTO</span>
                <span className="text-[#F0F4F8] font-sans text-xs">{asset.assignedDept}</span>
              </div>

              {asset.powerDrawWatts !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7E8B9E] uppercase">POTENCIA ESTIMADA</span>
                  <span className="text-[#34D399] font-medium">{asset.powerDrawWatts} Watts AC</span>
                </div>
              )}
            </div>

            {/* Lifecycle & Warranty */}
            <div className="space-y-1.5 border-b border-[#3E4C60]/60 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">ÚLTIMA AUDITORÍA</span>
                <span className="text-[#F0F4F8]">{asset.lastAudit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7E8B9E] uppercase">VENCIMIENTO GARANTÍA</span>
                <span className="text-[#34D399]">{asset.warrantyExpiry}</span>
              </div>
            </div>

            {/* Notes Section with Inline Edit */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#7E8B9E] uppercase">
                  NOTAS DE INGENIERÍA
                </span>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setNotesDraft(asset.notes);
                      setIsEditingNotes(true);
                    }}
                    className="text-[10px] text-[#F57200] hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Editar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-[10px] text-[#34D399] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Save className="w-2.5 h-2.5" />
                    <span>Guardar</span>
                  </button>
                )}
              </div>

              {!isEditingNotes ? (
                <p className="bg-[#0F141C] border border-[#222B38] p-2 text-xs text-[#7E8B9E] font-sans leading-relaxed">
                  {asset.notes || 'Sin observaciones registradas.'}
                </p>
              ) : (
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full bg-[#0F141C] border border-[#F57200] p-2 text-xs text-[#F0F4F8] font-sans focus:outline-none rounded-none"
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DIAGNOSTICS & PING */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#7E8B9E] uppercase">
                TEST DE CONECTIVIDAD ICMP / PROBE
              </span>
              <button
                onClick={handleRunPing}
                disabled={isPinging}
                className="py-1 px-2.5 bg-[#F57200] text-[#090D12] text-xs font-semibold hover:bg-[#D96500] font-mono uppercase flex items-center gap-1 disabled:opacity-50"
              >
                {isPinging ? (
                  <RotateCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Activity className="w-3 h-3" />
                )}
                <span>{isPinging ? 'Transmitiendo...' : 'Probar Ping'}</span>
              </button>
            </div>

            {/* Terminal Screen */}
            <div className="bg-[#090D12] border border-[#222B38] p-3 font-mono text-xs text-[#00E5FF] min-h-[190px] flex flex-col justify-between">
              <div className="space-y-1 overflow-x-auto">
                <div className="text-[10px] text-[#7E8B9E] border-b border-[#222B38] pb-1 flex items-center justify-between">
                  <span>TERMINAL DIAGNÓSTICO L3</span>
                  <span>MTU: 1500 BYTES</span>
                </div>
                {pingLogs.length === 0 ? (
                  <div className="text-[#7E8B9E] text-xs pt-4">
                    Pulse "PROBAR PING" para enviar ráfaga de paquetes ICMP al host {asset.ipAddress}.
                  </div>
                ) : (
                  pingLogs.map((log, i) => (
                    <div key={i} className="leading-snug break-all text-[11px]">
                      {log}
                    </div>
                  ))
                )}
              </div>
              <div className="text-[10px] text-[#7E8B9E] pt-2 border-t border-[#222B38]/60 flex items-center justify-between">
                <span>GATEWAY: 10.24.1.1</span>
                <span>ARP TABULAR: OK</span>
              </div>
            </div>

            {/* PoE Cycle / Hard Reboot Button */}
            <div className="bg-[#0F141C] border border-[#222B38] p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F0F4F8] font-semibold">CICLO DE ALIMENTACIÓN POE</span>
                <Zap className="w-4 h-4 text-[#F57200]" />
              </div>
              <p className="text-[11px] text-[#7E8B9E] font-sans">
                Reinicia la alimentación del puerto físico {asset.switchPort.split(' : ')[1] || 'de switch'} para recuperar terminales congeladas.
              </p>
              <button
                onClick={() => {
                  alert(`Comando PoE Cycle enviado al switch para ${asset.id}. La interfaz se reiniciará en 5 segundos.`);
                }}
                className="w-full py-1.5 bg-[#161C26] hover:bg-[#222B38] text-[#F57200] border border-[#F57200] text-xs font-mono font-semibold uppercase tracking-wider"
              >
                Ejecutar Ciclo PoE Remoto
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Add note to history */}
            <form onSubmit={handleAddHistoryItem} className="bg-[#0F141C] border border-[#222B38] p-3 space-y-2">
              <span className="text-[10px] font-mono text-[#7E8B9E] uppercase block">
                Registrar Bitácora Técnica en Sitio
              </span>
              <input
                type="text"
                placeholder="Descripción del mantenimiento o diagnóstico..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-[#090D12] border border-[#222B38] text-xs text-[#F0F4F8] p-1.5 focus:border-[#F57200] focus:outline-none rounded-none font-mono"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full py-1 bg-[#161C26] text-[#F0F4F8] hover:bg-[#222B38] border border-[#3E4C60] hover:border-[#F57200] text-xs font-mono uppercase flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Send className="w-3 h-3 text-[#F57200]" />
                <span>Agregar a la Bitácora</span>
              </button>
            </form>

            {/* List of service items */}
            <div className="space-y-2">
              {asset.history.map((hist) => (
                <div
                  key={hist.id}
                  className="bg-[#0F141C] border border-[#222B38] p-3 space-y-1 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#7E8B9E] border-b border-[#222B38]/60 pb-1">
                    <span className="text-[#F57200] font-semibold">{hist.action}</span>
                    <span>{hist.date}</span>
                  </div>
                  <p className="text-[#F0F4F8] font-sans text-xs pt-1">{hist.notes}</p>
                  <div className="text-[10px] text-[#7E8B9E] pt-1">
                    Técnico: <span className="text-[#cebff3]">{hist.technician}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="bg-[#161C26] border-t border-[#3E4C60] p-3 flex items-center justify-between text-[11px] font-mono text-[#7E8B9E]">
        <span>REGISTRO SINCRONIZADO</span>
        <button
          onClick={() => onOpenBarcode(asset)}
          className="text-[#F57200] hover:underline flex items-center gap-1 uppercase"
        >
          <Barcode className="w-3.5 h-3.5" />
          <span>Etiqueta QR</span>
        </button>
      </div>
    </aside>
  );
};
