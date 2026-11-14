
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthInput } from './AuthInput'

describe('AuthInput', () => {
  it('отображает поле ввода', () => {
    render(<AuthInput placeholder="Введите email" />)

    expect(
      screen.getByPlaceholderText('Введите email'),
    ).toBeInTheDocument()
  })

  it('отображает иконку email', () => {
    const { container } = render(<AuthInput icon="email" />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('отображает иконку пароля', () => {
    const { container } = render(<AuthInput icon="lock" />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('передаёт тип поля input', () => {
    render(<AuthInput type="password" placeholder="Пароль" />)

    expect(screen.getByPlaceholderText('Пароль')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('передаёт значение поля', () => {
    render(<AuthInput value="test@example.com" readOnly />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })
})
