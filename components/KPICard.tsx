// components/KPICard.tsx
export default function KPICard({
  title, value, suffix = ''
}: { title: string; value: string | number; suffix?: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}{suffix}</div>
    </div>
  );
}
