import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  it('отображает заголовок регистрации', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Создать аккаунт' }),
).toBeInTheDocument()
  })

  it('отображает поле имени и фамилии', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByPlaceholderText('Например, Иван Петров'),
    ).toBeInTheDocument()
  })

  it('отображает поля email и пароля', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByPlaceholderText('you@company.ru'),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('Минимум 8 символов'),
    ).toBeInTheDocument()
  })

  it('отображает чекбокс согласия с условиями', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('отображает кнопку создания аккаунта', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: /Создать аккаунт/i }),
    ).toBeInTheDocument()
  })

  it('содержит ссылки на вход и главную страницу', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: 'Войти' }),
    ).toHaveAttribute('href', '/login')

    expect(
      screen.getByRole('link', { name: /На главную/i }),
    ).toHaveAttribute('href', '/')
  })
})