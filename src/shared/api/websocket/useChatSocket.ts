import { useEffect } from 'react'

interface Handlers {
  onChunk: (text: string) => void
  onDone: (fullText: string) => void
}

export function useChatSocket(chatId: string | undefined, handlers: Handlers) {
  useEffect(() => {
    if (!chatId) return

    // Мок: слушаем кастомное событие (в реальности — WebSocket)
    const listener = (e: Event) => {
      const custom = e as CustomEvent<{ chatId: string; query: string }>
      if (custom.detail.chatId !== chatId) return

      const response = `По материалам компании: на запрос «${custom.detail.query}» найдено следующее. Пилот запуска Atlas — 12 октября, публичный запуск — 20 октября.`
      const words = response.split(' ')

      let i = 0
      let buffer = ''
      const interval = setInterval(() => {
        buffer += (i === 0 ? '' : ' ') + words[i]
        handlers.onChunk(buffer)
        i++
        if (i >= words.length) {
          clearInterval(interval)
          handlers.onDone(buffer)
        }
      }, 60)
    }

    window.addEventListener('mock:chat-response', listener)
    return () => window.removeEventListener('mock:chat-response', listener)
  }, [chatId, handlers])
}

// Вызывается из ChatsPage при отправке
export function emitChatMessage(chatId: string, query: string) {
  window.dispatchEvent(
    new CustomEvent('mock:chat-response', { detail: { chatId, query } })
  )
}