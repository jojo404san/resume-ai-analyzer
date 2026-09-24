'use client'

import { useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, FileText, Lightbulb, Loader2, Sparkles, Target, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Analysis = { match: number; matching: string[]; missing: string[]; strengths: string[]; recommendations: string[] }
const mockAnalysis: Analysis = { match: 78, matching: ['Figma', 'Design systems', 'Product strategy', 'User experience', 'Prototyping', 'Agile / Scrum'], missing: ['SQL basics', 'A/B testing', 'User research'], strengths: ['Clear product ownership across 3 shipped launches', 'Strong design systems and prototyping experience', 'Cross-functional collaboration with engineering teams'], recommendations: ['Add one quantified outcome for each recent project', 'Highlight any research methods or customer interviews', 'Build familiarity with SQL and experimentation metrics'] }

export function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFile(nextFile?: File) { if (!nextFile) return; setError(''); if (nextFile.type !== 'application/pdf') { setError('Please choose a PDF file.'); return } if (nextFile.size > 10 * 1024 * 1024) { setError('Your PDF must be smaller than 10 MB.'); return } setFile(nextFile); setAnalysis(null) }
  async function analyze() {
  if (!file || !jobDescription.trim()) {
    setError('Add a PDF resume and paste the job description to continue.')
    return
  }

  setError('')
  setLoading(true)
  setAnalysis(null)

  try {
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    const result: Analysis = await response.json()

    setAnalysis(result)
  } catch (error) {
    console.error(error)
    setError(
      'Could not connect to the AI analysis server. Make sure the Python backend is running.'
    )
  } finally {
    setLoading(false)
  }
}

  return <main className="min-h-screen bg-background"><header className="border-b bg-card/80"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10"><Link href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><span className="text-lg">Resume<span className="text-primary">AI</span></span></Link><Link href="/" className="text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 inline size-4" />Back home</Link></div></header><div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14"><div className="mb-10"><p className="text-sm font-semibold uppercase tracking-widest text-primary">Resume analyzer</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Find your edge for the role.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Upload your resume and paste a job description. We&apos;ll surface the signal that matters most.</p></div><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><section className="rounded-2xl border bg-card p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Your inputs</h2><p className="mt-1 text-sm text-muted-foreground">Everything stays in your browser for this demo.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Step 1 of 2</span></div><div className="mt-7"><label className="text-sm font-medium" htmlFor="resume-upload">Resume PDF</label>{file ? <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><FileText className="size-5 text-emerald-600" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-emerald-950">{file.name}</p><p className="text-xs text-emerald-700">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</p></div><button aria-label="Remove resume" onClick={() => setFile(null)} className="text-emerald-700 hover:text-emerald-950"><X className="size-4" /></button></div> : <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary hover:bg-primary/5"><span className="flex size-11 items-center justify-center rounded-xl bg-card text-primary shadow-sm"><Upload className="size-5" /></span><span className="mt-3 text-sm font-medium">Drop your resume here or browse</span><span className="mt-1 text-xs text-muted-foreground">PDF only · Max 10 MB</span></button>}<input ref={inputRef} id="resume-upload" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} /></div><div className="mt-7"><label className="text-sm font-medium" htmlFor="job-description">Job description</label><textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description you&apos;re applying for..." className="mt-2 min-h-52 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" /><p className="mt-2 text-right text-xs text-muted-foreground">{jobDescription.length} characters</p></div>{error && <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div>}<Button className="mt-6 w-full" size="lg" onClick={analyze} disabled={loading}>{loading ? <><Loader2 data-icon="inline-start" className="animate-spin" />Analyzing your fit...</> : <>Analyze resume <Target data-icon="inline-end" /></>}</Button></section><section className="min-h-[540px] rounded-2xl border bg-card p-6 shadow-sm lg:p-8">{loading ? <LoadingState /> : analysis ? <Results analysis={analysis} /> : <EmptyState />}</section></div></div></main>
}

function EmptyState() { return <div className="flex min-h-[500px] flex-col items-center justify-center text-center"><div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Target className="size-7" /></div><h2 className="mt-5 text-xl font-semibold">Your insights will appear here</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Add your resume and a target job description to see your match score, strengths, and next steps.</p><div className="mt-7 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground"><span className="rounded-full bg-muted px-3 py-1.5">Match score</span><span className="rounded-full bg-muted px-3 py-1.5">Skills gap</span><span className="rounded-full bg-muted px-3 py-1.5">Recommendations</span></div></div> }
function LoadingState() { return <div className="flex min-h-[500px] flex-col items-center justify-center text-center"><Loader2 className="size-9 animate-spin text-primary" /><h2 className="mt-5 text-xl font-semibold">Reading your profile...</h2><p className="mt-2 text-sm text-muted-foreground">Comparing your experience to the role requirements.</p></div> }
function Results({ analysis }: { analysis: Analysis }) { return <div><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-medium text-emerald-600"><CheckCircle2 className="size-4" /> Analysis complete</div><h2 className="mt-2 text-2xl font-semibold">Your match report</h2><p className="mt-1 text-sm text-muted-foreground">A practical snapshot of your fit for this role.</p></div><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">Strong match</span></div><div className="mt-7 flex items-center gap-6 rounded-2xl bg-muted/50 p-5"><div className="relative flex size-28 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#4f46e5 0 ${analysis.match}%, #e2e8f0 ${analysis.match}% 100%)` }}><div className="flex size-20 flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-semibold">{analysis.match}%</span><span className="text-[10px] text-muted-foreground">job match</span></div></div><div><p className="font-semibold">You&apos;re on the right track</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Your background covers the core of this role. Close a few targeted gaps to stand out.</p></div></div><ResultGroup title="Matching skills" icon={<CheckCircle2 className="size-4 text-emerald-600" />} items={analysis.matching} tone="good" /><ResultGroup title="Skills to strengthen" icon={<Target className="size-4 text-amber-600" />} items={analysis.missing} tone="warn" /><div className="mt-8 grid gap-6 md:grid-cols-2"><div><h3 className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> Resume strengths</h3><ul className="mt-3 flex flex-col gap-3">{analysis.strengths.map((item) => <li key={item} className="text-sm leading-5 text-muted-foreground">{item}</li>)}</ul></div><div><h3 className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="size-4 text-amber-600" /> Recommendations</h3><ul className="mt-3 flex flex-col gap-3">{analysis.recommendations.map((item) => <li key={item} className="text-sm leading-5 text-muted-foreground">{item}</li>)}</ul></div></div></div> }
function ResultGroup({ title, icon, items, tone }: { title: string; icon: React.ReactNode; items: string[]; tone: 'good' | 'warn' }) { return <div className="mt-7"><h3 className="flex items-center gap-2 text-sm font-semibold">{icon}{title}<span className="ml-auto text-xs font-normal text-muted-foreground">{items.length} skills</span></h3><div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className={tone === 'good' ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700' : 'rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700'}>{item}</span>)}</div></div> }
