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

async function gasCall<T>(payload: object): Promise<T> {
  const response = await fetch('/api/gas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data as T
}

export const api = {
  login(access_code: string, mdp: string) {
    return gasCall<Session & { success: boolean }>({ action: 'login', access_code, mdp })
  },

  getChapters() {
    return gasCall<{ chapters: Chapter[] }>({ action: 'getChapters' })
  },

  getQCM(chapter_id: string) {
    return gasCall<{ questions: QCMQuestion[] }>({ action: 'getQCM', chapter_id })
  },

  submitQCM(access_code: string, chapter_id: string, score: number) {
    return gasCall<{ success: boolean; scoreTotal: number }>({
      action: 'submitQCM',
      access_code,
      chapter_id,
      score,
    })
  },

  getRedactions(chapter_id?: string) {
    return gasCall<{ questions: RedactionQuestion[] }>({ action: 'getRedactions', chapter_id })
  },

  submitRedaction(payload: {
    access_code: string
    redaction_id: string
    reponse_etudiant: string
    image_base64?: string
    image_mime?: string
    chapter_id?: string
  }) {
    return gasCall<{ success: boolean; note: number; feedback: string; imageUrl: string | null }>({
      action: 'submitRedaction',
      ...payload,
    })
  },

  getScores(access_code: string) {
    return gasCall<ScoresResponse>({ action: 'getScores', access_code })
  },
}
