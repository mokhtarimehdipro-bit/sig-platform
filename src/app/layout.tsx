import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Réviser SIG avec MMOK — DCG UE 8",
  description: "Plateforme d'auto-évaluation pour l'UE 8 Systèmes d'Information de Gestion du DCG",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#0b0b0f] text-[#e5e3f0] antialiased">
        {children}
      </body>
    </html>
  )
}
