'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import { api, type Chapter, type RedactionQuestion } from '@/lib/gas'
import Header from '@/components/Header'
import RedactionModule from '@/components/RedactionModule'

type View = 'chapters' | 'questions' | 'engine'

export default function RedactionPage() {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  const [view, setView] = useState<View>('chapters')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [questions, setQuestions] = useState<RedactionQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<RedactionQuestion | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [loadingQs, setLoadingQs] = useState(false)

  useEffect(() => {
    if (!session) { router.replace('/'); return }
    api.getChapters()
      .then(d => setChapters(d.chapters))
      .catch(e => setFetchError(e.message))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectChapter = async (ch: Chapter) => {
    setSelectedChapter(ch)
    setLoadingQs(true)
    setFetchError('')
    try {
      const d = await api.getRedactions(ch.chapter_id)
      setQuestions(d.questions)
      setView('questions')
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoadingQs(false)
    }
  }

  const selectQuestion = (q: RedactionQuestion) => {
    setSelectedQuestion(q)
    setView('engine')
  }

  const backToChapters = () => {
    setView('chapters')
    setSelectedChapter(null)
    setQuestions([])
    setFetchError('')
  }

  const backToQuestions = () => {
    setView('questions')
    setSelectedQuestion(null)
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Header prenom={session.prenom} nom={session.nom} scoreTotal={session.scoreTotal} />

      <main className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-xs text-[#7a7891] mb-6">
          <button onClick={backToChapters} className={view !== 'chapters' ? 'hover:text-[#c9a84c] transition-colors' : 'text-[#c9a84c]'}>
            Chapitres
          </button>
          {view !== 'chapters' && selectedChapter && (
            <>
              <span>/</span>
              <button onClick={view === 'engine' ? backToQuestions : undefined} className={view === 'questions' ? 'text-[#c9a84c]' : 'hover:text-[#c9a84c] transition-colors'}>
                {selectedChapter.titre.substring(0, 30)}
              </button>
            </>
          )}
          {view === 'engine' && (
            <>
              <span>/</span>
              <span className="text-[#c9a84c]">Sujet</span>
            </>
          )}
        </div>

        {fetchError && (
          <div className="card p-4 mb-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm">⚠ {fetchError}</div>
        )}

        {/* Sélection chapitre */}
        {view === 'chapters' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#e5e3f0]">Simulateur Rédactionnel</h1>
              <p className="text-[#7a7891] text-sm mt-1">Choisissez un chapitre pour accéder aux sujets de rédaction avec correction MMOK</p>
            </div>
            <div className="space-y-2">
              {chapters.length === 0 && !fetchError && (
                <div className="card p-8 text-center text-[#4a4860] text-sm">Chargement…</div>
              )}
              {chapters.map((ch, i) => (
                <button
                  key={ch.chapter_id}
                  onClick={() => selectChapter(ch)}
                  disabled={loadingQs}
                  className="w-full text-left card p-4 hover:border-[#c9a84c]/30 hover:bg-[#1a1a25] transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-[#1a1a25] group-hover:bg-[#c9a84c]/10 text-[#c9a84c] font-bold rounded-xl text-sm flex-shrink-0 transition-colors">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-sm font-medium text-[#e5e3f0] text-left">{ch.titre}</p>
                    <span className="text-[#c9a84c] text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Liste des sujets */}
        {view === 'questions' && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <button onClick={backToChapters} className="btn-ghost text-xs px-3 py-2">← Retour</button>
              <h1 className="text-lg font-bold text-[#e5e3f0]">{selectedChapter?.titre}</h1>
            </div>
            {questions.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-3xl mb-3">✍</p>
                <p className="text-[#7a7891] text-sm">Aucune question de rédaction disponible pour ce chapitre.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <button
                    key={q.redaction_id}
                    onClick={() => selectQuestion(q)}
                    className="w-full text-left card p-5 hover:border-[#c9a84c]/30 hover:bg-[#1a1a25] transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a25] group-hover:bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-bold rounded-lg flex-shrink-0 transition-colors">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        {q.mise_en_situation && (
                          <p className="text-xs text-[#7a7891] mb-1 line-clamp-1">{q.mise_en_situation}</p>
                        )}
                        <p className="text-sm font-medium text-[#e5e3f0] line-clamp-2">{q.question}</p>
                      </div>
                      <span className="text-[#c9a84c] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Module de rédaction */}
        {view === 'engine' && selectedQuestion && (
          <RedactionModule
            question={selectedQuestion}
            accessCode={session.access_code}
            onBack={backToQuestions}
          />
        )}
      </main>
    </div>
  )
}
