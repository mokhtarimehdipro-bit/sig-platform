import { NextRequest, NextResponse } from 'next/server'

const GAS_URL = process.env.GAS_URL || ''

export async function POST(req: NextRequest) {
  if (!GAS_URL) {
    return NextResponse.json({ error: 'GAS_URL non configurée côté serveur' }, { status: 500 })
  }

  try {
    const payload = await req.json()
    const params = new URLSearchParams({ payload: JSON.stringify(payload) })

    const response = await fetch(`${GAS_URL}?${params}`)
    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur GAS ${response.status}: ${text.slice(0, 300)}` },
        { status: 502 }
      )
    }

    try {
      const data = JSON.parse(text)
      return NextResponse.json(data)
    } catch {
      return NextResponse.json(
        { error: `Réponse GAS non-JSON: ${text.slice(0, 300)}` },
        { status: 502 }
      )
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Erreur proxy: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    )
  }
}
