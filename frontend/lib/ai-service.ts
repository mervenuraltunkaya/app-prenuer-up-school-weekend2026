import type { GroqChatTurn, TravelChatContext } from '@/components/chat/types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/** Groq üzerinde düşük gecikmeli, güncel açık kaynak model */
const GROQ_MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT =
  'Sen Nomad uygulamasının ultra hızlı çalışan akıllı seyahat asistanısın. Görevin, gezgin kullanıcılara mekanlar, rotalar ve şehirler hakkında net, pratik ve ilham verici seyahat tavsiyeleri vermektir.'

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
  error?: {
    message?: string
  }
}

function buildContextBlock(context?: TravelChatContext): string {
  if (!context) return ''

  const lines: string[] = []

  if (context.cityName) {
    const location = context.cityCountry
      ? `${context.cityName}, ${context.cityCountry}`
      : context.cityName
    lines.push(`Aktif şehir: ${location}`)
  }

  if (context.places?.length) {
    lines.push('Haritada görünen mekanlar (en fazla 24):')
    for (const place of context.places) {
      lines.push(
        `- ${place.name} (${place.category}) · ${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`,
      )
    }
    lines.push(
      'Bu mekanları bağlam olarak kullan; kullanıcıya rota, ziyaret sırası ve pratik ipuçları öner.',
    )
  }

  if (!lines.length) return ''

  return `\n\n--- Anlık uygulama bağlamı ---\n${lines.join('\n')}`
}

function getGroqApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY?.trim()
  if (!apiKey) {
    throw new Error(
      'Groq API anahtarı bulunamadı. EXPO_PUBLIC_GROQ_API_KEY ortam değişkenini tanımlayın.',
    )
  }
  return apiKey
}

export async function sendTravelChatMessage(
  history: GroqChatTurn[],
  context?: TravelChatContext,
): Promise<string> {
  const apiKey = getGroqApiKey()
  const systemContent = `${SYSTEM_PROMPT}${buildContextBlock(context)}`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: systemContent }, ...history],
      temperature: 0.65,
      max_tokens: 1024,
      stream: false,
    }),
  })

  const data = (await response.json()) as GroqChatCompletionResponse

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `Groq isteği başarısız oldu (${response.status})`,
    )
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('Groq yanıtı boş döndü.')
  }

  return content
}
