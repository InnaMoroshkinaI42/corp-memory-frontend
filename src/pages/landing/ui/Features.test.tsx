
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Features } from './Features'

describe('Features', () => {
  it('отображает заголовок секции', () => {
    render(<Features />)

    expect(
      screen.getByRole('heading', {
        name: 'Общая память, на которую можно опереться',
      })
    ).toBeInTheDocument()
  })

  it('отображает описание возможностей', () => {
    render(<Features />)

    expect(
      screen.getByText('Меньше повторных вопросов и забытых договорённостей.')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Больше ясности — на встрече, после неё и через месяц.')
    ).toBeInTheDocument()
  })

  it('отображает карточку материалов', () => {
    render(<Features />)

    expect(
      screen.getByText('Все материалы в одном месте')
    ).toBeInTheDocument()

    expect(screen.getByText('Единая база')).toBeInTheDocument()
  })

  it('отображает карточку ИИ-конспектов', () => {
    render(<Features />)

    expect(
      screen.getByText('ИИ-конспект, решения и задачи')
    ).toBeInTheDocument()

    expect(screen.getByText('AI-анализ')).toBeInTheDocument()
  })

  it('отображает карточку решений', () => {
    render(<Features />)

    expect(
      screen.getByText('Решения, которые не теряются')
    ).toBeInTheDocument()

    expect(screen.getByText('Решения')).toBeInTheDocument()
  })

  it('отображает карточку задач', () => {
    render(<Features />)

    expect(
      screen.getByText('Понятно, кто и что делает')
    ).toBeInTheDocument()

    expect(screen.getByText('Задачи')).toBeInTheDocument()
  })

  it('отображает карточку ответов с доказательствами', () => {
    render(<Features />)

    expect(
      screen.getByText('Ответы с доказательствами')
    ).toBeInTheDocument()

    expect(screen.getByText('Чаты с ИИ')).toBeInTheDocument()
  })

  it('отображает карточку доступа компании', () => {
    render(<Features />)

    expect(
      screen.getByText('Компания — граница доступа')
    ).toBeInTheDocument()

    expect(screen.getByText('Доступы')).toBeInTheDocument()
  })
})
