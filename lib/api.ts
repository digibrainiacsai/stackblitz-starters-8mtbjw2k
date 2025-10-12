// lib/api.ts

// Tipos de datos para KPIs
export type KPIRow = {
  placa: string;
  periodo: string;
  kms: number;
  costo_combustible: number;
  costo_mantenimiento: number;
  costo_otros: number;
  costo_total: number;
  costo_por_km: number | null;
};

export type KPIResponse = {
  ok: boolean;
  rows: KPIRow[];
  resumen: any; // Puedes definir mejor si conoces la estructura
};

// Tipos de datos para alertas y vehículos
export type AlertsResponse = {
  ok: boolean;
  alerts: string[];
};

export type VehiclesResponse = {
  ok: boolean;
  vehicles: string[];
};

// Tipos de argumentos
export type KPIArgs = {
  desde: string;
  hasta: string;
  placa?: string;
  tipo?: string;
  tenant?: string;
};

export type AlertsArgs = {
  desde: string;
  hasta: string;
  tenant?: string;
};

export type VehiclesArg = {
  tenant?: string;
};

// Constantes del backend
const BASE = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
const TOKEN = "demo";
const TENANT = "demo";

// Función para obtener KPIs
export async function fetchKPI(args: KPIArgs): Promise<KPIResponse> {
  const { desde, hasta, placa = '', tipo = '', tenant = TENANT } = args;

  const params = new URLSearchParams({
    path: 'kpi',
    desde,
    hasta,
    placa,
    tipo,
    tenant,
    token: TOKEN,
  });

  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API KPI error');
  return res.json();
}

// Función para obtener alertas
export async function fetchAlerts(args: AlertsArgs): Promise<AlertsResponse> {
  const { desde, hasta, tenant = TENANT } = args;

  const params = new URLSearchParams({
    path: 'alerts',
    desde,
    hasta,
    tenant,
    token: TOKEN,
  });

  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Alerts error');
  return res.json();
}

// Función para obtener vehículos
export async function fetchVehicles(args: VehiclesArg = {}): Promise<VehiclesResponse> {
  const { tenant = TENANT } = args;

  const params = new URLSearchParams({
    path: 'vehicles',
    tenant,
    token: TOKEN,
  });

  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Vehicles error');
  return res.json();
}


