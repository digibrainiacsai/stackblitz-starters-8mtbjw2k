export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const BASE  = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN = "demo";

  const { searchParams } = new URL(req.url);
  const desde  = searchParams.get('desde')  || '';
  const hasta  = searchParams.get('hasta')  || '';
  const placa  = searchParams.get('placa')  || '';
  const tipo   = searchParams.get('tipo')   || '';
  const tenant = searchParams.get('tenant') || 'demo';

  const params = new URLSearchParams({ path: 'kpi', desde, hasta, placa, tipo, tenant });
  if (TOKEN) params.set('token', TOKEN);

  const upstream = await fetch(`${BASE}?${params.toString()}`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });

  const text = await upstream.text();

  if (!upstream.ok) {
    return new Response(text, { status: upstream.status });
  }
  try {
    const data = JSON.parse(text);
    return Response.json(data, { status: upstream.status });
  } catch {
    return Response.json(
      { ok: false, error: 'UPSTREAM_NOT_JSON', preview: text.slice(0, 200) },
      { status: 502 }
    );
  }
}


