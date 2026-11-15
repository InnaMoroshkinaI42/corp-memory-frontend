
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InviteLinkCard } from './InviteLinkCard'

describe('InviteLinkCard', () => {
  const companyId = 'company-123'
  const writeTextMock = vi.fn()

  beforeEach(() => {
    writeTextMock.mockReset()
    writeTextMock.mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    })

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'new-code-1234-5678'),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('отображает заголовок и срок действия ссылки', () => {
    render(<InviteLinkCard companyId={companyId} />)

    expect(screen.getByText('Ссылка-приглашение'))
      .toBeInTheDocument()

    expect(screen.getByText('Срок действия уточняется'))
      .toBeInTheDocument()
  })

  it('формирует ссылку с переданным ID компании', () => {
    render(<InviteLinkCard companyId={companyId} />)

    expect(
      screen.getByDisplayValue(
        'app.meetmind.ru/join/company-123-k7m2',
      ),
    ).toBeInTheDocument()
  })

  it('делает поле со ссылкой доступным только для чтения', () => {
    render(<InviteLinkCard companyId={companyId} />)

    expect(
      screen.getByDisplayValue(
        'app.meetmind.ru/join/company-123-k7m2',
      ),
    ).toHaveAttribute('readonly')
  })

  it('копирует ссылку в буфер обмена', async () => {
    render(<InviteLinkCard companyId={companyId} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Скопировать' }),
    )

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        'app.meetmind.ru/join/company-123-k7m2',
      )
    })
  })

  it('показывает подтверждение после копирования', async () => {
    render(<InviteLinkCard companyId={companyId} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Скопировать' }),
    )

    expect(
      await screen.findByRole('button', { name: 'Скопировано' }),
    ).toBeInTheDocument()
  })

  it('генерирует новую ссылку при обновлении', () => {
    render(<InviteLinkCard companyId={companyId} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Обновить ссылку' }),
    )

    expect(
      screen.getByDisplayValue(
        'app.meetmind.ru/join/company-123-newcode1',
      ),
    ).toBeInTheDocument()
  })

  it('сбрасывает подтверждение копирования после обновления ссылки', async () => {
    render(<InviteLinkCard companyId={companyId} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Скопировать' }),
    )

    expect(
      await screen.findByRole('button', { name: 'Скопировано' }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Обновить ссылку' }),
    )

    expect(
      screen.getByRole('button', { name: 'Скопировать' }),
    ).toBeInTheDocument()
  })

  it('показывает ошибку при неудачном копировании', async () => {
    writeTextMock.mockRejectedValueOnce(
      new Error('Clipboard error'),
    )

    render(<InviteLinkCard companyId={companyId} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Скопировать' }),
    )

    expect(
      await screen.findByText('Не удалось скопировать ссылку'),
    ).toBeInTheDocument()
  })

  it('отображает условия вступления по приглашению', () => {
    render(<InviteLinkCard companyId={companyId} />)

    expect(
      screen.getByText(
        'Вступление по ссылке — только после одобрения владельцем.',
      ),
    ).toBeInTheDocument()

    expect(screen.getByText('Обязательно'))
      .toBeInTheDocument()
  })
})
