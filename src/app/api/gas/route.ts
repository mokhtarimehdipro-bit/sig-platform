import { NextRequest, NextResponse } from 'next/server'

const GAS_URL = process.env.GAS_URL || ''

export async function POST(req: NextRequest) {
  if (!GAS_URL) {
    return NextResponse.json({ error: 'GAS_URL non configurée côté serveur' }, { status: 500 })
  }

  const payload = await req.json()
  const params = new URLSearchParams({ payload: JSON.stringify(payload) })

  const response = await fetch(`${GAS_URL}?${params}`)
  if (!response.ok) {
    return NextResponse.json({ error: `Erreur GAS : ${response.status}` }, { status: 502 })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
