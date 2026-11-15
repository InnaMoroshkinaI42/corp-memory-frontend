
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Hero } from './Hero'

function renderComponent() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('отображает основной заголовок', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', {
        name: /Каждая встреча компании становится знанием, а не потерянной записью/,
      })
    ).toBeInTheDocument()
  })

  it('отображает описание продукта', () => {
    renderComponent()

    expect(
      screen.getByText(/Превратите записи встреч и документы в общую память компании/)
    ).toBeInTheDocument()
  })

  it('отображает бейдж ИИ-памяти встреч', () => {
    renderComponent()

    expect(screen.getByText('ИИ-память встреч для команд')).toBeInTheDocument()
  })

  it('содержит ссылку для создания компании', () => {
    renderComponent()

    expect(
      screen.getByRole('link', { name: /Создать компанию/ })
    ).toHaveAttribute('href', '/register')
  })

  it('отображает кнопку просмотра демо', () => {
    renderComponent()

    expect(
      screen.getByRole('button', { name: /Посмотреть демо/ })
    ).toBeInTheDocument()
  })

  it('отображает демонстрацию интерфейса компании', () => {
    renderComponent()

    expect(screen.getByText('Обзор компании')).toBeInTheDocument()
    expect(screen.getByText('Последняя встреча')).toBeInTheDocument()
    expect(screen.getByText('Планирование запуска Atlas')).toBeInTheDocument()
    expect(screen.getByText('Когда запускаем Atlas?')).toBeInTheDocument()
  })
})
