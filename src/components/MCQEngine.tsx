'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api, type Chapter, type QCMQuestion, type Fiche } from '@/lib/gas'
import FicheCard from '@/components/FicheCard'

interface Props {
  chapter: Chapter
  questions: QCMQuestion[]
  accessCode: string
  onBack: () => void
}

type Phase = 'quiz' | 'saving' | 'results'

export default function MCQEngine({ chapter, questions, accessCode, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [phase, setPhase] = useState<Phase>('quiz')
  const [saveError, setSaveError] = useState('')
  const [ficheData, setFicheData] = useState<Fiche | null>(null)
  const [ficheLoading, setFicheLoading] = useState(false)
  const [ficheOpen, setFicheOpen] = useState(false)

  const current = questions[index]
  const isAnswered = selected !== null
  const progress = Math.round(((index + 1) / questions.length) * 100)

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelected(idx)
    const updated = [...answers]
    updated[index] = idx
    setAnswers(updated)
  }

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      setPhase('saving')
      setSaveError('')
      const correct = answers.filter((a, i) => a === questions[i].correct_answer).length
      const score = Math.round((correct / questions.length) * 100)
      try {
        await api.submitQCM(accessCode, chapter.chapter_id, score)
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde')
      }
      setPhase('results')
    }
  }

  const handleRestart = () => {
    setIndex(0)
    setAnswers(new Array(questions.length).fill(null))
    setSelected(null)
    setPhase('quiz')
    setSaveError('')
    setFicheOpen(false)
  }

  const handleToggleFiche = () => {
    if (!ficheData && !ficheLoading) {
      setFicheLoading(true)
      api.getFiches(chapter.chapter_id)
        .then(d => setFicheData(d.fiches[0] ?? null))
        .catch(() => {})
        .finally(() => setFicheLoading(false))
    }
    setFicheOpen(v => !v)
  }

  // ── RÉSULTATS ──
  if (phase === 'results' || (phase === 'saving' && index === questions.length - 1)) {
    const correct = answers.filter((a, i) => a === questions[i].correct_answer).length
    const pct = Math.round((correct / questions.length) * 100)
    const scoreColor = pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
    const scoreBg = pct >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : pct >= 50 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'
    const label = pct >= 70 ? 'Acquis' : pct >= 50 ? 'Partiellement acquis' : 'Non acquis — à réviser'

    return (
      <div className="space-y-5 animate-fade-in">
        {/* Score global */}
        <div className={`card p-8 text-center border ${scoreBg}`}>
          {phase === 'saving' && (
            <div className="flex justify-center mb-4">
              <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
            </div>
          )}
          <p className="text-xs text-[#7a7891] uppercase tracking-widest mb-2">{chapter.titre}</p>
          <p className={`text-5xl font-bold ${scoreColor}`}>{pct}<span className="text-2xl text-[#4a4860]">%</span></p>
          <p className="text-[#7a7891] text-sm mt-1">{correct}/{questions.length} bonnes réponses</p>
          <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${scoreColor} ${scoreBg} border`}>
            {label}
          </span>
          {saveError && <p className="text-red-400 text-xs mt-3">⚠ {saveError}</p>}
        </div>

        {/* Fiche résumé du chapitre */}
        <div className="card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[#e5e3f0] hover:bg-[#13131a] transition-colors"
            onClick={handleToggleFiche}
          >
            <span className="flex items-center gap-2 text-[#c9a84c]">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Fiche résumé du chapitre</span>
            </span>
            <span className={`text-[#7a7891] text-xs transition-transform duration-200 ${ficheOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {ficheOpen && (
            <div className="border-t border-[#252535]">
              {ficheLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                </div>
              ) : ficheData ? (
                <FicheCard fiche={ficheData} />
              ) : (
                <p className="text-center text-[#4a4860] text-sm py-6">Fiche non disponible pour ce chapitre</p>
              )}
            </div>
          )}
        </div>

        {/* Correction détaillée */}
        <div className="space-y-3">
          {questions.map((q, i) => {
            const ua = answers[i]
            const ok = ua === q.correct_answer
            return (
              <div key={q.qcm_id} className={`card p-5 border ${ok ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5 flex-shrink-0">{ok ? '✓' : '✗'}</span>
                  <div className="flex-1">
                    {q.notion && <p className="text-xs text-[#7a7891] mb-1 uppercase tracking-wide">{q.notion}</p>}
                    <p className="text-sm font-medium text-[#e5e3f0] mb-3">{q.question}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className={`px-3 py-2 rounded-lg text-sm ${
                          idx === q.correct_answer
                            ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                            : idx === ua && !ok
                            ? 'bg-red-500/10 text-red-400'
                            : 'text-[#4a4860]'
                        }`}>
                          <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                    {q.explication && (
                      <div className="mt-3 p-3 bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-xl text-xs text-[#c9a84c]">
                        💡 {q.explication}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleRestart} className="btn-gold py-3 text-sm">Recommencer</button>
          <button onClick={onBack} className="btn-ghost py-3 text-sm">← Chapitres</button>
        </div>
        <Link href="/dashboard" className="block text-center text-xs text-[#7a7891] hover:text-[#c9a84c] transition-colors">
          Voir le tableau de bord
        </Link>
      </div>
    )
  }

  // ── QUIZ ──
  const optionClass = (idx: number) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 '
    if (!isAnswered) return base + 'border-[#252535] hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 text-[#e5e3f0] cursor-pointer'
    if (idx === current.correct_answer) return base + 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium'
    if (idx === selected) return base + 'border-red-500/40 bg-red-500/10 text-red-400'
    return base + 'border-[#1a1a1a] text-[#4a4860]'
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* En-tête + progression */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-xs text-[#7a7891] hover:text-[#c9a84c] transition-colors">← Retour</button>
          <span className="badge-gold">{index + 1}/{questions.length}</span>
        </div>
        <p className="text-xs text-[#7a7891] mb-2 truncate">{chapter.titre}</p>
        <div className="progress-bar">
          <div className="progress-fill bg-[#c9a84c]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card p-6">
        {current.notion && (
          <span className="inline-block badge-gold mb-3">{current.notion}</span>
        )}
        <p className="text-[#e5e3f0] font-medium leading-relaxed mb-6 text-sm">{current.question}</p>

        <div className="space-y-2.5">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={optionClass(idx)}
            >
              <span className="font-bold mr-2 text-[#4a4860]">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>

        {isAnswered && current.explication && (
          <div className="mt-4 p-4 bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-xl text-sm text-[#c9a84c]">
            <span className="font-semibold">💡 </span>{current.explication}
          </div>
        )}
      </div>

      {isAnswered && (
        <button
          onClick={handleNext}
          className="btn-gold w-full py-3 text-sm"
        >
          {index < questions.length - 1 ? 'Question suivante →' : 'Voir les résultats →'}
        </button>
      )}
    </div>
  )
}
