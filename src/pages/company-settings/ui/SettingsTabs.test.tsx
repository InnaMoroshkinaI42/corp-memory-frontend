
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsTabs } from './SettingsTabs'

describe('SettingsTabs', () => {
  it('отображает все три вкладки', () => {
    render(
      <SettingsTabs
        activeTab="Основные"
        onTabChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Основные' }))
      .toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Доступы и безопасность' }))
      .toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Тариф и оплата' }))
      .toBeInTheDocument()
  })

  it('вызывает onTabChange при выборе основных настроек', () => {
    const onTabChange = vi.fn()

    render(
      <SettingsTabs
        activeTab="Основные"
        onTabChange={onTabChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Основные' }))

    expect(onTabChange).toHaveBeenCalledWith('Основные')
  })

  it('вызывает onTabChange при выборе настроек безопасности', () => {
    const onTabChange = vi.fn()

    render(
      <SettingsTabs
        activeTab="Основные"
        onTabChange={onTabChange}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Доступы и безопасность' }),
    )

    expect(onTabChange).toHaveBeenCalledWith('Доступы и безопасность')
  })

  it('выделяет активную вкладку', () => {
    render(
      <SettingsTabs
        activeTab="Тариф и оплата"
        onTabChange={vi.fn()}
      />,
    )

    const activeTab = screen.getByRole('button', {
      name: 'Тариф и оплата',
    })

    const inactiveTab = screen.getByRole('button', {
      name: 'Основные',
    })

    expect(activeTab).toHaveClass('text-[var(--brand-primary)]')
    expect(activeTab).toHaveClass('border-b-2')
    expect(inactiveTab).toHaveClass('text-[var(--text-2)]')
  })
})
