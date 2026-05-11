'use client'

import { useRef, useState } from 'react'
import { api, type RedactionQuestion } from '@/lib/gas'

interface Props {
  question: RedactionQuestion
  accessCode: string
  onBack: () => void
}

interface Feedback {
  note: number
  feedback: string
  imageUrl: string | null
}

export default function RedactionModule({ question, accessCode, onBack }: Props) {
  const [answer, setAnswer] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result as string)
      reader.onerror = rej
      reader.readAsDataURL(file)
    })

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    setError('')
    setFeedback(null)

    try {
      let base64 = ''
      let mime = ''
      if (imageFile) {
        const full = await fileToBase64(imageFile)
        // Retirer le préfixe data:image/...;base64,
        base64 = full.replace(/^data:[^;]+;base64,/, '')
        mime = imageFile.type
      }

      const result = await api.submitRedaction({
        access_code:      accessCode,
        redaction_id:     question.redaction_id,
        reponse_etudiant: answer.trim(),
        chapter_id:       question.chapter_id,
        ...(base64 ? { image_base64: base64, image_mime: mime } : {}),
      })

      setFeedback({ note: result.note, feedback: result.feedback, imageUrl: result.imageUrl })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la correction')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFeedback(null)
    setError('')
    setAnswer('')
    removeImage()
  }

  const noteColor = (n: number) =>
    n >= 14 ? 'text-emerald-400' : n >= 10 ? 'text-amber-400' : 'text-red-400'
  const noteBg = (n: number) =>
    n >= 14 ? 'border-emerald-500/20 bg-emerald-500/5' : n >= 10 ? 'border-amber-500/20 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5'

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Sujet */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-xs text-[#7a7891] hover:text-[#c9a84c] transition-colors">← Retour</button>
          <span className="badge-gold">Rédaction IA</span>
        </div>

        {question.mise_en_situation && (
          <div className="bg-[#1a1a25] border border-[#252535] rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-[#7a7891] uppercase tracking-widest mb-2">Mise en situation</p>
            <p className="text-sm text-[#e5e3f0] leading-relaxed">{question.mise_en_situation}</p>
          </div>
        )}

        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Question</p>
          <p className="text-sm text-[#e5e3f0] leading-relaxed">{question.question}</p>
        </div>
      </div>

      {/* Zone de réponse */}
      {!feedback && (
        <div className="card p-6 space-y-4">
          <div>
            <label className="label-dark">Votre réponse</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Rédigez votre réponse ici. Utilisez le vocabulaire technique : ERP, PGI, MCD, MER, SGBD, RGPD, processus métier, SI décisionnel…"
              className="w-full bg-[#0b0b0f] border border-[#252535] rounded-xl px-4 py-3 text-[#e5e3f0] placeholder-[#4a4860] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-colors text-sm resize-none"
              rows={10}
            />
            <p className="text-xs text-[#4a4860] mt-1">{answer.length} caractères</p>
          </div>

          {/* Upload image */}
          <div>
            <label className="label-dark">Visuel joint (facultatif)</label>
            <p className="text-xs text-[#4a4860] mb-3">Joignez un schéma, MCD, diagramme de flux, etc. (JPG, PNG, max 5 Mo)</p>

            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Aperçu" className="max-h-40 rounded-xl border border-[#252535] object-contain" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
                <p className="text-xs text-[#7a7891] mt-1">{imageFile?.name}</p>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-[#252535] rounded-xl p-6 text-center hover:border-[#c9a84c]/30 hover:bg-[#c9a84c]/5 transition-all group"
              >
                <p className="text-2xl mb-1">🖼</p>
                <p className="text-xs text-[#7a7891] group-hover:text-[#c9a84c] transition-colors">Cliquer pour ajouter un visuel</p>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onBack} className="btn-ghost px-4 py-3 text-sm">← Retour</button>
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="btn-gold flex-1 py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Correction Gemini en cours…
                </span>
              ) : 'Soumettre pour correction IA →'}
            </button>
          </div>
        </div>
      )}

      {/* Feedback IA */}
      {feedback && (
        <div className="space-y-4 animate-slide-up">
          {/* Note */}
          <div className={`card p-8 text-center border ${noteBg(feedback.note)}`}>
            <p className="text-xs text-[#7a7891] uppercase tracking-widest mb-3">Note attribuée par Gemini</p>
            <p className={`text-6xl font-bold ${noteColor(feedback.note)}`}>
              {feedback.note}
              <span className="text-2xl text-[#4a4860]">/20</span>
            </p>
            {feedback.note >= 14 && <p className="text-emerald-400 text-sm mt-2">Très bien maîtrisé</p>}
            {feedback.note >= 10 && feedback.note < 14 && <p className="text-amber-400 text-sm mt-2">Des progrès à faire</p>}
            {feedback.note < 10 && <p className="text-red-400 text-sm mt-2">À retravailler</p>}
          </div>

          {/* Feedback texte */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-[#e5e3f0] mb-3 flex items-center gap-2">
              <span className="text-[#c9a84c]">✦</span> Correction détaillée
            </h3>
            <div className="text-sm text-[#7a7891] leading-relaxed whitespace-pre-wrap">
              {feedback.feedback}
            </div>
          </div>

          {feedback.imageUrl && (
            <div className="card p-4">
              <p className="text-xs text-[#7a7891] mb-2">Visuel enregistré sur Drive :</p>
              <a
                href={feedback.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#c9a84c] hover:underline break-all"
              >
                {feedback.imageUrl}
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={reset} className="btn-gold py-3 text-sm">Nouvelle tentative</button>
            <button onClick={onBack} className="btn-ghost py-3 text-sm">← Autre sujet</button>
          </div>
        </div>
      )}
    </div>
  )
}
