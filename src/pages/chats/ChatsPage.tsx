import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChatSidebar } from './ui/ChatSidebar'
import { ChatWindow } from './ui/ChatWindow'
import { useState } from 'react'
import { useChatSocket, emitChatMessage } from '@/shared/api/websocket/useChatSocket'

export function ChatsPage() {
  const { id, chatId } = useParams()
  const queryClient = useQueryClient()
  const [streamingText, setStreamingText] = useState<string | null>(null)


  useChatSocket(chatId, {
    onChunk: (text) => setStreamingText(text),
    onDone: async (fullText) => {
      setStreamingText(null)
      // Сохраняем финальный ответ в MSW
      await fetch(`/api/chats/${chatId}/ai-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullText }),
      })
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
    },
  })


  // 1. Данные компании (для имени и кол-ва документов)
  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetch(`/api/companies/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  // 2. Список чатов компании (MSW должен фильтровать по companyId)
  const { data: chats } = useQuery({
    queryKey: ['chats', id],
    queryFn: () => fetch(`/api/chats?companyId=${id}`).then(r => r.json()),
    enabled: !!id,
  })

  // 3. Сообщения активного чата
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetch(`/api/chats/${chatId}/messages`).then(r => r.json()),
    enabled: !!chatId,
  })

  // 4. Выбираем активный чат из списка
  const activeChat = chats?.find((c: any) => c.uuid === chatId)
  const chatWithMessages = activeChat
    ? { ...activeChat, messages: [...(messages || []), ...(streamingText ? [{ uuid: 'streaming', role: 'AI', content: streamingText }] : [])] }
    : null

  // 5. Отправка сообщения
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      // 1. Сохраняем сообщение пользователя
      await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
      // 2. Триггерим «ответ ИИ» через мок-WebSocket
      emitChatMessage(chatId!, content)
    },
  })

  if (!company || !chats) return <div className="p-8">Загрузка...</div>

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Левая колонка: список чатов */}
      <ChatSidebar chats={chats} activeChatId={chatId} companyId={id!} />

      {/* Правая колонка: окно чата */}
      <div className="flex-1">
        {messagesLoading ? (
          <div className="p-8">Загрузка сообщений...</div>
        ) : (
          <ChatWindow
            chat={chatWithMessages}
            companyName={company.name}
            documentCount={company.documents || 24}
            onSend={(text: string) => mutation.mutate(text)}
          />
        )}
      </div>
    </div>
  )
}