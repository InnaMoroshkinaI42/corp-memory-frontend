
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationsCard } from './NotificationsCard'

describe('NotificationsCard', () => {
  it('отображает заголовок карточки', () => {
    render(<NotificationsCard />)

    expect(screen.getByText('Уведомления')).toBeInTheDocument()
  })

  it('отображает уведомление о готовности документа', () => {
    render(<NotificationsCard />)

    expect(screen.getByText('Документ готов')).toBeInTheDocument()
    expect(
      screen.getByText('Письмо после транскрибации и AI-анализа')
    ).toBeInTheDocument()
  })

  it('отображает уведомление о запросах на вступление', () => {
    render(<NotificationsCard />)

    expect(screen.getByText('Запросы на вступление')).toBeInTheDocument()
    expect(
      screen.getByText('Новые заявки в компании, где вы владелец')
    ).toBeInTheDocument()
  })

  it('отображает два включённых переключателя', () => {
    render(<NotificationsCard />)

    const switches = screen.getAllByRole('switch')

    expect(switches).toHaveLength(2)
    expect(switches[0]).toBeChecked()
    expect(switches[1]).toBeChecked()
  })

  it('позволяет выключить уведомление о готовности документа', async () => {
    const user = userEvent.setup()
    render(<NotificationsCard />)

    const switches = screen.getAllByRole('switch')

    await user.click(switches[0])

    expect(switches[0]).not.toBeChecked()
    expect(switches[1]).toBeChecked()
  })

  it('позволяет выключить уведомления о запросах на вступление', async () => {
    const user = userEvent.setup()
    render(<NotificationsCard />)

    const switches = screen.getAllByRole('switch')

    await user.click(switches[1])

    expect(switches[0]).toBeChecked()
    expect(switches[1]).not.toBeChecked()
  })
})
