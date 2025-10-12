// lib/api.ts
export type KPIRow = {
  placa: string; periodo: string; kms: number;
  costo_combustible: number; costo_mantenimiento: number; costo_otros: number;
  costo_total: number; costo_por_km: number | null;
};
export type KPIResponse = { ok: boolean; rows: KPIRow[]; resumen: any };

type KPIArgs     = { desde: string; hasta: string; placa?: string; tipo?: string; tenant?: string };
type AlertsArgs  = { desde: string; hasta: string; tenant?: string };
type VehiclesArg = { tenant?: string };

// Constantes del backend (ajusta si cambian)
const BASE   = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
const TOKEN  = "demo";
const TENANT = "demo";

export async function fetchKPI(args: KPIArgs): Promise<KPIResponse> {
  const desde  = args.desde;
  const hasta  = args.hasta;
  const placa  = args.placa  ?? '';
  const tipo   = args.tipo   ?? '';
  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path: 'kpi', desde, hasta, placa, tipo, tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API KPI error');
  return res.json();
}

export async function fetchAlerts(args: AlertsArgs) {
  const desde  = args.desde;
  const hasta  = args.hasta;
  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path: 'alerts', desde, hasta, tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Alerts error');
  return res.json();
}

export async function fetchVehicles(args: VehiclesArg = {}) {
  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path: 'vehicles', tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Vehicles error');
  return res.json();
}
