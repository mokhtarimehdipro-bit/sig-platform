// Client GAS — toutes les requêtes transitent ici
// Content-Type: text/plain évite le preflight CORS

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || ''

async function gasPost<T>(payload: object): Promise<T> {
  if (!GAS_URL) throw new Error('NEXT_PUBLIC_GAS_URL non définie dans .env.local')
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data as T
}

// — Types —

export interface Session {
  access_code: string
  nom: string
  prenom: string
  scoreTotal: number
}

export interface Chapter {
  chapter_id: string
  titre: string
}

export interface QCMQuestion {
  qcm_id: string
  notion: string
  question: string
  options: [string, string, string, string]
  correct_answer: number
  explication: string
}

export interface RedactionQuestion {
  redaction_id: string
  chapter_id: string
  mise_en_situation: string
  question: string
}

export interface QCMScore {
  chapter_id: string
  score: number
  date: string
}

export interface RedactionScore {
  redaction_id: string
  note: number
  feedback: string
  date: string
}

export interface ScoresResponse {
  qcm: QCMScore[]
  redaction: RedactionScore[]
  chapters: Chapter[]
}

// — API —

export const api = {
  login(access_code: string, mdp: string) {
    return gasPost<Session & { success: boolean }>({ action: 'login', access_code, mdp })
  },

  getChapters() {
    return gasPost<{ chapters: Chapter[] }>({ action: 'getChapters' })
  },

  getQCM(chapter_id: string) {
    return gasPost<{ questions: QCMQuestion[] }>({ action: 'getQCM', chapter_id })
  },

  submitQCM(access_code: string, chapter_id: string, score: number) {
    return gasPost<{ success: boolean; scoreTotal: number }>({
      action: 'submitQCM',
      access_code,
      chapter_id,
      score,
    })
  },

  getRedactions(chapter_id?: string) {
    return gasPost<{ questions: RedactionQuestion[] }>({ action: 'getRedactions', chapter_id })
  },

  submitRedaction(payload: {
    access_code: string
    redaction_id: string
    reponse_etudiant: string
    image_base64?: string
    image_mime?: string
    chapter_id?: string
  }) {
    return gasPost<{ success: boolean; note: number; feedback: string; imageUrl: string | null }>({
      action: 'submitRedaction',
      ...payload,
    })
  },

  getScores(access_code: string) {
    return gasPost<ScoresResponse>({ action: 'getScores', access_code })
  },
}
