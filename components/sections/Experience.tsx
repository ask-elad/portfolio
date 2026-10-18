'use client';
import { EXPERIENCE, isActive, type ProofOfWork } from '@/lib/data/experience';
import { T } from '@/lib/tokens';

const proofIcon: Record<NonNullable<ProofOfWork['kind']>, string> = {
  pr: '⌥',
  demo: '↗',
  repo: '◲',
  article: '¶',
  design: '◐',
  video: '▶',
  other: '•',
};

export function Experience() {
  return (
    <section id="experience" style={{ padding: '96px 40px', maxWidth: 880, margin: '0 auto' }}>
      <h2
        style={{
          fontFamily: T.font.serif,
          fontSize: 'clamp(32px, 4vw, 44px)',
          lineHeight: 1.05,
          margin: '0 0 56px',
          letterSpacing: '-0.01em',
        }}
      >
        Where I've been building.
      </h2>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
        {/* vertical rail */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 27,
            top: 8,
            bottom: 8,
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${T.color.border} 12%, ${T.color.border} 88%, transparent)`,
          }}
        />

        {EXPERIENCE.map((e, i) => {
          const active = isActive(e);
          const idleBorder = active ? 'rgba(74,222,128,0.28)' : T.color.border;
          const idleBg = active ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.015)';
          return (
          <li
            key={i}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              gap: 24,
              padding: '18px 0 40px',
            }}
          >
            {/* Logo / node */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  border: `1px solid ${T.color.border}`,
                  background: T.color.surface ?? '#0f0f0f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  fontFamily: T.font.mono,
                  fontSize: 18,
                  color: T.color.accent,
                }}
              >
                {e.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.logo}
                    alt={`${e.company} logo`}
                    style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                  />
                ) : (
                  e.company.slice(0, 2).toUpperCase()
                )}
              </div>
            </div>

            {/* Body */}
            <article
              style={{
                border: `1px solid ${idleBorder}`,
                borderRadius: 2,
                padding: '20px 22px',
                background: idleBg,
                boxShadow: active ? 'inset 2px 0 0 rgba(74,222,128,0.55)' : 'none',
                transition: 'border-color .2s ease, transform .2s ease, background .2s ease',
              }}
              onMouseEnter={(ev) => {
                ev.currentTarget.style.borderColor = T.color.accent;
                ev.currentTarget.style.background = 'rgba(74,222,128,0.06)';
              }}
              onMouseLeave={(ev) => {
                ev.currentTarget.style.borderColor = idleBorder;
                ev.currentTarget.style.background = idleBg;
              }}
            >
              {/* Meta row */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  fontFamily: T.font.mono,
                  fontSize: 12,
                  color: T.color.muted,
                  marginBottom: 10,
                }}
              >
                {active && (
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: T.color.accent,
                      boxShadow: '0 0 8px rgba(74,222,128,0.7)',
                      animation: 'pulseGlow 2.4s ease-in-out infinite',
                    }}
                  />
                )}
                <span style={{ color: T.color.accent }}>{e.period}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{e.type}</span>
                {e.location && (
                  <>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{e.location}</span>
                  </>
                )}
              </div>

              {/* Role + Company */}
              <h3
                style={{
                  fontFamily: T.font.serif,
                  fontSize: 24,
                  lineHeight: 1.2,
                  margin: '0 0 4px',
                  letterSpacing: '-0.01em',
                }}
              >
                {e.role}
              </h3>
              {e.companyUrl ? (
                <a
                  href={e.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 14,
                    color: T.color.text,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${T.color.border}`,
                    paddingBottom: 1,
                  }}
                >
                  {e.company} <span style={{ color: T.color.muted }}>↗</span>
                </a>
              ) : (
                <span style={{ fontSize: 14, color: T.color.text }}>{e.company}</span>
              )}

              {/* Summary lede */}
              {e.summary && (
                <p
                  style={{
                    fontFamily: T.font.serif,
                    fontSize: 17,
                    lineHeight: 1.55,
                    color: T.color.text,
                    margin: '16px 0 12px',
                    fontStyle: 'italic',
                    opacity: 0.92,
                  }}
                >
                  {e.summary}
                </p>
              )}

              {/* Bullets */}
              <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0 }}>
                {e.bullets.map((b, j) => (
                  <li
                    key={j}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '18px 1fr',
                      gap: 6,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: T.color.muted,
                      padding: '4px 0',
                    }}
                  >
                    <span style={{ color: T.color.accent, fontFamily: T.font.mono }}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Proof of work */}
              {e.proofs && e.proofs.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div
                    style={{
                      fontFamily: T.font.mono,
                      fontSize: 11,
                      color: T.color.muted,
                      marginBottom: 8,
                    }}
                  >
                    Proof of work
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {e.proofs.map((p, k) => (
                      <a
                        key={k}
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: `1px solid ${T.color.border}`,
                          fontSize: 12.5,
                          color: T.color.text,
                          textDecoration: 'none',
                          transition: 'all .15s ease',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                        onMouseEnter={(ev) => {
                          ev.currentTarget.style.borderColor = T.color.accent;
                          ev.currentTarget.style.color = T.color.accent;
                        }}
                        onMouseLeave={(ev) => {
                          ev.currentTarget.style.borderColor = T.color.border;
                          ev.currentTarget.style.color = T.color.text;
                        }}
                      >
                        <span style={{ fontFamily: T.font.mono, opacity: 0.7 }}>
                          {proofIcon[p.kind ?? 'other']}
                        </span>
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech tags */}
              {e.tech.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 18,
                    paddingTop: 14,
                    borderTop: `1px solid ${T.color.border}`,
                  }}
                >
                  {e.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: T.font.mono,
                        fontSize: 11,
                        color: T.color.muted,
                        padding: '3px 8px',
                        borderRadius: T.radius.sharp,
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </li>
          );
        })}
      </ol>
    </section>
  );
}