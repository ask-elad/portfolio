export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 44 }}>
      {children}
    </div>
  );
}
export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: '#3a3a3a', fontFamily: 'monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
      {children}
    </div>
  );
}
