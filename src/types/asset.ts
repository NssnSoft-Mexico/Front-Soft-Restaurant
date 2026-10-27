export type AssetStatus = 'Asignado' | 'En almacén' | 'Mantenimiento';

export type AssetCategory =
  | 'POS Terminals'
  | 'Racks & Switches'
  | 'Key Encoders'
  | 'Access Points'
  | 'IoT / Signage'
  | 'Servidores & PBX';

export interface ServiceHistoryItem {
  id: string;
  date: string;
  technician: string;
  action: string;
  notes: string;
}

export interface Asset {
  id: string; // e.g. "AST-POS-0842"
  name: string;
  category: AssetCategory;
  model: string;
  manufacturer: string;
  serialNumber: string;
  macAddress: string;
  ipAddress: string;
  location: string;
  rackPosition: string;
  status: AssetStatus;
  firmware: string;
  lastPing: string;
  lastAudit: string;
  warrantyExpiry: string;
  switchPort: string;
  assignedDept: string;
  notes: string;
  vlan: string;
  powerDrawWatts?: number;
  history: ServiceHistoryItem[];
}

export interface RackUnit {
  uNumber: number; // 1 to 42
  sizeU: number; // e.g., 1U, 2U, 4U
  assetId?: string;
  deviceName?: string;
  model?: string;
  type: 'switch' | 'server' | 'patch' | 'ups' | 'router' | 'pdu' | 'empty';
  status: AssetStatus | 'Operativo';
  ip?: string;
  portsUsed?: number;
  portsTotal?: number;
  tempCelsius?: number;
  powerWatts?: number;
}

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  priority: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  location: string;
  issueDescription: string;
  assignedTech: string;
  slaDeadline: string;
  createdAt: string;
  status: 'Abierto' | 'En diagnóstico' | 'Pieza en tránsito' | 'Resuelto';
}

export interface FacilityZone {
  id: string;
  name: string;
  floor: string;
  totalAssets: number;
  posTerminals: number;
  accessPoints: number;
  switches: number;
  networkHealthPct: number;
  activeAlerts: number;
  lastInspection: string;
}

export interface StockItem {
  sku: string;
  name: string;
  category: AssetCategory;
  quantityOnHand: number;
  minThreshold: number;
  unitCostUsd: number;
  binLocation: string;
  supplier: string;
  status: 'Stock Óptimo' | 'Stock Bajo' | 'Agotado';
}
