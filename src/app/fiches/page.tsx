'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import { api, type ScoresResponse, type Fiche } from '@/lib/gas'
import Header from '@/components/Header'
import FicheCard from '@/components/FicheCard'

interface ChapterStatus {
  chapter_id: string
  titre: string
  qcmDone: boolean
  redacDone: boolean
}

type OpenKey = `${string}-${'qcm' | 'redaction'}`

function chapterFromRedacId(id: string): string {
  const m = id.match(/^RED(\d+)_/)
  return m ? `CH${m[1]}` : ''
}

export default function FichesPage() {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  const [chapters, setChapters] = useState<ChapterStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [openKey, setOpenKey] = useState<OpenKey | null>(null)
  const [ficheData, setFicheData] = useState<Fiche | null>(null)
  const [ficheLoading, setFicheLoading] = useState(false)

  useEffect(() => {
    if (!session) { router.replace('/'); return }
    api.getScores(session.access_code)
      .then((data: ScoresResponse) => {
        const qcmDoneSet = new Set(data.qcm.map(q => q.chapter_id))
        const redacDoneSet = new Set(
          data.redaction.map(r => chapterFromRedacId(r.redaction_id)).filter(Boolean)
        )
        setChapters(data.chapters.map(ch => ({
          chapter_id:  ch.chapter_id,
          titre:       ch.titre,
          qcmDone:     qcmDoneSet.has(ch.chapter_id),
          redacDone:   redacDoneSet.has(ch.chapter_id),
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return null

  const handleOpen = (chapterId: string, type: 'qcm' | 'redaction') => {
    const key: OpenKey = `${chapterId}-${type}`
    if (openKey === key) { setOpenKey(null); setFicheData(null); return }
    setOpenKey(key)
    setFicheData(null)
    setFicheLoading(true)
    api.getFiches(chapterId, type)
      .then(d => setFicheData(d.fiches[0] ?? null))
      .catch(() => setFicheData(null))
      .finally(() => setFicheLoading(false))
  }

  const done = chapters.filter(c => c.qcmDone || c.redacDone).length

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Header prenom={session.prenom} nom={session.nom} scoreTotal={session.scoreTotal} />

      <main className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#e5e3f0]">Mes fiches de révision</h1>
          <p className="text-[#7a7891] text-sm mt-1">
            {loading ? 'Chargement…' : `${done} chapitre(s) débloqué(s) sur ${chapters.length} — terminez un QCM ou une rédaction pour débloquer la fiche`}
          </p>
        </div>

        {loading ? (
          <div className="card p-10 text-center text-[#4a4860] text-sm">Chargement de votre progression…</div>
        ) : (
          <div className="space-y-3">
            {chapters.map((ch, i) => {
              const qcmKey: OpenKey   = `${ch.chapter_id}-qcm`
              const redacKey: OpenKey = `${ch.chapter_id}-redaction`
              const qcmOpen   = openKey === qcmKey
              const redacOpen = openKey === redacKey

              return (
                <div key={ch.chapter_id} className="card overflow-hidden">
                  {/* Ligne chapitre */}
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#1a1a25] text-[#c9a84c] font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-sm font-medium text-[#e5e3f0] min-w-0 truncate">{ch.titre}</p>
                    <div className="flex gap-2 flex-shrink-0">
                      <FicheButton
                        label="QCM"
                        done={ch.qcmDone}
                        open={qcmOpen}
                        onClick={() => ch.qcmDone && handleOpen(ch.chapter_id, 'qcm')}
                        locked={!ch.qcmDone}
                      />
                      <FicheButton
                        label="Rédac"
                        done={ch.redacDone}
                        open={redacOpen}
                        onClick={() => ch.redacDone && handleOpen(ch.chapter_id, 'redaction')}
                        locked={!ch.redacDone}
                        purple
                      />
                    </div>
                  </div>

                  {/* Fiche expansée */}
                  {(qcmOpen || redacOpen) && (
                    <div className="border-t border-[#252535]">
                      {ficheLoading ? (
                        <div className="flex justify-center py-10">
                          <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin"/>
                        </div>
                      ) : ficheData ? (
                        <FicheCard fiche={ficheData} />
                      ) : (
                        <p className="text-center text-[#4a4860] text-sm py-8">Fiche non disponible — relancez initData() dans Apps Script</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function FicheButton({
  label, done, open, onClick, locked, purple,
}: {
  label: string; done: boolean; open: boolean; onClick: () => void; locked: boolean; purple?: boolean
}) {
  const gold = !purple
  if (locked) {
    return (
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0b0b0f] border border-[#252535] text-[#4a4860] text-[10px] cursor-not-allowed select-none">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        {label}
      </div>
    )
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
        open
          ? gold
            ? 'bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]'
            : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
          : gold
            ? 'bg-[#c9a84c]/10 border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/15'
            : 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/15'
      }`}
    >
      <span>{open ? '▲' : '▼'}</span>
      {label}
    </button>
  )
}
