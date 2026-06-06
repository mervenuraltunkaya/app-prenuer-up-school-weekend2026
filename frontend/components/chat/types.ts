export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export type TravelPlaceContext = {
  name: string
  category: string
  lat: number
  lng: number
}

export type TravelChatContext = {
  cityName?: string
  cityCountry?: string
  places?: TravelPlaceContext[]
}

export type GroqChatRole = 'user' | 'assistant'

export type GroqChatTurn = {
  role: GroqChatRole
  content: string
}
