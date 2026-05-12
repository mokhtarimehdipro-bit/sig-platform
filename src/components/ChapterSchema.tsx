'use client'

interface SchemaProps { chapter_id: string; fiche_type: 'qcm' | 'redaction' }

export default function ChapterSchema({ chapter_id, fiche_type }: SchemaProps) {
  if (fiche_type === 'redaction') return null
  switch (chapter_id) {
    case 'CH03': return <SchemaSER />
    case 'CH05': return <SchemaRelationnel />
    case 'CH06': return <SchemaSQL />
    case 'CH07': return <SchemaRecherchev />
    case 'CH08': return <SchemaTCD />
    default: return null
  }
}

// ── CH03 · Schéma Événement-Résultat ────────────────────────────────────────

function SchemaSER() {
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
        Schéma Événement-Résultat (SER) — Structure type
      </p>
      <svg viewBox="0 0 300 330" className="w-full max-w-xs mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Événement déclencheur */}
        <rect x="75" y="8" width="150" height="42" rx="21" stroke="#60a5fa" strokeWidth="1.5" fill="#1e3a5f"/>
        <text x="150" y="24" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="sans-serif" fontWeight="bold">ÉVÉNEMENT DÉCLENCHEUR</text>
        <text x="150" y="39" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontFamily="sans-serif">Commande client reçue</text>

        {/* Flèche */}
        <line x1="150" y1="50" x2="150" y2="76" stroke="#4a4860" strokeWidth="1.5"/>
        <polygon points="144,73 150,83 156,73" fill="#4a4860"/>

        {/* Label acteur */}
        <text x="158" y="66" fill="#7a7891" fontSize="8" fontFamily="sans-serif" fontStyle="italic">Service Commercial</text>

        {/* Activité */}
        <rect x="45" y="83" width="210" height="46" rx="7" fill="#1a1a25" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="101" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="sans-serif" fontWeight="bold">ACTIVITÉ</text>
        <text x="150" y="118" textAnchor="middle" fill="#e5e3f0" fontSize="10" fontFamily="sans-serif">Traitement de la commande</text>

        {/* Flèche */}
        <line x1="150" y1="129" x2="150" y2="153" stroke="#4a4860" strokeWidth="1.5"/>
        <polygon points="144,150 150,160 156,150" fill="#4a4860"/>

        {/* Synchronisation OU */}
        <polygon points="150,160 190,184 150,208 110,184" fill="#2d2410" stroke="#c9a84c" strokeWidth="1.5"/>
        <text x="150" y="188" textAnchor="middle" fill="#c9a84c" fontSize="11" fontFamily="sans-serif" fontWeight="bold">OU</text>

        {/* Flèches vers résultats */}
        <line x1="110" y1="208" x2="70" y2="248" stroke="#4a4860" strokeWidth="1.5"/>
        <line x1="190" y1="208" x2="230" y2="248" stroke="#4a4860" strokeWidth="1.5"/>

        {/* Résultat 1 — Acceptée */}
        <rect x="10" y="248" width="120" height="42" rx="7" fill="#052e16" stroke="#34d399" strokeWidth="1.5"/>
        <text x="70" y="265" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="sans-serif" fontWeight="bold">RÉSULTAT 1</text>
        <text x="70" y="280" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif">Commande acceptée</text>

        {/* Résultat 2 — Refusée */}
        <rect x="170" y="248" width="120" height="42" rx="7" fill="#2d0707" stroke="#f87171" strokeWidth="1.5"/>
        <text x="230" y="265" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="sans-serif" fontWeight="bold">RÉSULTAT 2</text>
        <text x="230" y="280" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">Stock insuffisant</text>

        {/* Légende */}
        <text x="150" y="318" textAnchor="middle" fill="#4a4860" fontSize="8" fontFamily="sans-serif">
          ET = les deux événements requis · OU = l&apos;un ou l&apos;autre
        </text>
      </svg>
    </div>
  )
}

// ── CH05 · Schéma Relationnel (MLD) ─────────────────────────────────────────

function SchemaRelationnel() {
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
        Schéma Relationnel — Notation MLD
      </p>
      <div className="font-mono text-[11px] space-y-0">
        {/* Table CLIENT */}
        <div className="rounded-t-lg border border-[#3b82f6]/50 overflow-hidden">
          <div className="bg-[#1e3a5f] px-3 py-1.5 flex items-center gap-2">
            <span className="text-[#3b82f6] font-bold text-[12px]">CLIENT</span>
          </div>
          <div className="bg-[#0b0b0f] divide-y divide-[#1a1a25]">
            <Row pk label="cli_id" note="CHAR(10)" desc="Clé primaire" />
            <Row label="nom" note="VARCHAR(50)" />
            <Row label="prenom" note="VARCHAR(50)" />
            <Row label="email" note="VARCHAR(100)" />
          </div>
        </div>

        {/* Cardinalités */}
        <div className="flex items-center py-1 mx-4 gap-1 text-[10px] text-[#7a7891]">
          <span className="font-bold text-[#3b82f6]">1</span>
          <div className="flex-1 border-t border-dashed border-[#252535]"/>
          <span className="text-[#7a7891]">possède</span>
          <div className="flex-1 border-t border-dashed border-[#252535]"/>
          <span className="font-bold text-[#a855f7]">0,n</span>
        </div>

        {/* Table COMMANDE */}
        <div className="rounded-b-lg border border-[#a855f7]/50 overflow-hidden">
          <div className="bg-[#2d1b4e] px-3 py-1.5 flex items-center gap-2">
            <span className="text-[#a855f7] font-bold text-[12px]">COMMANDE</span>
          </div>
          <div className="bg-[#0b0b0f] divide-y divide-[#1a1a25]">
            <Row pk label="cmd_id" note="INT" desc="Clé primaire" />
            <Row fk label="cli_id" note="CHAR(10)" desc="→ CLIENT(cli_id)" />
            <Row label="date_cmd" note="DATE" />
            <Row label="montant" note="DECIMAL(10,2)" />
          </div>
        </div>

        {/* Légende */}
        <div className="flex gap-5 mt-3 text-[10px] text-[#7a7891]">
          <span><span className="text-[#c9a84c] font-bold"># </span>Clé primaire (souligné)</span>
          <span><span className="text-[#60a5fa] font-bold">* </span>Clé étrangère</span>
        </div>
      </div>
    </div>
  )
}

function Row({ pk, fk, label, note, desc }: { pk?: boolean; fk?: boolean; label: string; note: string; desc?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <span className={`w-4 flex-shrink-0 font-bold ${pk ? 'text-[#c9a84c]' : fk ? 'text-[#60a5fa]' : 'text-transparent'}`}>
        {pk ? '#' : fk ? '*' : '#'}
      </span>
      <span className={`flex-shrink-0 ${pk ? 'text-[#c9a84c] underline decoration-dotted underline-offset-2' : fk ? 'text-[#60a5fa]' : 'text-[#e5e3f0]'}`}>
        {label}
      </span>
      <span className="text-[#4a4860] text-[9px]">{note}</span>
      {desc && <span className="text-[#7a7891] text-[9px] ml-auto">{desc}</span>}
    </div>
  )
}

// ── CH06 · SQL Anatomy ───────────────────────────────────────────────────────

function SchemaSQL() {
  const clauses = [
    { kw: 'SELECT',   bg: 'bg-[#1e3a5f]', border: 'border-[#3b82f6]/40', label: 'text-[#60a5fa]', desc: 'Colonnes à afficher',    ex: 'nom, prenom, SUM(montant)' },
    { kw: 'FROM',     bg: 'bg-[#052e16]', border: 'border-[#34d399]/40', label: 'text-[#34d399]', desc: 'Table(s) source',         ex: 'CLIENT c' },
    { kw: 'JOIN…ON',  bg: 'bg-[#2d1b4e]', border: 'border-[#a855f7]/40', label: 'text-[#a855f7]', desc: 'Jointure entre tables',   ex: 'COMMANDE cmd ON c.cli_id = cmd.cli_id' },
    { kw: 'WHERE',    bg: 'bg-[#2d1505]', border: 'border-[#f97316]/40', label: 'text-[#f97316]', desc: 'Filtre sur les LIGNES',   ex: "ville = 'Paris'" },
    { kw: 'GROUP BY', bg: 'bg-[#1e1033]', border: 'border-[#8b5cf6]/40', label: 'text-[#8b5cf6]', desc: 'Regroupement',            ex: 'c.cli_id, nom' },
    { kw: 'HAVING',   bg: 'bg-[#2d0707]', border: 'border-[#ef4444]/40', label: 'text-[#ef4444]', desc: 'Filtre sur les GROUPES',  ex: 'SUM(montant) > 500' },
    { kw: 'ORDER BY', bg: 'bg-[#062b2b]', border: 'border-[#06b6d4]/40', label: 'text-[#06b6d4]', desc: 'Tri du résultat',         ex: 'nom ASC' },
  ]
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
        Anatomie d&apos;une requête SQL
      </p>
      <div className="space-y-1">
        {clauses.map(c => (
          <div key={c.kw} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border ${c.bg} ${c.border}`}>
            <code className={`text-[11px] font-bold font-mono w-[68px] flex-shrink-0 mt-0.5 ${c.label}`}>{c.kw}</code>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-semibold ${c.label} mr-2`}>{c.desc}</span>
              <code className="text-[10px] text-[#7a7891] font-mono break-all">{c.ex}</code>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
        <p className="text-[10px] text-amber-300 font-medium">
          Ordre obligatoire · WHERE filtre avant GROUP BY · HAVING filtre après GROUP BY
        </p>
      </div>
    </div>
  )
}

// ── CH07 · RECHERCHEV Mechanism ──────────────────────────────────────────────

function SchemaRecherchev() {
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
        Mécanisme RECHERCHEV
      </p>
      <div className="space-y-3">
        {/* Signature */}
        <div className="bg-[#0b0b0f] rounded-lg px-4 py-3 border border-[#c9a84c]/20">
          <p className="text-[10px] text-[#7a7891] mb-1">Syntaxe complète</p>
          <code className="text-xs">
            <span className="text-[#e5e3f0]">=RECHERCHEV(</span>
            <span className="text-[#60a5fa] font-bold">val</span>
            <span className="text-[#4a4860]"> ; </span>
            <span className="text-[#34d399] font-bold">tableau</span>
            <span className="text-[#4a4860]"> ; </span>
            <span className="text-[#a855f7] font-bold">n_col</span>
            <span className="text-[#4a4860]"> ; </span>
            <span className="text-[#f97316] font-bold">0</span>
            <span className="text-[#e5e3f0]">)</span>
          </code>
        </div>

        {/* Arguments */}
        <div className="space-y-1.5">
          {[
            { color: 'bg-[#1e3a5f] border-[#3b82f6]/30 text-[#60a5fa]', n: '①', label: 'val', desc: "Valeur cherchée — ex : A2 ou 'Paris'" },
            { color: 'bg-[#052e16] border-[#34d399]/30 text-[#34d399]', n: '②', label: 'tableau', desc: 'Plage de données — col 1 = colonne de recherche' },
            { color: 'bg-[#2d1b4e] border-[#a855f7]/30 text-[#a855f7]', n: '③', label: 'n_col', desc: 'N° colonne à retourner (depuis la col 1 du tableau)' },
            { color: 'bg-[#2d1505] border-[#f97316]/30 text-[#f97316]', n: '④', label: '0', desc: 'Recherche EXACTE — TOUJOURS mettre 0 !' },
          ].map(a => (
            <div key={a.n} className={`flex items-start gap-2 px-2.5 py-2 rounded-lg border ${a.color.split(' ').slice(0,2).join(' ')}`}>
              <span className={`text-xs font-bold flex-shrink-0 ${a.color.split(' ')[2]}`}>{a.n} {a.label}</span>
              <span className="text-[10px] text-[#7a7891] leading-relaxed">{a.desc}</span>
            </div>
          ))}
        </div>

        {/* Visual table */}
        <div>
          <p className="text-[9px] text-[#7a7891] mb-1.5">Exemple : RECHERCHEV(&quot;P02&quot; ; B2:D4 ; 3 ; 0) → &quot;8 500 €&quot;</p>
          <div className="rounded-lg border border-[#252535] overflow-hidden">
            <table className="w-full text-[10px]">
              <thead className="bg-[#1a1a25]">
                <tr>
                  <th className="px-2 py-1.5 text-[#60a5fa] font-bold text-left border-r border-[#252535]">Col 1 (recherche)</th>
                  <th className="px-2 py-1.5 text-[#7a7891] text-left border-r border-[#252535]">Col 2</th>
                  <th className="px-2 py-1.5 text-[#a855f7] font-bold text-left">Col 3 → retour</th>
                </tr>
              </thead>
              <tbody>
                {[['P01','Paris','10 000 €',false],['P02','Lyon','8 500 €',true],['P03','Bordeaux','6 200 €',false]].map(([c1,c2,c3,hi],i) => (
                  <tr key={i} className={hi ? 'bg-[#c9a84c]/10' : ''}>
                    <td className={`px-2 py-1 border-r border-[#252535] ${hi ? 'text-[#c9a84c] font-bold' : 'text-[#4a4860]'}`}>{c1}</td>
                    <td className="px-2 py-1 text-[#4a4860] border-r border-[#252535]">{c2}</td>
                    <td className={`px-2 py-1 ${hi ? 'text-[#a855f7] font-bold' : 'text-[#4a4860]'}`}>{c3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CH08 · TCD — 4 zones ─────────────────────────────────────────────────────

function SchemaTCD() {
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-3">
        Structure d&apos;un TCD — Les 4 zones
      </p>
      <div className="border border-[#252535] rounded-lg overflow-hidden text-[10px]">
        {/* Filtres */}
        <div className="border-b border-[#252535] px-4 py-2 bg-[#062b2b] flex items-center gap-3">
          <span className="font-bold text-[#06b6d4] w-20 flex-shrink-0">FILTRES</span>
          <span className="text-[#4a4860]">Glisser les champs à filtrer — ex : Année, Région</span>
        </div>
        {/* Colonnes */}
        <div className="border-b border-[#252535] flex">
          <div className="w-[90px] flex-shrink-0 border-r border-[#252535]"/>
          <div className="flex-1 px-4 py-2 bg-[#1e1033]">
            <span className="font-bold text-[#8b5cf6]">COLONNES</span>
            <span className="text-[#4a4860] ml-3">ex : Trimestre, Catégorie</span>
          </div>
        </div>
        {/* Lignes + Valeurs */}
        <div className="flex min-h-[60px]">
          <div className="w-[90px] flex-shrink-0 border-r border-[#252535] px-3 py-3 bg-[#052e16]">
            <p className="font-bold text-[#34d399]">LIGNES</p>
            <p className="text-[#4a4860] mt-1">ex : Produit</p>
            <p className="text-[#4a4860]">Commercial</p>
          </div>
          <div className="flex-1 px-4 py-3 bg-[#2d1505]/60">
            <p className="font-bold text-[#f97316]">VALEURS</p>
            <p className="text-[#4a4860] mt-1">SOMME de CA · COUNT de Ventes</p>
            <p className="text-[#4a4860]">MOYENNE · MAX · MIN…</p>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#7a7891]">
        <span><span className="text-[#06b6d4]">■</span> Filtres — segment ou filtre de rapport</span>
        <span><span className="text-[#8b5cf6]">■</span> Colonnes — en-têtes horizontaux</span>
        <span><span className="text-[#34d399]">■</span> Lignes — en-têtes verticaux</span>
        <span><span className="text-[#f97316]">■</span> Valeurs — cellules calculées</span>
      </div>
    </div>
  )
}
