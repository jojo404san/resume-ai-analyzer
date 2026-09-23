'use client'

import Link from 'next/link'
import { ArrowRight, Check, FileSearch, Gauge, Sparkles, Target, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: FileSearch, title: 'Resume intelligence', description: 'Turn your resume into a clear, skills-first profile recruiters can understand.' },
  { icon: Target, title: 'Role alignment', description: 'See exactly where your experience maps to the job you want next.' },
  { icon: Gauge, title: 'Actionable gaps', description: 'Get focused recommendations for the skills that will move the needle.' },
]

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
          <span className="text-lg">Resume<span className="text-primary">AI</span></span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <Link href="/analyzer" className="text-foreground">Open analyzer <ArrowRight className="ml-1 inline size-3" /></Link>
        </div>
        <Button asChild size="sm"><Link href="/analyzer">Try it free <ArrowRight data-icon="inline-end" /></Link></Button>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute -left-48 -top-40 size-[38rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"><span className="size-1.5 rounded-full bg-emerald-500" /> Built for your next opportunity</div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">Know your fit.<br /><span className="text-primary">Close the gap.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">ResumeAI helps you understand how your experience matches the role you want — and what to do next to become the strongest candidate.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/analyzer">Analyze my resume <ArrowRight data-icon="inline-end" /></Link></Button><Button asChild size="lg" variant="outline"><a href="#how-it-works">See how it works</a></Button></div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> No account required</span><span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> Your resume stays private</span></div>
        </div>
        <div className="relative rounded-3xl border bg-card p-3 shadow-2xl shadow-primary/10">
          <div className="rounded-2xl bg-muted/40 p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Sample analysis</p><p className="mt-2 text-lg font-semibold">Product Designer</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Strong match</span></div>
            <div className="mt-7 flex items-center gap-6"><div className="relative flex size-32 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#4f46e5 0 78%, #e2e8f0 78% 100%)' }}><div className="flex size-24 flex-col items-center justify-center rounded-full bg-card"><span className="text-3xl font-semibold">78%</span><span className="text-[10px] text-muted-foreground">job match</span></div></div><div className="flex-1"><div className="mb-4 flex items-center justify-between text-sm"><span className="text-muted-foreground">Skills matched</span><span className="font-semibold">11 of 14</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[78%] rounded-full bg-primary" /></div><p className="mt-3 text-xs text-muted-foreground">Your profile is competitive for this role.</p></div></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Top strengths</p><p className="mt-2 text-sm font-medium">Product strategy</p><p className="text-sm font-medium">Design systems</p></div><div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Focus next</p><p className="mt-2 text-sm font-medium">User research</p><p className="text-sm font-medium">SQL basics</p></div></div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y bg-card/50"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3 lg:px-10">{features.map(({ icon: Icon, title, description }) => <div key={title} className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div></div>)}</div></section>
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10"><p className="text-sm font-semibold uppercase tracking-widest text-primary">A clearer next step</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">From application anxiety to an actionable plan.</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Upload your resume, paste a job description, and get a practical view of your fit in seconds.</p><Button asChild className="mt-8"><Link href="/analyzer">Start your analysis <Upload data-icon="inline-end" /></Link></Button></section>
    </main>
  )
}
