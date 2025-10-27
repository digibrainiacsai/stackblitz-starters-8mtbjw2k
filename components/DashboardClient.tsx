'use client';

import { useEffect, useMemo, useState } from 'react';

type Row = {
  placa: string;
  periodo: string; // YYYY-MM
  kms: number;
  costo_combustible: number;
  costo_mantenimiento: number;
  costo_otros: number;
};

type Data = { rows: Row[] };

export default function DashboardClient() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data.json', { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || 'Error cargando datos');
      }
    })();
  }, []);

  const resumen = useMemo(() => {
    if (!data?.rows?.length) return {
      kms: 0, costo_combustible: 0, costo_mantenimiento: 0, costo_otros: 0, costo_total: 0, cpk_prom: null as number | null
    };
    const k = data.rows.reduce((acc, r) => {
      const ct = r.costo_combustible + r.costo_mantenimiento + r.costo_otros;
      acc.kms += r.kms;
      acc.costo_combustible += r.costo_combustible;
      acc.costo_mantenimiento += r.costo_mantenimiento;
      acc.costo_otros += r.costo_otros;
      acc.costo_total += ct;
      return acc;
    }, { kms:0, costo_combustible:0, costo_mantenimiento:0, costo_otros:0, costo_total:0 });

    const cpk_prom = k.kms > 0 ? (k.costo_total / k.kms) : null;
    return { ...k, cpk_prom };
  }, [data]);

  const porPlaca = useMemo(() => {
    if (!data?.rows) return [];
    const m = new Map<string, { placa: string; kms: number; costo_total: number; cpk: number | null }>();
    for (const r of data.rows) {
      const ct = r.costo_combustible + r.costo_mantenimiento + r.costo_otros;
      if (!m.has(r.placa)) m.set(r.placa, { placa: r.placa, kms: 0, costo_total: 0, cpk: null });
      const o = m.get(r.placa)!;
      o.kms += r.kms;
      o.costo_total += ct;
      o.cpk = o.kms > 0 ? o.costo_total / o.kms : null;
    }
    return Array.from(m.values()).sort((a,b) => (a.placa > b.placa ? 1 : -1));
  }, [data]);

  if (error) return <div style={{ padding: 16, color: 'crimson' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: 16 }}>Cargando…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Dashboard — MVP (estático)</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Fuente de datos: <code>/public/data.json</code> &nbsp;—&nbsp; Edítalo en GitHub para actualizar.
      </p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 16 }}>
        <KPI title="KMs" value={formatNumber(resumen.kms)} />
        <KPI title="Combustible" value={formatMoney(resumen.costo_combustible)} />
        <KPI title="Mantenimiento" value={formatMoney(resumen.costo_mantenimiento)} />
        <KPI title="Otros" value={formatMoney(resumen.costo_otros)} />
        <KPI title="CPK Promedio" value={resumen.cpk_prom != null ? formatMoney(resumen.cpk_prom) : '—'} />
      </div>

      {/* Tabla por Placa */}
      <h2 style={{ marginTop: 24, marginBottom: 8 }}>Costo por Kilómetro — por placa</h2>
      <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f7f7f7' }}>
            <tr>
              <Th>Placa</Th>
              <Th align="right">KMs</Th>
              <Th align="right">Costo total</Th>
              <Th align="right">CPK</Th>
            </tr>
          </thead>
          <tbody>
            {porPlaca.map((r) => (
              <tr key={r.placa}>
                <Td>{r.placa}</Td>
                <Td align="right">{formatNumber(r.kms)}</Td>
                <Td align="right">{formatMoney(r.costo_total)}</Td>
                <Td align="right">{r.cpk != null ? formatMoney(r.cpk) : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Datos crudos (opcional) */}
      <details style={{ marginTop: 24 }}>
        <summary>Ver datos crudos</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
{JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Th({ children, align = 'left' }: any) {
  return (
    <th style={{ textAlign: align, padding: '10px 12px', fontWeight: 600, borderBottom: '1px solid #eee' }}>
      {children}
    </th>
  );
}
function Td({ children, align = 'left' }: any) {
  return (
    <td style={{ textAlign: align, padding: '10px 12px', borderBottom: '1px solid #f1f1f1' }}>
      {children}
    </td>
  );
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('es-PA').format(n);
}
function formatMoney(n: number) {
  return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

