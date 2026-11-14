
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyChatState } from './EmptyChatState'

describe('EmptyChatState', () => {
  it('отображает название компании', () => {
    render(
        <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={vi.fn()}
        />,
    )

    expect(screen.getByText(/Atlas · 5/)).toBeInTheDocument()
    })

  it('отображает количество документов', () => {
    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={vi.fn()}
      />,
    )

    expect(screen.getByText(/5/)).toBeInTheDocument()
  })

  it('отправляет введённый вопрос по нажатию кнопки', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={onSend}
      />,
    )

    await user.type(
      screen.getByPlaceholderText('Задайте вопрос...'),
      'Какие решения приняла команда?',
    )

    await user.click(screen.getByRole('button', { name: /Отправить/i }))

    expect(onSend).toHaveBeenCalledWith(
      'Какие решения приняла команда?',
    )
  })

  it('очищает поле после отправки', async () => {
    const user = userEvent.setup()

    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={vi.fn()}
      />,
    )

    const input = screen.getByPlaceholderText('Задайте вопрос...')

    await user.type(input, 'Мой вопрос')
    await user.click(screen.getByRole('button', { name: /Отправить/i }))

    expect(input).toHaveValue('')
  })

  it('не отправляет пустое сообщение', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={onSend}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Отправить/i }))

    expect(onSend).not.toHaveBeenCalled()
  })

  it('не отправляет сообщение из одних пробелов', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={onSend}
      />,
    )

    await user.type(
      screen.getByPlaceholderText('Задайте вопрос...'),
      '     ',
    )

    await user.click(screen.getByRole('button', { name: /Отправить/i }))

    expect(onSend).not.toHaveBeenCalled()
  })

  it('отправляет вопрос по нажатию на подсказку', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(
      <EmptyChatState
        companyName="Atlas"
        documentCount={5}
        onSend={onSend}
      />,
    )

    await user.click(
      screen.getByText('Что решили по запуску Atlas?'),
    )

    expect(onSend).toHaveBeenCalledWith(
      'Что решили по запуску Atlas?',
    )
  })
})
