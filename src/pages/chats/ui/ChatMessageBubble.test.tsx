
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessageBubble } from './ChatMessageBubble'
import type { ChatMessage } from '@/shared/api/types'

const baseMessage: ChatMessage = {
  uuid: 'message-1',
  chat_id: 'chat-1',
  role: 'USER',
  content: 'Тестовое сообщение',
  created_at: '2026-11-15T10:00:00Z',
}

describe('ChatMessageBubble', () => {
  it('отображает текст сообщения пользователя', () => {
    render(<ChatMessageBubble message={baseMessage} />)

    expect(screen.getByText('Тестовое сообщение')).toBeInTheDocument()
  })

  it('отображает инициалы пользователя', () => {
    render(<ChatMessageBubble message={baseMessage} />)

    expect(screen.getByText('АМ')).toBeInTheDocument()
  })

  it('отображает название AI-помощника', () => {
    const message: ChatMessage = {
      ...baseMessage,
      role: 'AI',
      content: 'Ответ помощника',
    }

    render(<ChatMessageBubble message={message} />)

    expect(screen.getByText('MeetMind')).toBeInTheDocument()
    expect(
      screen.getByText('По материалам компании'),
    ).toBeInTheDocument()
  })

  it('отображает задачи сообщения', () => {
    const message: ChatMessage = {
      ...baseMessage,
      role: 'AI',
      tasks: [
        {
          id: 'task-1',
          assignee: 'Иван',
          title: 'Подготовить отчёт',
          due: '20 ноября',
          sourceIndex: 1,
        },
      ],
    }

    render(<ChatMessageBubble message={message} />)

    expect(screen.getByText('Ответственные и сроки')).toBeInTheDocument()
    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByText('Подготовить отчёт')).toBeInTheDocument()
  })

  it('отображает источники сообщения', () => {
    const message: ChatMessage = {
      ...baseMessage,
      role: 'AI',
      sources: [
        {
          docId: 'doc-1',
          label: 'Протокол встречи',
          quote: 'Команда согласовала сроки запуска',
          timestamp: '10:30',
        },
      ],
    }

    render(<ChatMessageBubble message={message} />)

    expect(screen.getByText('Источники · 1 фрагмента')).toBeInTheDocument()
    expect(screen.getByText('Протокол встречи')).toBeInTheDocument()
    expect(
      screen.getByText('Команда согласовала сроки запуска'),
    ).toBeInTheDocument()
  })

  it('не отображает задачи и источники, если они отсутствуют', () => {
    render(<ChatMessageBubble message={baseMessage} />)

    expect(
      screen.queryByText('Ответственные и сроки'),
    ).not.toBeInTheDocument()

    expect(screen.queryByText(/Источники/)).not.toBeInTheDocument()
  })
})
