
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MembersTable } from './MembersTable'

const mockMembers = [
  {
    uuid: 'member-1',
    first_name: 'Иван',
    last_name: 'Иванов',
    email: 'ivan@example.com',
    role: 'Владелец',
  },
  {
    uuid: 'member-2',
    first_name: 'Анна',
    last_name: 'Петрова',
    email: 'anna@example.com',
    role: 'Участник',
  },
]

describe('MembersTable', () => {
  it('отображает заголовки таблицы', () => {
    render(<MembersTable members={mockMembers} />)

    expect(screen.getByText('Участник', { selector: 'th' })).toBeInTheDocument()
    expect(screen.getByText('Роль')).toBeInTheDocument()
    expect(screen.getByText('Дата вступления')).toBeInTheDocument()
    expect(screen.getByText('Статус')).toBeInTheDocument()
  })

  it('отображает имя и фамилию участника', () => {
    render(<MembersTable members={mockMembers} />)

    expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
    expect(screen.getByText('Анна Петрова')).toBeInTheDocument()
  })

  it('отображает email каждого участника', () => {
    render(<MembersTable members={mockMembers} />)

    expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
  })

  it('отображает инициалы участников в аватарах', () => {
    render(<MembersTable members={mockMembers} />)

    expect(screen.getByText('ИИ')).toBeInTheDocument()
    expect(screen.getByText('АП')).toBeInTheDocument()
  })

  it('отображает роль каждого участника', () => {
  render(<MembersTable members={mockMembers} />)

  expect(screen.getByText('Владелец')).toBeInTheDocument()

  const participantRoles = screen.getAllByText('Участник')
  expect(participantRoles).toHaveLength(2)
})

  it('отображает дату вступления и активный статус', () => {
    render(<MembersTable members={mockMembers} />)

    const dates = screen.getAllByText('1 окт 2026')
    const statuses = screen.getAllByText('Активен')

    expect(dates).toHaveLength(2)
    expect(statuses).toHaveLength(2)
  })

  it('создаёт отдельную строку для каждого участника', () => {
    render(<MembersTable members={mockMembers} />)

    const rows = screen.getAllByRole('row')

    // Одна строка заголовков и две строки участников
    expect(rows).toHaveLength(3)
  })

  it('не отображает строки участников, если список пуст', () => {
    render(<MembersTable members={[]} />)

    const rows = screen.getAllByRole('row')

    // Остаётся только строка заголовков
    expect(rows).toHaveLength(1)
    expect(screen.queryByText('Иван Иванов')).not.toBeInTheDocument()
  })
})
