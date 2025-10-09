// lib/api.ts
export type KPIRow = {
  placa: string; periodo: string; kms: number;
  costo_combustible: number; costo_mantenimiento: number; costo_otros: number;
  costo_total: number; costo_por_km: number | null;
};
export type KPIResponse = { ok: boolean; rows: KPIRow[]; resumen: any };

// <<<<<< EDITA SOLO ESTAS CONSTANTES >>>>>>
const BASE   = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
const TOKEN  = "demo";   // si NO usas token: const TOKEN = "";
const TENANT = "demo";   // opcional

export async function fetchKPI({ desde, hasta, placa = '', tipo = '', tenant = TENANT }): Promise<KPIResponse> {
  const params = new URLSearchParams({ path: 'kpi', desde, hasta, placa, tipo, tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API KPI error');
  return res.json();
}

export async function fetchAlerts({ desde, hasta, tenant = TENANT }) {
  const params = new URLSearchParams({ path: 'alerts', desde, hasta, tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Alerts error');
  return res.json();
}

export async function fetchVehicles({ tenant = TENANT }) {
  const params = new URLSearchParams({ path: 'vehicles', tenant, token: TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API Vehicles error');
  return res.json();
}

