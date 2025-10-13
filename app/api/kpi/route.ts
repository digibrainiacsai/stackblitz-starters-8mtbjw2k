// app/api/kpi/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const BASE  = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN = "demo";

  const { searchParams } = new URL(req.url);
  const desde  = searchParams.get('desde')  || '';
  const hasta  = searchParams.get('hasta')  || '';
  const placa  = searchParams.get('placa')  || '';
  const tipo   = searchParams.get('tipo')   || '';
  const tenant = searchParams.get('tenant') || 'demo';

  const p = new URLSearchParams({ path: 'kpi', desde, hasta, placa, tipo, tenant });
  if (TOKEN) p.set('token', TOKEN);

  const upstream = await fetch(`${BASE}?${p.toString()}`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });

  // Reenviamos tal cual (sin JSON.parse) para ver el cuerpo real aunque sea HTML
  const ct   = upstream.headers.get('content-type') ?? 'application/json; charset=utf-8';
  const body = await upstream.arrayBuffer();

  return new Response(body, { status: upstream.status, headers: { 'content-type': ct } });
}
