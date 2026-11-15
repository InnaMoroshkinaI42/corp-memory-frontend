
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BillingTab } from './BillingTab'

describe('BillingTab', () => {
  it('отображает заголовок текущего тарифа', () => {
    render(<BillingTab />)

    expect(screen.getByText('Текущий тариф')).toBeInTheDocument()
  })

  it('отображает название тарифа', () => {
    render(<BillingTab />)

    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('отображает информацию об использовании хранилища', () => {
    render(<BillingTab />)

    expect(screen.getByText('2,4 из 10 ГБ использовано')).toBeInTheDocument()
  })

  it('отображает статус тарифа', () => {
    render(<BillingTab />)

    expect(screen.getByText('Активен')).toBeInTheDocument()
  })

  it('отображает кнопку управления тарифом', () => {
    render(<BillingTab />)

    expect(
      screen.getByRole('button', { name: 'Управление тарифом' })
    ).toBeInTheDocument()
  })

  it('отображает индикатор использования хранилища на 24%', () => {
    const { container } = render(<BillingTab />)

    const progressBar = container.querySelector('[style="width: 24%;"]')

    expect(progressBar).toBeInTheDocument()
  })
})
