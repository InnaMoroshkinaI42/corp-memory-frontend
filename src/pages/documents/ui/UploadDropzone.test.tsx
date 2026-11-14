
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadDropzone } from './UploadDropzone'

describe('UploadDropzone', () => {
  it('отображает выбранные файлы', () => {
    const file = new File(['test'], 'document.txt', {
      type: 'text/plain',
    })

    render(
      <UploadDropzone
        files={[file]}
        onFilesChange={vi.fn()}
      />,
    )

    expect(screen.getByText('document.txt')).toBeInTheDocument()
  })

  it('передаёт выбранные файлы родительскому компоненту', async () => {
    const user = userEvent.setup()
    const onFilesChange = vi.fn()

    const { container } = render(
      <UploadDropzone
        files={[]}
        onFilesChange={onFilesChange}
      />,
    )

    const file = new File(['test'], 'report.txt', {
      type: 'text/plain',
    })

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    await user.upload(input, file)

    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('удаляет файл из списка', async () => {
    const user = userEvent.setup()
    const onFilesChange = vi.fn()

    const firstFile = new File(['first'], 'first.txt')
    const secondFile = new File(['second'], 'second.txt')

    render(
      <UploadDropzone
        files={[firstFile, secondFile]}
        onFilesChange={onFilesChange}
      />,
    )

    const removeButtons = screen.getAllByRole('button')
    await user.click(removeButtons[1])

    expect(onFilesChange).toHaveBeenCalledWith([firstFile])
  })

  it('добавляет файлы при перетаскивании', () => {
    const onFilesChange = vi.fn()
    const existingFile = new File(['old'], 'old.txt')
    const newFile = new File(['new'], 'new.txt')

    const { container } = render(
      <UploadDropzone
        files={[existingFile]}
        onFilesChange={onFilesChange}
      />,
    )

    const dropzone = container.querySelector(
      '.border-dashed',
    ) as HTMLElement

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [newFile],
      },
    })

    expect(onFilesChange).toHaveBeenCalledWith([
      existingFile,
      newFile,
    ])
  })
})
