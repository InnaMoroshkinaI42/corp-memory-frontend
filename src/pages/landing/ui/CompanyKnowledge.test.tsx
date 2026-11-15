
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { CompanyKnowledge } from './CompanyKnowledge'

describe('CompanyKnowledge', () => {
  it('отображает заголовок секции', () => {
  render(<CompanyKnowledge />)

  expect(
    screen.getByRole('heading', {
      level: 2,
      name: /Знания компании.*Не общий доступ\./,
    })
  ).toBeInTheDocument()
})


  it('отображает описание защищённого пространства', () => {
    render(<CompanyKnowledge />)

    expect(
      screen.getByText(/MeetMind создаёт отдельную границу для каждой компании/)
    ).toBeInTheDocument()
  })

  it('отображает преимущества изоляции данных', () => {
    render(<CompanyKnowledge />)

    expect(
      screen.getByText('Изолированные пространства')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Документы и чаты не смешиваются между компаниями.')
    ).toBeInTheDocument()
  })

  it('отображает систему доступа по ролям', () => {
    render(<CompanyKnowledge />)

    expect(screen.getByText('Доступ по ролям')).toBeInTheDocument()

    expect(
      screen.getByText('Владелец, администратор, участник и наблюдатель.')
    ).toBeInTheDocument()
  })

  it('отображает вступление в компанию с подтверждением', () => {
    render(<CompanyKnowledge />)

    expect(
      screen.getByText('Вступление с подтверждением')
    ).toBeInTheDocument()

    expect(
      screen.getByText('ID или ссылка создают запрос, а не открывают данные.')
    ).toBeInTheDocument()
  })

  it('отображает информацию о защите корпоративных данных', () => {
    render(<CompanyKnowledge />)

    expect(
      screen.getByText('Данные не обучают модели')
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Корпоративные материалы используются только для ваших ответов.'
      )
    ).toBeInTheDocument()
  })

  it('отображает пример защищённого пространства компании', () => {
    render(<CompanyKnowledge />)

    expect(screen.getByText('Север')).toBeInTheDocument()

    expect(
      screen.getByText('Защищённое пространство компании')
    ).toBeInTheDocument()

    expect(screen.getByText('24 документа')).toBeInTheDocument()
    expect(screen.getByText('8 чатов')).toBeInTheDocument()
    expect(screen.getByText('Решения и задачи')).toBeInTheDocument()
  })

  it('отображает пример запроса доступа', () => {
    render(<CompanyKnowledge />)

    expect(
      screen.getByText('Елена запрашивает доступ')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Владелец подтверждает вступление')
    ).toBeInTheDocument()

    expect(screen.getByText('Ожидает')).toBeInTheDocument()
  })
})
