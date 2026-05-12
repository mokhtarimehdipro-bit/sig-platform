'use client'

import { type Fiche } from '@/lib/gas'
import ChapterSchema from '@/components/ChapterSchema'

interface Props {
  fiche: Fiche
  onClose?: () => void
}

export default function FicheCard({ fiche, onClose }: Props) {
  const isRedac = fiche.fiche_type === 'redaction'

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* En-tête */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-[#252535] bg-gradient-to-r from-[#c9a84c]/10 to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">{fiche.chapter_id}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
              isRedac
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                : 'bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/20'
            }`}>
              {isRedac ? 'Rédaction' : 'QCM'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#e5e3f0] leading-snug">{fiche.titre_court}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4a4860] hover:text-[#e5e3f0] hover:bg-[#252535] transition-all flex-shrink-0 ml-3 text-lg leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        )}
      </div>

      {/* Notions clés / Méthode */}
      <div className="px-5 py-4 border-b border-[#252535]/50">
        <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
          {isRedac ? 'Méthode de réponse' : 'Notions clés'}
        </p>
        <ol className={`space-y-2 ${isRedac ? 'list-none' : ''}`}>
          {fiche.notions_cles.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#e5e3f0]">
              <span className={`flex-shrink-0 font-bold mt-0.5 ${isRedac ? 'text-[#7a7891] text-[10px] mt-1' : 'text-[#c9a84c]'}`}>
                {isRedac ? `${i + 1}.` : '·'}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Syntaxe / Mots clés attendus */}
      {fiche.formules.length > 0 && (
        <div className="px-5 py-4 border-b border-[#252535]/50">
          <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
            {isRedac ? 'Mots clés attendus à l\'examen' : 'Syntaxe / Formules'}
          </p>
          {isRedac ? (
            <div className="flex flex-wrap gap-1.5">
              {fiche.formules.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg font-mono">
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {fiche.formules.map((f, i) => (
                <code key={i} className="block text-xs bg-[#0b0b0f] text-[#c9a84c] px-3 py-2 rounded-lg font-mono break-all leading-relaxed">
                  {f}
                </code>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schéma visuel — QCM uniquement */}
      <ChapterSchema chapter_id={fiche.chapter_id} fiche_type={fiche.fiche_type} />

      {/* À retenir */}
      <div className="px-5 py-4 border-b border-[#252535]/50 border-t border-[#252535]/50">
        <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-2">
          {isRedac ? 'Structure type de réponse' : 'À retenir'}
        </p>
        <p className="text-sm text-[#e5e3f0] leading-relaxed">{fiche.a_retenir}</p>
      </div>

      {/* Piège examen */}
      <div className="px-5 py-4 bg-amber-500/5 border-t border-amber-500/10">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Piège examen</p>
        <p className="text-sm text-amber-200/80 leading-relaxed">{fiche.piege_examen}</p>
      </div>
    </div>
  )
}
