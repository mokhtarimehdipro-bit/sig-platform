'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import { api, type Chapter, type QCMQuestion } from '@/lib/gas'
import Header from '@/components/Header'
import MCQEngine from '@/components/MCQEngine'

type View = 'chapters' | 'loading' | 'engine'

export default function QCMPage() {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  const [view, setView] = useState<View>('chapters')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selected, setSelected] = useState<Chapter | null>(null)
  const [questions, setQuestions] = useState<QCMQuestion[]>([])
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!session) { router.replace('/'); return }
    api.getChapters()
      .then(d => setChapters(d.chapters))
      .catch(e => setFetchError(e.message))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startChapter = async (ch: Chapter) => {
    setSelected(ch)
    setView('loading')
    setFetchError('')
    try {
      const d = await api.getQCM(ch.chapter_id)
      if (d.questions.length === 0) {
        setFetchError('Aucune question disponible pour ce chapitre.')
        setView('chapters')
        return
      }
      setQuestions(d.questions)
      setView('engine')
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : 'Erreur')
      setView('chapters')
    }
  }

  const backToChapters = () => {
    setView('chapters')
    setSelected(null)
    setQuestions([])
    setFetchError('')
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Header prenom={session.prenom} nom={session.nom} scoreTotal={session.scoreTotal} />

      <main className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {view === 'chapters' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#e5e3f0]">QCM par chapitre</h1>
              <p className="text-[#7a7891] text-sm mt-1">Sélectionnez un chapitre pour démarrer l&apos;évaluation</p>
            </div>

            {fetchError && (
              <div className="card p-4 mb-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm">⚠ {fetchError}</div>
            )}

            <div className="space-y-2">
              {chapters.length === 0 && !fetchError && (
                <div className="card p-8 text-center text-[#4a4860] text-sm">Chargement des chapitres…</div>
              )}
              {chapters.map((ch, i) => (
                <button
                  key={ch.chapter_id}
                  onClick={() => startChapter(ch)}
                  className="w-full text-left card p-4 hover:border-[#c9a84c]/30 hover:bg-[#1a1a25] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-[#1a1a25] group-hover:bg-[#c9a84c]/10 text-[#c9a84c] font-bold rounded-xl text-sm flex-shrink-0 transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e5e3f0] truncate">{ch.titre}</p>
                    </div>
                    <span className="text-[#c9a84c] text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-[#7a7891]">
            <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
            <p className="text-sm">Chargement des questions…</p>
          </div>
        )}

        {view === 'engine' && selected && (
          <MCQEngine
            chapter={selected}
            questions={questions}
            accessCode={session.access_code}
            onBack={backToChapters}
          />
        )}
      </main>
    </div>
  )
}
