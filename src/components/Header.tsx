'use client'


import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearSession } from '@/lib/session'

interface Props {
  prenom?: string
  nom?: string
  scoreTotal?: number
}

export default function Header({ prenom, nom, scoreTotal }: Props) {
  const router = useRouter()

  const handleLogout = () => {
    clearSession()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0f]/90 backdrop-blur-md border-b border-[#252535]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo + marque */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#13131a] border border-[#252535] overflow-hidden flex-shrink-0 group-hover:border-[#c9a84c]/40 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/1.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="text-sm font-semibold text-[#e5e3f0] hidden sm:block">
            Réviser SIG avec <span className="text-[#c9a84c]">MMOK</span>
          </span>
        </Link>

        {/* Navigation centrale */}
        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/qcm" label="QCM" />
          <NavLink href="/redaction" label="Rédaction" />
          <NavLink href="/fiches" label="Fiches" />
        </nav>

        {/* Profil + score */}
        {prenom && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-[#7a7891]">{prenom} {nom}</span>
              {scoreTotal !== undefined && scoreTotal > 0 && (
                <span className="badge-gold">{scoreTotal}%</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-[#7a7891] hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-xs font-medium text-[#7a7891] hover:text-[#c9a84c] px-3 py-2 rounded-lg hover:bg-[#c9a84c]/5 transition-all"
    >
      {label}
    </Link>
  )
}
