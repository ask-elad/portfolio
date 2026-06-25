'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSound , SoundType } from '@/hooks/useSound';
import { Cursor } from '@/components/features/Cursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg } from '@/components/features/VinlandEasterEgg';
import { SubLabel } from '@/components/ui/SectionLabel';
import { CONFIG } from '@/lib/data/config';

type AnyObj = Record<string, any>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatNum(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString();
}

function formatPct(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${Math.round(value)}%`;
}

function getCfColor(rating: number) {
  if (rating >= 2400) return '#ff0000';
  if (rating >= 2100) return '#ff8c00';
  if (rating >= 1900) return '#aa00aa';
  if (rating >= 1600) return '#0000ff';
  if (rating >= 1400) return '#03a89e';
  if (rating >= 1200) return '#008000';
  return '#808080';
}

function getLcTone(difficulty: 'Easy' | 'Medium' | 'Hard') {
  if (difficulty === 'Easy') return '#22d3ee';
  if (difficulty === 'Medium') return '#f59e0b';
  return '#ef4444';
}

function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-white/10 bg-[#0a0a0c]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
  subtext,
}: {
  label: string;
  value: string;
  accent: string;
  subtext?: string;
}) {
  return (
    <Card className="min-h-[108px]">
      <div className="text-[10px] uppercase tracking-[0.24em] text-white/25 font-mono">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight" style={{ color: accent }}>
        {value}
      </div>
      {subtext ? (
        <div className="mt-2 text-xs font-mono text-white/35">{subtext}</div>
      ) : null}
    </Card>
  );
}

function ProgressRow({
  label,
  solved,
  total,
  color,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min(100, (solved / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-mono" style={{ color }}>
          {label}
        </span>
        <span className="text-xs font-mono text-white/35">
          {solved} / {total || '?'}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Sparkline({
  values,
  stroke = '#22d3ee',
}: {
  values: number[];
  stroke?: string;
}) {
  if (values.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center text-xs font-mono text-white/20">
        no contest history yet
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="h-28 w-full overflow-visible">
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {values.map((value, index) => {
          const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.9" fill={stroke} />;
        })}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-white/18">
        <span>older</span>
        <span>recent</span>
      </div>
    </div>
  );
}

function BarChart({
  items,
  color,
}: {
  items: Array<{ label: string; value: number }>;
  color: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center text-xs font-mono text-white/20">
        nothing to show
      </div>
    );
  }

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = Math.max(2, (item.value / max) * 100);
        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-white/55">{item.label}</span>
              <span className="text-xs font-mono text-white/30">{formatNum(item.value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400/90">
        {eyebrow}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-sm leading-6 text-white/40 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function LinkLine({
  href,
  label,
  playSound,
}: {
  href: string;
  label: string;
  playSound: (sound: SoundType) => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#22d3ee';
        playSound('hover');
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#22d3ee';
      }}
      className="inline-flex items-center gap-2 font-mono text-xs text-#22d3ee transition-colors duration-150"
    >
      <span className="text-white/35">↗</span>
      {label}
    </a>
  );
}

export default function CPPage() {
  const playSound = useSound();
  const router = useRouter();

  const [lc, setLc] = useState<AnyObj | null>(null);
  const [cf, setCf] = useState<AnyObj | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [vinland, setVinland] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((value) => !value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        if (CONFIG.social.leetcode && !CONFIG.social.leetcode.startsWith('REPLACE')) {
          const res = await fetch(
            `/api/leetcode?username=${CONFIG.social.leetcode}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setLc(data);
        }

        if (CONFIG.social.codeforces && !CONFIG.social.codeforces.startsWith('REPLACE')) {
          const res = await fetch(
            `/api/codeforces?handle=${CONFIG.social.codeforces}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setCf(data);
        }
      } catch {
        // ignore fetch errors for now; UI already handles missing data
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  const handleCmd = (cmd: Command) => {
    setCmdOpen(false);
    playSound('click');

    if (cmd.section) {
      router.push('/');
      setTimeout(() => {
        document.getElementById(cmd.section!)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }

    if (cmd.page) {
      router.push(`/${cmd.page}`);
    }
  };

  // LeetCode data
  const lcProfile = lc?.profile ?? null;
  const lcContest = lc?.contest ?? null;
  const lcSolved = lc?.solved ?? null;
  const lcTotals = lc?.totalQuestions ?? null;

  const lcSolvedTotal = lcSolved?.total ?? 0;
  const lcEasy = lcSolved?.easy ?? 0;
  const lcMedium = lcSolved?.medium ?? 0;
  const lcHard = lcSolved?.hard ?? 0;

  const lcEasyTotal = lcTotals?.easy ?? 0;
  const lcMediumTotal = lcTotals?.medium ?? 0;
  const lcHardTotal = lcTotals?.hard ?? 0;

  const lcContestRating = lcContest?.rating ?? null;
  const lcGlobalRank = lcContest?.globalRanking ?? null;
  const lcAttended = lcContest?.attended ?? 0;
  const lcTopPercentage = lcContest?.topPercentage ?? null;

  // Codeforces data
  const cfProfile = cf?.profile ?? null;
  const cfStats = cf?.stats ?? null;
  const cfContests = cf?.contests ?? null;
  const cfHardest = cf?.hardestSolved ?? null;
  const cfLanguages = cf?.languageUsage ?? {};
  const cfBuckets = cf?.ratingBuckets ?? {};
  const cfRecent = cf?.recentAccepted ?? [];

  const cfCurrent = cfProfile?.rating ?? 0;
  const cfMax = cfProfile?.maxRating ?? 0;
  const cfRank = cfProfile?.rank ?? '—';
  const cfContestHistory = cfContests?.history ?? [];
  const cfColor = getCfColor(cfCurrent);

  const cfHistoryValues = cfContestHistory.map((item: AnyObj) => item.newRating as number);

  const languageItems = Object.entries(cfLanguages)
    .map(([label, value]) => ({ label, value: Number(value) || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const bucketItems = Object.entries(cfBuckets)
    .map(([label, value]) => ({ label: `${label}`, value: Number(value) || 0 }))
    .sort((a, b) => Number(a.label) - Number(b.label))
    .slice(0, 10);

  const recentAccepted = Array.isArray(cfRecent) ? cfRecent.slice(0, 5) : [];

  const cfSolved = cfStats?.solved ?? 0;
  const cfSubmissions = cfStats?.submissions ?? 0;
  const cfAccepted = cfStats?.accepted ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-[#f0f0f0]">
      <Cursor />
      {vinland ? <VinlandEasterEgg onClose={() => setVinland(false)} /> : null}

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelect={handleCmd}
        onVinland={() => {
          setVinland(true);
          playSound('vinland');
          setCmdOpen(false);
        }}
      />

      <Navbar
        onCmd={() => {
          setCmdOpen(true);
          playSound('open');
        }}
        playSound={playSound}
      />

      <main className="flex-1 w-full px-5 pb-20 pt-24 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <button
            onClick={() => {
              router.push('/');
              playSound('click');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#22d3ee';
              playSound('hover');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#555';
            }}
            className="mb-10 inline-flex items-center gap-2 border-0 bg-transparent p-0 font-mono text-sm text-[#555] transition-colors"
          >
            ← Back
          </button>

          <section className="mb-10">
            <SectionTitle
              eyebrow="Competitive Programming"
              title="A live snapshot of my solving profile."
              description="A compact but expressive view of LeetCode and Codeforces — ratings, solved counts, difficulty spread, contest history, language usage, and recent accepted submissions."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="LeetCode solved"
                value={String(lcSolvedTotal)}
                accent="#22d3ee"
                subtext="total problems"
              />
              <MetricCard
                label="LeetCode contest rating"
                value={lcContestRating ? String(Math.round(lcContestRating)) : '—'}
                accent="#f59e0b"
                subtext="contest profile"
              />
              <MetricCard
                label="Codeforces rating"
                value={String(cfCurrent || '—')}
                accent={cfColor}
                subtext={cfRank}
              />
              <MetricCard
                label="Codeforces contests"
                value={String(cfContests?.total ?? 0)}
                accent="#4ade80"
                subtext="rating history count"
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Card className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/50">
                      LeetCode
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">Solved by difficulty</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                    live
                  </div>
                </div>

                {!lcProfile ? (
                  <div className="mt-8 text-sm font-mono text-white/50">loading...</div>
                ) : (
                  <>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <MetricCard
                        label="Ranking"
                        value={lcProfile?.ranking ? formatNum(lcProfile.ranking) : '—'}
                        accent="#c084fc"
                        subtext="global position"
                      />
                      <MetricCard
                        label="Contests attended"
                        value={formatNum(lcAttended)}
                        accent="#4ade80"
                        subtext={
                          lcTopPercentage !== null && lcTopPercentage !== undefined
                            ? `top ${formatPct(lcTopPercentage)}`
                            : 'contest history'
                        }
                      />
                    </div>

                    <div className="mt-6 space-y-5">
                      <ProgressRow
                        label="Easy"
                        solved={lcEasy}
                        total={lcEasyTotal}
                        color={getLcTone('Easy')}
                      />
                      <ProgressRow
                        label="Medium"
                        solved={lcMedium}
                        total={lcMediumTotal}
                        color={getLcTone('Medium')}
                      />
                      <ProgressRow
                        label="Hard"
                        solved={lcHard}
                        total={lcHardTotal}
                        color={getLcTone('Hard')}
                      />
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/8 bg-black/25 p-4">
                      <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-white/100">
                        Coverage
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs font-mono text-white/35">
                        <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                          <div className="text-white/18">Solved</div>
                          <div className="mt-2 text-lg text-cyan-300">{formatNum(lcSolvedTotal)}</div>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                          <div className="text-white/18">Easy%</div>
                          <div className="mt-2 text-lg text-amber-300">
                            {lcEasyTotal ? formatPct((lcEasy / lcEasyTotal) * 100) : '—'}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                          <div className="text-white/18">Hard%</div>
                          <div className="mt-2 text-lg text-rose-300">
                            {lcHardTotal ? formatPct((lcHard / lcHardTotal) * 100) : '—'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <LinkLine
                        href={`https://leetcode.com/u/${CONFIG.social.leetcode}`}
                        label={`askelad`}
                        playSound={playSound}
                      />
                    </div>
                  </>
                )}
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/22">
                      Codeforces
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">Rating journey</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                    ranked
                  </div>
                </div>

                {!cfProfile ? (
                  <div className="mt-8 text-sm font-mono text-white/25">loading...</div>
                ) : (
                  <>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <MetricCard
                        label="Current rating"
                        value={String(cfCurrent)}
                        accent={cfColor}
                        subtext={cfRank}
                      />
                      <MetricCard
                        label="Max rating"
                        value={String(cfMax)}
                        accent="#a3a3a3"
                        subtext="best peak"
                      />
                      <MetricCard
                        label="Solved problems"
                        value={formatNum(cfSolved)}
                        accent="#22d3ee"
                        subtext="unique ACs"
                      />
                      <MetricCard
                        label="Submissions"
                        value={formatNum(cfSubmissions)}
                        accent="#4ade80"
                        subtext={`${formatNum(cfAccepted)} accepted`}
                      />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                      <div>
                        <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-white/20">
                          Language usage
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
                          <BarChart items={languageItems} color="#22d3ee" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-white/20">
                          Rating buckets
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
                          <BarChart items={bucketItems} color={cfColor} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                    </div>

                    <div className="mt-8 flex justify-end">
                      <LinkLine
                        href={`https://codeforces.com/profile/${CONFIG.social.codeforces}`}
                        label={`${CONFIG.social.codeforces}`}
                        playSound={playSound}
                      />
                    </div>
                  </>
                )}
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}