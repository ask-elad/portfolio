export const T = {
  bg: '#080808',
  ink: '#0a0a0c',
  line: '#1c1c20',
  accent: '#22d3ee',
  // Text tiers — high → low contrast
  t1: '#ededed',
  t2: '#b0b0b0',
  t3: '#8a8a8a',
  t4: '#5e5e63',
  t5: '#3a3a3f',
  t6: '#232327',
  // Fonts (use as fontFamily: T.fSerif)
  fSans:  "'Inter', system-ui, -apple-system, sans-serif",
  fSerif: "'Instrument Serif', 'Times New Roman', serif",
  fMono:  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  // Spacing scale
  s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96, s7: 144,
  // Content widths
  col: 760,
  wide: 1080,
  edit: 1200,
 
  // Nested aliases — same values as above, for components that prefer
  // object notation (e.g. T.font.serif, T.color.border).
  // All existing components continue using the flat keys above unchanged.
  font: {
    sans:  "'Inter', system-ui, -apple-system, sans-serif",
    serif: "'Instrument Serif', 'Times New Roman', serif",
    mono:  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  color: {
    bg:      '#080808',
    surface: '#0a0a0c',
    border:  '#1c1c20',
    accent:  '#22d3ee',
    text:    '#ededed',
    muted:   '#5e5e63',
  },
} as const;
 
