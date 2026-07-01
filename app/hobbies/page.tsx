'use client';
import { PageShell } from '@/components/layout/PageShell';
import { Hobbies } from '@/components/sections/Hobbies';

export default function HobbiesPage() {
  return (
    <PageShell
      eyebrow="Outside work · Issue 01"
      title="Things I do when I&rsquo;m not at the keyboard."
      subtitle="A small magazine about the rest of life — boards, stages, books, and whatever else is currently keeping me curious."
      maxWidth={1080}
    >
      {({ playSound }) => <Hobbies playSound={playSound} />}
    </PageShell>
  );
}
