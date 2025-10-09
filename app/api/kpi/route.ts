// app/api/kpi/route.ts
export async function GET(req: Request) {
  const BASE  = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN = "demo"; // si no usas token: ""

  const { searchParams } = new URL(req.url);
  const desde  = searchParams.get('desde')  || '';
  const hasta  = searchParams.get('hasta')  || '';
  const placa  = searchParams.get('placa')  || '';
  const tipo   = searchParams.get('tipo')   || '';
  const tenant = searchParams.get('tenant') || 'demo';

  const params = new URLSearchParams({
    path: 'kpi', desde, hasta, placa, tipo, tenant
  });
  if (TOKEN) params.set('token', TOKEN);

  const res = await fetch(`${BASE}?${params.toString()}`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
