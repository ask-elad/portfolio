import { T } from '@/lib/tokens';

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: T.accent, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 36, fontWeight: 500 }}>
      <span style={{ display: 'inline-block', width: 18, height: 1, background: T.accent, verticalAlign: 'middle', marginRight: 12, opacity: .6 }} />
      {children}
    </div>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: T.t5, fontFamily: T.fMono, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>
      {children}
    </div>
  );
}
