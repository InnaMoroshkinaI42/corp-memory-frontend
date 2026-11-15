
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from './LandingPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  )
}

describe('LandingPage', () => {
  it('отображает название MeetMind в шапке и подвале', () => {
    renderPage()

    expect(screen.getAllByText('MeetMind')).toHaveLength(3)
  })

  it('отображает навигацию по разделам лендинга', () => {
  renderPage()

  const featuresLinks = screen.getAllByRole('link', {
    name: 'Возможности',
  })

  const howLinks = screen.getAllByRole('link', {
    name: 'Как это работает',
  })

  const rolesLinks = screen.getAllByRole('link', {
    name: 'Роли',
  })

  expect(featuresLinks).toHaveLength(2)
  expect(howLinks).toHaveLength(2)
  expect(rolesLinks).toHaveLength(1)

  featuresLinks.forEach(link => {
    expect(link).toHaveAttribute('href', '#features')
  })

  howLinks.forEach(link => {
    expect(link).toHaveAttribute('href', '#how')
  })

  expect(rolesLinks[0]).toHaveAttribute('href', '#roles')
})

  it('содержит ссылки для входа и регистрации', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute(
      'href',
      '/login'
    )

    const registerLinks = screen.getAllByRole('link', {
      name: /Попробовать бесплатно|Начать бесплатно/,
    })

    expect(registerLinks).toHaveLength(2)

    registerLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/register')
    })
  })

  it('отображает основные разделы лендинга', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Общая память, на которую можно опереться' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Как это работает' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Роли под структуру компании' })
    ).toBeInTheDocument()
  })

  it('отображает заключительный призыв к регистрации', () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        name: 'Начните собирать память компании сегодня',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Создайте компанию, добавьте запись и задайте первый вопрос.')
    ).toBeInTheDocument()

    expect(screen.getByText('14 дней · без банковской карты')).toBeInTheDocument()
  })

  it('отображает информацию в подвале', () => {
    renderPage()

    const footer = document.querySelector('footer')

    expect(footer).toBeInTheDocument()

    expect(within(footer as HTMLElement).getByText('MeetMind')).toBeInTheDocument()

    expect(
      within(footer as HTMLElement).getByText(/Знания, которые остаются с командой/)
    ).toBeInTheDocument()

    expect(
      within(footer as HTMLElement).getByText(/2026 MeetMind/)
    ).toBeInTheDocument()

    expect(
      within(footer as HTMLElement).getByText(/Политика конфиденциальности/)
    ).toBeInTheDocument()
  })
})
