// lib/api.js
export async function fetchKPI(args) {
  const BASE   = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN  = "demo";
  const TENANT = "demo";

  const desde  = args.desde;
  const hasta  = args.hasta;
  const placa  = args.placa  ?? '';
  const tipo   = args.tipo   ?? '';
  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path:'kpi', desde, hasta, placa, tipo, tenant, token:TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache:'no-store' });
  if (!res.ok) throw new Error('API KPI error');
  return res.json();
}

export async function fetchAlerts(args) {
  const BASE   = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN  = "demo";
  const TENANT = "demo";

  const desde  = args.desde;
  const hasta  = args.hasta;
  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path:'alerts', desde, hasta, tenant, token:TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache:'no-store' });
  if (!res.ok) throw new Error('API Alerts error');
  return res.json();
}

export async function fetchVehicles(args = {}) {
  const BASE   = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN  = "demo";
  const TENANT = "demo";

  const tenant = args.tenant ?? TENANT;

  const params = new URLSearchParams({ path:'vehicles', tenant, token:TOKEN });
  const res = await fetch(`${BASE}?${params.toString()}`, { cache:'no-store' });
  if (!res.ok) throw new Error('API Vehicles error');
  return res.json();
}
