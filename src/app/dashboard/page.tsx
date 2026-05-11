'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSession, setSession } from '@/lib/session'
import { api, type ScoresResponse, type Chapter } from '@/lib/gas'
import Header from '@/components/Header'
import ScoreChart from '@/components/ScoreChart'

interface ChapterStat {
  chapter_id: string
  titre: string
  score: number | null
  date: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  const [stats, setStats] = useState<ChapterStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) { router.replace('/'); return }

    api.getScores(session.access_code)
      .then((data: ScoresResponse) => {
        const chapterStats: ChapterStat[] = data.chapters.map((ch: Chapter) => {
          const qScore = data.qcm.find(q => q.chapter_id === ch.chapter_id)
          return {
            chapter_id: ch.chapter_id,
            titre:      ch.titre,
            score:      qScore ? qScore.score : null,
            date:       qScore ? qScore.date : null,
          }
        })
        setStats(chapterStats)

        // Met à jour le score total en session
        const scores = chapterStats.filter(c => c.score !== null).map(c => c.score as number)
        if (scores.length > 0) {
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          setSession({ ...session, scoreTotal: avg })
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return null

  const evaluated = stats.filter(c => c.score !== null)
  const avgScore = evaluated.length > 0
    ? Math.round(evaluated.reduce((s, c) => s + (c.score ?? 0), 0) / evaluated.length)
    : null
  const critical = evaluated.filter(c => (c.score ?? 100) < 50)

  const scoreColor = (s: number) =>
    s >= 70 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'
  const barColor = (s: number) =>
    s >= 70 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Header prenom={session.prenom} nom={session.nom} scoreTotal={session.scoreTotal} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        {/* Bienvenue */}
        <div>
          <h1 className="text-2xl font-bold text-[#e5e3f0]">
            Bonjour, <span className="text-[#c9a84c]">{session.prenom}</span> !
          </h1>
          <p className="text-[#7a7891] text-sm mt-1">
            {loading ? 'Chargement de vos résultats…' :
             evaluated.length === 0 ? 'Démarrez un QCM pour voir votre progression.' :
             `${evaluated.length} chapitre(s) évalué(s) sur ${stats.length}`}
          </p>
        </div>

        {error && (
          <div className="card p-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Score moyen" value={avgScore !== null ? `${avgScore}%` : '—'} color="text-[#c9a84c]" />
          <StatCard label="Chapitres évalués" value={`${evaluated.length}/${stats.length}`} color="text-[#e5e3f0]" />
          <StatCard label="Points critiques" value={String(critical.length)} color={critical.length > 0 ? 'text-red-400' : 'text-emerald-400'} />
        </div>

        {/* Radar + Priorités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-[#e5e3f0] mb-4">Radar de compétences</h2>
            {evaluated.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-[#4a4860] text-sm text-center gap-2">
                <span className="text-3xl">📊</span>
                <p>Faites un QCM pour alimenter le radar</p>
              </div>
            ) : (
              <ScoreChart data={evaluated.map(c => ({ name: c.titre.substring(0, 20), score: c.score ?? 0 }))} />
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-[#e5e3f0] mb-4">Priorités de révision</h2>
            {critical.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-center py-12">
                {evaluated.length === 0
                  ? <p className="text-[#4a4860]">Aucune donnée disponible</p>
                  : <p className="text-emerald-400">Aucun chapitre critique — continuez !</p>}
              </div>
            ) : (
              <div className="space-y-3">
                {[...critical].sort((a, b) => (a.score ?? 0) - (b.score ?? 0)).map(ch => (
                  <div key={ch.chapter_id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                    <div>
                      <p className="text-sm font-medium text-[#e5e3f0]">{ch.titre}</p>
                      <p className="text-xs text-red-400 mt-0.5">Score : {ch.score}%</p>
                    </div>
                    <Link href="/qcm" className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Réviser
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tableau chapitres */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#e5e3f0]">Tous les chapitres</h2>
            <div className="flex gap-2">
              <Link href="/qcm" className="btn-gold text-xs px-4 py-2">QCM</Link>
              <Link href="/redaction" className="btn-ghost text-xs px-4 py-2">Rédaction</Link>
            </div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[#4a4860] text-sm">Chargement…</div>
          ) : (
            <div className="divide-y divide-[#252535]/50">
              {stats.map((ch, i) => (
                <div key={ch.chapter_id} className="flex items-center px-6 py-4 hover:bg-[#13131a] transition-colors gap-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a25] text-[#c9a84c] font-bold rounded-lg text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e5e3f0] truncate">{ch.titre}</p>
                  </div>
                  {ch.score !== null && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 progress-bar">
                        <div className={`progress-fill ${barColor(ch.score)}`} style={{ width: `${ch.score}%` }} />
                      </div>
                      <span className={`text-sm font-semibold w-10 text-right ${scoreColor(ch.score)}`}>
                        {ch.score}%
                      </span>
                    </div>
                  )}
                  <Link href="/qcm" className="btn-ghost flex-shrink-0 text-xs px-3 py-1.5">
                    {ch.score !== null ? 'Refaire' : 'Démarrer'}
                  </Link>
                </div>
              ))}
              {stats.length === 0 && !loading && (
                <div className="p-8 text-center text-[#4a4860] text-sm">
                  Aucun chapitre disponible — vérifiez l&apos;onglet Chapitres dans votre Google Sheet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-[#7a7891] uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
