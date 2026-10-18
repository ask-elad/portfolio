export const T = {
  bg: '#07090c',
  ink: '#0d1016',
  line: '#1f2630',
  accent: '#4ade80',    // signal green — terminal / healthy / uptime
  warm:   '#fbbf24',    // amber — for "building" / in-flight
  cool:   '#38bdf8',    // sky — for secondary highlights
  // Text tiers — high → low contrast, lifted for a brighter page
  t1: '#f5f7fa',
  t2: '#c9cfd8',
  t3: '#9aa3af',
  t4: '#6b7280',
  t5: '#404855',
  t6: '#262c36',
  // Fonts (use as fontFamily: T.fSerif)
  fSans:  "'Geist', system-ui, -apple-system, sans-serif",
  fSerif: "'Instrument Serif', 'Times New Roman', serif",
  fMono:  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  // Spacing scale
  s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96, s7: 144,
  // Radius — two values, used everywhere.
  radius: { sharp: 2, pill: 999 },
  // Accent as rgb triple for building rgba() values without re-hardcoding the hex.
  accentRgb: '74,222,128',
  warmRgb:   '251,191,36',
  coolRgb:   '56,189,248',
  // Content widths
  col: 760,
  wide: 1080,
  edit: 1200,

  // Nested aliases — same values as above, for components that prefer
  // object notation (e.g. T.font.serif, T.color.border).
  // All existing components continue using the flat keys above unchanged.
  font: {
    sans:  "'Geist', system-ui, -apple-system, sans-serif",
    serif: "'Instrument Serif', 'Times New Roman', serif",
    mono:  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  color: {
    bg:      '#07090c',
    surface: '#0d1016',
    border:  '#1f2630',
    accent:  '#4ade80',
    text:    '#f5f7fa',
    muted:   '#6b7280',
  },
} as const;
