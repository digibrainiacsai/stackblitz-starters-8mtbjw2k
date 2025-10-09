// app/api/vehicles/route.ts
export async function GET() {
  const BASE  = "https://script.google.com/macros/s/AKfycbw799D0QkkG_oDaq3UmNW1zQp3mK-GuS9FGe39eehENEnQt97ZgZGAm2FLp9iuK9bWVwA/exec";
  const TOKEN = "demo";

  const params = new URLSearchParams({ path: 'vehicles', tenant: 'demo' });
  if (TOKEN) params.set('token', TOKEN);

  const res = await fetch(`${BASE}?${params.toString()}`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
