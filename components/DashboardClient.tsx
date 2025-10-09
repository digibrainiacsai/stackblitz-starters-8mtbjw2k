'use client';
import { useEffect, useState } from 'react';
import KPICard from './KPICard';

function firstDayOfMonthISO(d=new Date()){ return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10); }
function lastDayOfMonthISO(d=new Date()){ return new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10); }

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const desde = firstDayOfMonthISO();
        const hasta = lastDayOfMonthISO();
        const params = new URLSearchParams({ desde, hasta, tenant: 'demo' });
        const res = await fetch(`/api/kpi?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API /api/kpi error');
        const { resumen } = await res.json();
        setResumen(resumen);
      } catch (e:any) {
        setError(e?.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:24}}>Cargando…</div>;
  if (error)   return <div style={{padding:24, color:'crimson'}}>Error: {error}</div>;
  if (!resumen) return <div style={{padding:24}}>Sin datos</div>;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <h1>Dashboard Flota</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:16 }}>
        <KPICard title="Kms" value={Math.round(resumen.kms).toLocaleString()} />
        <KPICard title="Costo total" value={resumen.costo_total.toLocaleString(undefined,{ minimumFractionDigits:2 })} />
        <KPICard title="Combustible" value={resumen.costo_combustible.toLocaleString(undefined,{ minimumFractionDigits:2 })} />
        <KPICard title="Mantenimiento" value={resumen.costo_mantenimiento.toLocaleString(undefined,{ minimumFractionDigits:2 })} />
      </div>
    </main>
  );
}
