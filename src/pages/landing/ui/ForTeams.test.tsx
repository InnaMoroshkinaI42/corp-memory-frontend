
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ForTeams } from './ForTeams'

describe('ForTeams', () => {
  it('отображает заголовок секции', () => {
    render(<ForTeams />)

    expect(
      screen.getByText('Для команд, которым важно помнить')
    ).toBeInTheDocument()
  })

  it('отображает продуктовые команды', () => {
    render(<ForTeams />)

    expect(screen.getByText('Продуктовые команды')).toBeInTheDocument()
  })

  it('отображает консалтинг', () => {
    render(<ForTeams />)

    expect(screen.getByText('Консалтинг')).toBeInTheDocument()
  })

  it('отображает разработку', () => {
    render(<ForTeams />)

    expect(screen.getByText('Разработка')).toBeInTheDocument()
  })

  it('отображает HR и операции', () => {
    render(<ForTeams />)

    expect(screen.getByText('HR и операции')).toBeInTheDocument()
  })
})
