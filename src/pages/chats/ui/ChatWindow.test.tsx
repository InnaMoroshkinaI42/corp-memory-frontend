
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatWindow } from './ChatWindow'

vi.mock('@/shared/ui/EmptyChatState', () => ({
  EmptyChatState: ({ companyName, documentCount, onSend }: any) => (
    <div>
      <span>{companyName}</span>
      <span>{documentCount}</span>
      <button onClick={() => onSend('Сообщение из пустого чата')}>
        Начать диалог
      </button>
    </div>
  ),
}))

vi.mock('./ChatMessageBubble', () => ({
  ChatMessageBubble: ({ message }: any) => (
    <div>{message.content}</div>
  ),
}))

const chat = {
  uuid: 'chat-1',
  title: 'Обсуждение проекта',
  created_at: '2026-11-15T10:00:00Z',
  messages: [
    {
      uuid: 'message-1',
      role: 'USER',
      content: 'Привет!',
    },
    {
      uuid: 'message-2',
      role: 'AI',
      content: 'Здравствуйте!',
    },
  ],
}

describe('ChatWindow', () => {
  it('отображает пустое состояние, если чат не выбран', () => {
    const onSend = vi.fn()

    render(
      <ChatWindow
        chat={null}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={onSend}
      />,
    )

    expect(screen.getByText('Компания Альфа')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Начать диалог')).toBeInTheDocument()
  })

  it('отображает пустое состояние, если в чате нет сообщений', () => {
    render(
      <ChatWindow
        chat={{ ...chat, messages: [] }}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={vi.fn()}
      />,
    )

    expect(screen.getByText('Начать диалог')).toBeInTheDocument()
  })

  it('отображает заголовок чата и название компании', () => {
    render(
      <ChatWindow
        chat={chat}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={vi.fn()}
      />,
    )

    expect(screen.getByText('Обсуждение проекта')).toBeInTheDocument()
    expect(screen.getByText(/Компания Альфа/)).toBeInTheDocument()
  })

  it('отображает количество документов', () => {
    render(
      <ChatWindow
        chat={chat}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={vi.fn()}
      />,
    )

    expect(screen.getByText('• 12 документа')).toBeInTheDocument()
  })

  it('отображает историю сообщений', () => {
    render(
      <ChatWindow
        chat={chat}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={vi.fn()}
      />,
    )

    expect(screen.getByText('Привет!')).toBeInTheDocument()
    expect(screen.getByText('Здравствуйте!')).toBeInTheDocument()
  })

  it('отправляет сообщение по кнопке и очищает поле ввода', () => {
    const onSend = vi.fn()

    render(
      <ChatWindow
        chat={chat}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={onSend}
      />,
    )

    const input = screen.getByPlaceholderText(
      'Задайте вопрос по материалам компании...',
    )

    fireEvent.change(input, {
      target: { value: 'Новый вопрос' },
    })

    fireEvent.click(screen.getByText('Отправить'))

    expect(onSend).toHaveBeenCalledWith('Новый вопрос')
    expect(input).toHaveValue('')
  })

  it('отправляет сообщение по Enter и очищает поле ввода', () => {
    const onSend = vi.fn()

    render(
      <ChatWindow
        chat={chat}
        companyName="Компания Альфа"
        documentCount={12}
        onSend={onSend}
      />,
    )

    const input = screen.getByPlaceholderText(
      'Задайте вопрос по материалам компании...',
    )

    fireEvent.change(input, {
      target: { value: 'Вопрос через Enter' },
    })

    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('Вопрос через Enter')
    expect(input).toHaveValue('')
  })
})
