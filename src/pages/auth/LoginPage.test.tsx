import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('отображает заголовок страницы входа', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('С возвращением')).toBeInTheDocument()
  })

  it('отображает поля email и пароля', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByDisplayValue('alexey@sever.team')).toBeInTheDocument()
    expect(screen.getByDisplayValue('пумпум')).toBeInTheDocument()
  })

  it('отображает кнопку входа через Google', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: /Продолжить с Google/i }),
    ).toBeInTheDocument()
  })

  it('содержит ссылки на регистрацию и главную страницу', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: /Зарегистрироваться/i }),
    ).toHaveAttribute('href', '/register')

    expect(
      screen.getByRole('link', { name: /На главную/i }),
    ).toHaveAttribute('href', '/')
  })

  it('перенаправляет на страницу компаний после отправки формы', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/companies"
            element={<div>Страница компаний</div>}
          />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /Войти/i }))

    expect(screen.getByText('Страница компаний')).toBeInTheDocument()
  })
})