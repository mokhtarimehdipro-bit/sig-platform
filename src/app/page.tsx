'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/gas'
import { setSession } from '@/lib/session'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [mdp, setMdp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(code.trim(), mdp.trim())
      setSession({
        access_code: data.access_code,
        nom:         data.nom,
        prenom:      data.prenom,
        scoreTotal:  data.scoreTotal,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a25_0%,_#0b0b0f_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo + titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#13131a] border border-[#252535] shadow-lg mb-5 overflow-hidden">
            <Image
              src="/1.png"
              alt="Logo établissement"
              width={72}
              height={72}
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e5e3f0] mb-1">
            Réviser SIG avec{' '}
            <span className="text-[#c9a84c]">MMOK</span>
          </h1>
          <p className="text-[#7a7891] text-xs tracking-widest uppercase">
            DCG · UE 8 · Systèmes d&apos;Information de Gestion
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="card p-7 shadow-2xl shadow-black/50">
          <p className="text-center text-sm text-[#7a7891] mb-6">Connexion étudiant</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Identifiant</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Ex : DCG2025-001"
                className="input-dark"
                required
                autoFocus
                autoCapitalize="characters"
              />
            </div>

            <div>
              <label className="label-dark">Code secret</label>
              <input
                type="text"
                value={mdp}
                onChange={e => setMdp(e.target.value)}
                placeholder="Ex : SIG8"
                className="input-dark"
                required
                autoCapitalize="characters"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Vérification…
                </span>
              ) : 'Accéder à la plateforme →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#4a4860] text-xs mt-6">
          Plateforme pédagogique · Accès réservé aux étudiants inscrits
        </p>
      </div>
    </div>
  )
}
