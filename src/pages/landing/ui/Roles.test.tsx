
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Roles } from './Roles'

describe('Roles', () => {
  it('отображает заголовок секции', () => {
    render(<Roles />)

    expect(
      screen.getByRole('heading', {
        name: 'Роли под структуру компании',
      })
    ).toBeInTheDocument()
  })

  it('отображает описание ролей', () => {
    render(<Roles />)

    expect(
      screen.getByText(
        'Владелец управляет доступом, команда — работает со знаниями.'
      )
    ).toBeInTheDocument()
  })

  it('отображает роль владельца', () => {
    render(<Roles />)

    expect(screen.getByText('Владелец')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Полный доступ, подтверждение заявок, биллинг и удаление компании.'
      )
    ).toBeInTheDocument()
  })

  it('отображает роль администратора', () => {
    render(<Roles />)

    expect(screen.getByText('Администратор')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Управление участниками, документами и публичными ссылками.'
      )
    ).toBeInTheDocument()
  })

  it('отображает роль участника', () => {
    render(<Roles />)

    expect(screen.getByText('Участник')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Загрузка материалов, чат с ИИ, работа с задачами.'
      )
    ).toBeInTheDocument()
  })

  it('отображает роль наблюдателя', () => {
    render(<Roles />)

    expect(screen.getByText('Наблюдатель')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Просмотр конспектов и решений без права загрузки.'
      )
    ).toBeInTheDocument()
  })
})
