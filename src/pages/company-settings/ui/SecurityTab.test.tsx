
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { SecurityTab } from './SecurityTab'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('SecurityTab', () => {
  it('отображает заголовки разделов', () => {
    render(<SecurityTab />)

    expect(screen.getByText('Правила вступления')).toBeInTheDocument()
    expect(screen.getByText('Хранение материалов')).toBeInTheDocument()
  })

  it('отображает описание настроек безопасности', () => {
    render(<SecurityTab />)

    expect(
      screen.getByText('Новые участники входят только после одобрения.')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Разрешить Администраторам создавать ссылки.')
    ).toBeInTheDocument()
  })

  it('по умолчанию требует подтверждение владельцем', () => {
    render(<SecurityTab />)

    const switches = screen.getAllByRole('switch')

    expect(switches[0]).toHaveAttribute('data-state', 'checked')
  })

  it('по умолчанию запрещает публичные ссылки', () => {
    render(<SecurityTab />)

    const switches = screen.getAllByRole('switch')

    expect(switches[1]).toHaveAttribute('data-state', 'unchecked')
  })

  it('позволяет переключать настройки безопасности', () => {
    render(<SecurityTab />)

    const switches = screen.getAllByRole('switch')

    fireEvent.click(switches[0])
    expect(switches[0]).toHaveAttribute('data-state', 'unchecked')

    fireEvent.click(switches[1])
    expect(switches[1]).toHaveAttribute('data-state', 'checked')
  })

  it('по умолчанию устанавливает неограниченный срок хранения', () => {
    render(<SecurityTab />)

    expect(screen.getByRole('combobox')).toHaveTextContent('Без ограничений')
  })

  it('позволяет выбрать другой срок хранения', () => {
    render(<SecurityTab />)

    fireEvent.click(screen.getByRole('combobox'))

    fireEvent.click(screen.getByRole('option', { name: '12 месяцев' }))

    expect(screen.getByRole('combobox')).toHaveTextContent('12 месяцев')
  })

  it('отображает все варианты срока хранения', () => {
    render(<SecurityTab />)

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option', { name: 'Без ограничений' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '12 месяцев' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '6 месяцев' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '90 дней' })).toBeInTheDocument()
  })

  it('отображает кнопку сохранения настроек', () => {
    render(<SecurityTab />)

    expect(
      screen.getByRole('button', { name: 'Сохранить настройки безопасности' })
    ).toBeInTheDocument()
  })
})
