
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemberRequestCard } from './MemberRequestCard'

describe('MemberRequestCard', () => {
  const requests = [
    {
      uuid: 'request-1',
      initials: 'ИИ',
      user_name: 'Иван Иванов',
      user_email: 'ivan@example.com',
      dateText: '15 ноября, 10:30',
    },
    {
      uuid: 'request-2',
      initials: 'МП',
      user_name: 'Мария Петрова',
      user_email: 'maria@example.com',
      dateText: '15 ноября, 11:00',
    },
  ]

  it('не отображает карточку, если заявок нет', () => {
  const onApprove = vi.fn()
  const onReject = vi.fn()

  const { container } = render(
    <MemberRequestCard
      requests={[]}
      onApprove={onApprove}
      onReject={onReject}
    />,
  )

  expect(container.querySelector('[data-slot="card"]')).toBeNull()
})

  it('отображает заголовок с количеством заявок', () => {
    render(
      <MemberRequestCard requests={requests} onReject={vi.fn()} onApprove={vi.fn()} />,
    )

    expect(
      screen.getByText('Запросы на вступление · 2'),
    ).toBeInTheDocument()
  })

  it('отображает информацию о каждом заявителе', () => {
  render(
    <MemberRequestCard requests={requests} onApprove={vi.fn()} onReject={vi.fn()} />,
  )

  expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
  expect(screen.getByText('ИИ')).toBeInTheDocument()

  expect(
    screen.getByText(/ivan@example\.com/),
  ).toBeInTheDocument()

  expect(screen.getByText(/15 ноября, 10:30/)).toBeInTheDocument()

  expect(screen.getByText('Мария Петрова')).toBeInTheDocument()
  expect(screen.getByText('МП')).toBeInTheDocument()

  expect(
    screen.getByText(/maria@example\.com/),
  ).toBeInTheDocument()

  expect(screen.getByText(/15 ноября, 10:30/)).toBeInTheDocument()
})

  it('отображает статус ожидания подтверждения для каждой заявки', () => {
    render(
      <MemberRequestCard requests={requests} onReject={vi.fn()} onApprove={vi.fn()} />,
    )

    expect(
      screen.getAllByText('Ожидает подтверждения'),
    ).toHaveLength(2)
  })

  it('вызывает onApprove с ID выбранной заявки', () => {
    const onApprove = vi.fn()

    render(
      <MemberRequestCard requests={requests} onApprove={onApprove} onReject={vi.fn()}/>,
    )

    fireEvent.click(
      screen.getAllByRole('button', { name: 'Одобрить' })[0],
    )

    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(onApprove).toHaveBeenCalledWith('request-1')
  })

  it('передаёт правильный ID при одобрении второй заявки', () => {
    const onApprove = vi.fn()

    render(
      <MemberRequestCard requests={requests} onApprove={onApprove} onReject={vi.fn()}/>,
    )

    fireEvent.click(
      screen.getAllByRole('button', { name: 'Одобрить' })[1],
    )

    expect(onApprove).toHaveBeenCalledWith('request-2')
  })

  it('отображает кнопки одобрения и отклонения для каждой заявки', () => {
    render(
      <MemberRequestCard requests={requests} onReject={vi.fn()} onApprove={vi.fn()} />,
    )

    expect(screen.getAllByRole('button', { name: 'Одобрить' }))
      .toHaveLength(2)

    expect(screen.getAllByRole('button', { name: 'Отклонить' }))
      .toHaveLength(2)
  })

  it('отображает пояснение о роли пользователя после одобрения', () => {
    render(
      <MemberRequestCard requests={requests} onReject={vi.fn()} onApprove={vi.fn()} />,
    )

    expect(
      screen.getByText('После одобрения пользователь получит роль «Участник».'),
    ).toBeInTheDocument()
  })

  it('вызывает onReject с ID выбранной заявки', () => {
  const onReject = vi.fn()

  render(
    <MemberRequestCard
      requests={requests}
      onApprove={vi.fn()}
      onReject={onReject}
    />,
  )

  fireEvent.click(
    screen.getAllByRole('button', { name: 'Отклонить' })[0],
  )

  expect(onReject).toHaveBeenCalledTimes(1)
  expect(onReject).toHaveBeenCalledWith('request-1')
})
})
