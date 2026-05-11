const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || ''

/* eslint-disable @typescript-eslint/no-explicit-any */
function gasCall<T>(payload: object): Promise<T> {
  if (!GAS_URL) return Promise.reject(new Error('NEXT_PUBLIC_GAS_URL non définie'))

  return new Promise<T>((resolve, reject) => {
    const cbName = `_gas_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    const w = window as any

    const cleanup = () => {
      delete w[cbName]
      if (script.parentNode) script.parentNode.removeChild(script)
    }

    w[cbName] = (data: any) => {
      cleanup()
      if (data && data.error) reject(new Error(data.error))
      else resolve(data as T)
    }

    const params = new URLSearchParams({
      payload: JSON.stringify(payload),
      callback: cbName,
    })

    script.src = `${GAS_URL}?${params.toString()}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Impossible de contacter le serveur'))
    }

    document.head.appendChild(script)
  })
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
    const { image_base64: _img, image_mime: _mime, ...rest } = payload
    void _img; void _mime
    return gasCall<{ success: boolean; note: number; feedback: string; imageUrl: string | null }>({
      action: 'submitRedaction',
      ...rest,
    })
  },

  getScores(access_code: string) {
    return gasCall<ScoresResponse>({ action: 'getScores', access_code })
  },
}
