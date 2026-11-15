
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('отображает заголовок секции', () => {
    render(<HowItWorks />)

    expect(
      screen.getByRole('heading', { name: 'Как это работает' })
    ).toBeInTheDocument()
  })

  it('отображает описание процесса', () => {
    render(<HowItWorks />)

    expect(
      screen.getByText('Четыре шага от записи до ответа.')
    ).toBeInTheDocument()
  })

  it('отображает первый шаг создания компании', () => {
    render(<HowItWorks />)

    expect(screen.getByText('Создайте компанию')).toBeInTheDocument()

    expect(
      screen.getByText(/Соберите команду по ID или ссылке/)
    ).toBeInTheDocument()
  })

  it('отображает второй шаг добавления материалов', () => {
    render(<HowItWorks />)

    expect(screen.getByText('Добавьте материалы')).toBeInTheDocument()

    expect(
      screen.getByText(/Загрузите запись встречи/)
    ).toBeInTheDocument()
  })

  it('отображает третий шаг работы ИИ', () => {
    render(<HowItWorks />)

    expect(screen.getByText('Доверьте рутину ИИ')).toBeInTheDocument()

    expect(
      screen.getByText(/Транскрибация и анализ выделят главное/)
    ).toBeInTheDocument()
  })

  it('отображает четвёртый шаг вопросов и действий', () => {
    render(<HowItWorks />)

    expect(
      screen.getByText('Спрашивайте и действуйте')
    ).toBeInTheDocument()

    expect(
      screen.getByText(/получите ответ с источниками/)
    ).toBeInTheDocument()
  })

  it('отображает этапы обработки материалов', () => {
    render(<HowItWorks />)

    expect(screen.getByText('Загрузка')).toBeInTheDocument()
    expect(screen.getByText('Транскрибация')).toBeInTheDocument()
    expect(screen.getByText('AI-анализ')).toBeInTheDocument()
  })
})
