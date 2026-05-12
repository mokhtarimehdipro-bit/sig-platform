'use client'

interface SchemaProps { chapter_id: string; fiche_type: 'qcm' | 'redaction' }

export default function ChapterSchema({ chapter_id, fiche_type }: SchemaProps) {
  if (fiche_type === 'redaction') return null
  switch (chapter_id) {
    case 'CH01': return <SchemaSI />
    case 'CH03': return <SchemaSER />
    case 'CH05': return <SchemaRelationnel />
    case 'CH06': return <SchemaSQL />
    case 'CH07': return <SchemaRecherchev />
    case 'CH08': return <SchemaTCD />
    default: return null
  }
}

// ── CH01 · Structure du SI ───────────────────────────────────────────────────

function SchemaSI() {
  return (
    <div className="px-5 pb-5">
      <p className="text-[10px] font-bold text-[#7a7891] uppercase tracking-widest mb-4">
        Structure et niveaux du SI
      </p>
      <div className="space-y-4 text-[10px]">

        {/* 4 fonctions */}
        <div>
          <p className="text-[9px] text-[#7a7891] font-semibold uppercase tracking-wider mb-2">4 fonctions officielles (BO)</p>
          <div className="flex items-center gap-1">
            {[
              { label: 'Collecter', color: 'bg-[#1e3a5f] border-[#3b82f6]/50 text-[#60a5fa]' },
              { label: 'Stocker',   color: 'bg-[#052e16] border-[#34d399]/50 text-[#34d399]' },
              { label: 'Traiter',   color: 'bg-[#2d1b4e] border-[#a855f7]/50 text-[#a855f7]' },
              { label: 'Diffuser',  color: 'bg-[#2d1505] border-[#f97316]/50 text-[#f97316]' },
            ].map((fn, i) => (
              <div key={fn.label} className="flex items-center gap-0.5 flex-1 min-w-0">
                <div className={`flex-1 px-1 py-2 rounded-lg border text-center font-bold text-[8px] leading-tight ${fn.color}`}>
                  {fn.label}
                </div>
                {i < 3 && <span className="text-[#4a4860] text-[10px]">›</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 3 composantes */}
        <div>
          <p className="text-[9px] text-[#7a7891] font-semibold uppercase tracking-wider mb-2">3 composantes du SI</p>
          <div className="space-y-1.5">
            {[
              { label: 'Humaine',           desc: 'Utilisateurs · DSI · Informaticiens · Décideurs',         color: 'bg-[#1e3a5f] border-[#3b82f6]/40 text-[#60a5fa]' },
              { label: 'Organisationnelle', desc: 'Procédures · Règles de gestion · Modes opératoires',      color: 'bg-[#2d1b4e] border-[#a855f7]/40 text-[#a855f7]' },
              { label: 'Technologique',     desc: 'Matériels · Logiciels · Réseaux · SGBD',                  color: 'bg-[#052e16] border-[#34d399]/40 text-[#34d399]' },
            ].map(c => (
              <div key={c.label} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${c.color}`}>
                <span className="font-bold flex-shrink-0 text-[9px]">{c.label}</span>
                <span className="text-[#7a7891] text-[8.5px]">{c.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-[8.5px] text-[#4a4860] mt-1.5 text-center">
            SI ⊃ Système informatique — la composante techno n&apos;est qu&apos;une partie du SI
          </p>
        </div>

        {/* Niveaux décisionnels */}
        <div>
          <p className="text-[9px] text-[#7a7891] font-semibold uppercase tracking-wider mb-2">Niveaux décisionnels (pyramide DSI)</p>
          <div className="space-y-1">
            {[
              { label: 'Stratégique', desc: 'PDG · Long terme · KPI · Tableaux de bord', color: 'border-amber-500/40 bg-amber-500/10 text-[#c9a84c]', mx: 'mx-8' },
              { label: 'Tactique',    desc: 'Directeurs · Moyen terme · Reporting',       color: 'border-[#a855f7]/40 bg-[#2d1b4e] text-[#a855f7]',   mx: 'mx-4' },
              { label: 'Opérationnel',desc: 'Managers · Court terme · Transactions',      color: 'border-[#3b82f6]/40 bg-[#1e3a5f] text-[#60a5fa]',   mx: 'mx-0' },
            ].map(n => (
              <div key={n.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${n.color} ${n.mx}`}>
                <span className="font-bold text-[8.5px] flex-shrink-0">{n.label}</span>
                <span className="text-[#7a7891] text-[8px]">{n.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── CH03 helpers ────────────────────────────────────────────────────────────
type SerActorKey = 'client' | 'commercial' | 'asst' | 'magasinier' | 'fournisseur'
const SER_ACTORS: Record<SerActorKey, { badge: string; label: string }> = {
  client:      { badge: 'bg-blue-500/10 border-blue-500/40 text-blue-400',       label: 'Client' },
  commercial:  { badge: 'bg-purple-500/10 border-purple-500/40 text-purple-400', label: 'Commercial' },
  asst:        { badge: 'bg-pink-500/10 border-pink-500/40 text-pink-400',        label: 'Asst. Admin' },
  magasinier:  { badge: 'bg-teal-500/10 border-teal-500/40 text-teal-400',        label: 'Magasinier' },
  fournisseur: { badge: 'bg-orange-500/10 border-orange-500/40 text-orange-400',  label: 'Fournisseur' },
}
function SerActor({ actor }: { actor: SerActorKey }) {
  const s = SER_ACTORS[actor]
  return <span className={`inline-block text-[7px] font-semibold px-1.5 py-0.5 rounded-full border ${s.badge} mb-0.5`}>{s.label}</span>
}
function SerArr() {
  return (
    <div className="flex justify-center my-0.5">
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <line x1="4" y1="0" x2="4" y2="8" stroke="#4a4860" strokeWidth="1.5"/>
        <polygon points="0,7 4,12 8,7" fill="#4a4860"/>
      </svg>
    </div>
  )
}
function SerEvt({ label, actor, sub }: { label: string; actor?: SerActorKey; sub?: string }) {
  return (
    <div className="flex flex-col items-center">
      {actor && <SerActor actor={actor} />}
      <div className="border border-dashed border-[#60a5fa] bg-[#0d1b2e] rounded-full px-4 py-1.5 text-center w-full max-w-[210px]">
        <p className="text-[8.5px] text-[#93c5fd] font-medium leading-tight">{label}</p>
        {sub && <p className="text-[7px] text-[#4a4860] mt-0.5 italic">{sub}</p>}
      </div>
    </div>
  )
}
function SerOp({ label, actor, warn }: { label: string; actor: SerActorKey; warn?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <SerActor actor={actor} />
      <div className={`border rounded-lg px-3 py-2 text-center w-full max-w-[210px] ${warn ? 'border-amber-500/50 bg-amber-500/10' : 'border-[#3b82f6]/40 bg-[#1a1a25]'}`}>
        {warn && <p className="text-[6.5px] text-amber-400 font-bold uppercase tracking-wide mb-0.5">⚠ Étape superflue</p>}
        <p className={`text-[8.5px] font-medium leading-tight ${warn ? 'text-amber-200' : 'text-[#e5e3f0]'}`}>{label}</p>
      </div>
    </div>
  )
}
function SerRes({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-[#34d399] bg-[#052e16] rounded-full px-4 py-1.5 text-center w-full max-w-[210px]">
        <p className="text-[8.5px] text-[#6ee7b7] font-medium leading-tight">{label}</p>
      </div>
      <div className="w-[180px] h-px bg-[#34d399]/60 mt-0.5" />
    </div>
  )
}
function SerDiamond({ label, type }: { label: string; type: 'ET' | 'OU' }) {
  const isET = type === 'ET'
  return (
    <div className="flex justify-center my-1">
      <div className="relative w-12 h-12">
        <div className={`absolute inset-0 rotate-45 border-2 ${isET ? 'border-emerald-500 bg-[#0a2e1a]' : 'border-[#c9a84c] bg-[#2d2410]'}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold ${isET ? 'text-emerald-300' : 'text-[#c9a84c]'}`}>{label}</span>
        </div>
      </div>
    </div>
  )
}

// ── CH03 · Schéma Événement-Résultat ────────────────────────────────────────

function SchemaSER() {
  return (
    <div className="px-4 pb-5 space-y-4">

      {/* Pourquoi le SER ? */}
      <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3">
        <p className="text-[9px] font-bold text-[#c9a84c] uppercase tracking-widest mb-1.5">Pourquoi modéliser un processus ?</p>
        <p className="text-[10px] text-[#e5e3f0] leading-relaxed">
          Le SER rend <span className="text-[#c9a84c] font-semibold">visible ce qui est invisible</span> : délais inutiles, doublons, allers-retours sans valeur ajoutée. Modéliser = comprendre pour <span className="text-[#c9a84c] font-semibold">optimiser</span>.
        </p>
      </div>

      {/* 3 types de processus */}
      <div>
        <p className="text-[9px] font-bold text-[#7a7891] uppercase tracking-widest mb-2">3 types de processus</p>
        <div className="space-y-1.5">
          {[
            { label: 'Métier (opérationnel)', desc: "Cœur de l'activité — vente, achat, production, livraison", color: 'bg-[#1e3a5f] border-[#3b82f6]/40 text-[#60a5fa]' },
            { label: 'Management (pilotage)', desc: 'Contrôle, reporting, tableaux de bord, décisions', color: 'bg-amber-500/10 border-amber-500/30 text-[#c9a84c]' },
            { label: 'Support (soutien)',      desc: "RH, comptabilité, informatique — soutiennent les autres", color: 'bg-[#2d1b4e] border-[#a855f7]/40 text-[#a855f7]' },
          ].map(t => (
            <div key={t.label} className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${t.color}`}>
              <span className="font-bold text-[8.5px] flex-shrink-0 mt-0.5">{t.label}</span>
              <span className="text-[#7a7891] text-[8px] leading-relaxed">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Règles de formalisme */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-2">6 règles de formalisme — à ne jamais oublier</p>
        <div className="space-y-1">
          {[
            '① On commence TOUJOURS par un événement déclencheur',
            '② On finit TOUJOURS par un résultat (ovale + barre)',
            '③ Flux de haut en bas — jamais de retour en arrière',
            "④ Pas d'opération chez les acteurs externes (client, fournisseur)",
            '⑤ Jamais 2 événements ni 2 opérations consécutifs',
            '⑥ ET = tous les flux requis · OU = un seul flux suffit',
          ].map(r => (
            <p key={r} className="text-[8.5px] text-[#fca5a5]">{r}</p>
          ))}
        </div>
      </div>

      {/* SER — Diagramme */}
      <div>
        <p className="text-[9px] font-bold text-[#7a7891] uppercase tracking-widest mb-1">Exemple — Traitement d&apos;une commande reçue</p>
        <p className="text-[8px] text-[#4a4860] mb-3">Processus métier · 5 acteurs · <span className="text-amber-400">étapes superflues en amber</span></p>

        {/* Légende acteurs */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(Object.entries(SER_ACTORS) as [SerActorKey, { badge: string; label: string }][]).map(([k, s]) => (
            <span key={k} className={`inline-block text-[7px] font-semibold px-1.5 py-0.5 rounded-full border ${s.badge}`}>
              {s.label}{(k === 'client' || k === 'fournisseur') ? ' (ext.)' : ''}
            </span>
          ))}
        </div>

        {/* Légende formes */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[7.5px] text-[#7a7891] mb-4">
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-2.5 rounded-full border border-dashed border-[#60a5fa]"/>Événement</span>
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-2.5 border border-[#3b82f6] rounded-sm"/>Opération</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rotate-45 border border-[#c9a84c]"/>ET/OU</span>
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-2.5 rounded-full border border-[#34d399]"/>Résultat</span>
        </div>

        {/* FLUX PRINCIPAL */}
        <div className="flex flex-col items-center">

          <SerEvt label="Commande reçue" actor="client" />
          <SerArr />
          <SerOp label="Enregistrement de la commande" actor="commercial" />
          <SerArr />
          <SerRes label="Commande enregistrée" />
          <SerArr />
          <SerOp label="Recopie manuelle sur bon papier" actor="asst" warn />
          <SerArr />
          <SerRes label="Bon de commande établi" />
          <SerArr />
          <SerOp label="Transmission du bon par coursier" actor="asst" warn />
          <SerArr />
          <SerRes label="Bon transmis au magasinier" />
          <SerArr />
          <SerOp label="Vérification du stock disponible" actor="magasinier" />
          <SerArr />
          <SerDiamond label="OU" type="OU" />

          {/* Branches parallèles */}
          <div className="w-full grid grid-cols-2 gap-2 my-1">
            <div className="flex flex-col items-center border-l border-[#252535] pl-1">
              <p className="text-[7px] text-[#4a4860] italic mb-1">Stock suffisant</p>
              <SerOp label="Préparation de la commande" actor="magasinier" />
              <SerArr />
              <SerRes label="Commande préparée" />
            </div>
            <div className="flex flex-col items-center border-r border-[#252535] pr-1">
              <p className="text-[7px] text-[#4a4860] italic mb-1">Stock insuffisant</p>
              <SerOp label="Appel téléphonique fournisseur" actor="commercial" warn />
              <SerArr />
              <SerEvt label="Commande fournisseur passée" actor="fournisseur" />
              <SerArr />
              <SerOp label="Réception et contrôle livraison" actor="magasinier" />
              <SerArr />
              <SerRes label="Stock reconstitué" />
            </div>
          </div>

          <SerDiamond label="ET" type="ET" />
          <SerArr />
          <SerOp label="Émission de la facture client" actor="asst" />
          <SerArr />
          <SerRes label="Facture émise et envoyée" />

        </div>
      </div>

      {/* Explication textuelle */}
      <div className="bg-[#13131a] border border-[#252535] rounded-xl px-4 py-3">
        <p className="text-[9px] font-bold text-[#e5e3f0] uppercase tracking-widest mb-2">Explication textuelle du processus</p>
        <div className="space-y-1 text-[8.5px] text-[#7a7891] leading-relaxed">
          {[
            "① La réception d'une commande client déclenche le processus.",
            "② Le commercial enregistre la commande dans le système.",
            "③ ⚠ L'assistante admin recopie manuellement les infos sur un bon papier (doublon inutile).",
            "④ ⚠ Elle transmet ce bon via un coursier interne (délai, risque de perte).",
            "⑤ Le magasinier vérifie le stock disponible.",
            "⑥ Si stock OK → le magasinier prépare la commande directement.",
            "⑦ ⚠ Si stock KO → le commercial appelle le fournisseur par téléphone (pas de traçabilité).",
            "⑧ Le fournisseur passe une commande ; le magasinier réceptionne et contrôle la livraison.",
            "⑨ Les deux branches se synchronisent (ET) : la facture n'est émise qu'une fois la commande prête.",
            "⑩ L'assistante admin émet la facture → résultat final du processus.",
          ].map(s => <p key={s}>{s}</p>)}
        </div>
      </div>

      {/* Pistes d'optimisation */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Pistes d&apos;optimisation identifiées</p>
        <div className="space-y-1 text-[8.5px] text-emerald-200/80 leading-relaxed">
          <p>→ Supprimer la recopie papier : le magasinier accède directement au SI.</p>
          <p>→ Remplacer l&apos;appel téléphonique par une commande fournisseur dématérialisée (EDI).</p>
          <p>→ Résultat : 3 étapes supprimées, délai réduit, traçabilité totale.</p>
        </div>
      </div>

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
