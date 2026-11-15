
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { SupportPage } from './SupportPage'

describe('SupportPage', () => {
  it('отображает заголовок и описание страницы', () => {
    render(<SupportPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Помощь и поддержка',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Найдите ответ или свяжитесь с нами.'),
    ).toBeInTheDocument()
  })

  it('отображает поле поиска по вопросам', () => {
    render(<SupportPage />)

    expect(
      screen.getByPlaceholderText('Поиск по вопросам...'),
    ).toBeInTheDocument()
  })

  it('отображает заголовок раздела частых вопросов', () => {
    render(<SupportPage />)

    expect(
      screen.getByText('Частые вопросы'),
    ).toBeInTheDocument()
  })

  it('отображает все четыре вопроса FAQ', () => {
    render(<SupportPage />)

    expect(
      screen.getByRole('button', { name: 'Как загрузить документ?' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Как пригласить коллегу?' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Как задать вопрос ИИ?' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Кто может удалить компанию?' }),
    ).toBeInTheDocument()
  })

  it('раскрывает ответ на вопрос о загрузке документа', () => {
    render(<SupportPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Как загрузить документ?' }),
    )

    expect(
      screen.getByText(/Поддерживаются аудио, видео, PDF, DOC, DOCX, MD, TXT/),
    ).toBeInTheDocument()
  })

  it('раскрывает ответ на вопрос о приглашении коллеги', () => {
    render(<SupportPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Как пригласить коллегу?' }),
    )

    expect(
      screen.getByText(/Новый участник появится после подтверждения владельцем/),
    ).toBeInTheDocument()
  })

  it('раскрывает ответ на вопрос о правах удаления компании', () => {
    render(<SupportPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Кто может удалить компанию?' }),
    )

    expect(
      screen.getByText(/Только владелец компании/),
    ).toBeInTheDocument()
  })

  it('содержит ссылку для обращения в поддержку', () => {
    render(<SupportPage />)

    expect(
      screen.getByRole('link', { name: 'Написать в поддержку' }),
    ).toHaveAttribute('href', 'mailto:support@meetmind.ru')
  })

  it('отображает текст о сроке ответа поддержки', () => {
    render(<SupportPage />)

    expect(
      screen.getByText(
        'Не нашли ответ? Напишите нам — ответим в течение рабочего дня.',
      ),
    ).toBeInTheDocument()
  })
})
