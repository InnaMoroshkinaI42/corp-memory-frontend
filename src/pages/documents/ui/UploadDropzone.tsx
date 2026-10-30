import { useState } from 'react'
import { UploadIcon, FileTextIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

interface Props {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function UploadDropzone({ files, onFilesChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    onFilesChange([...files, ...Array.from(e.dataTransfer.files)])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Зона Drag-and-Drop */}
      <Card
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-8 cursor-pointer transition-colors ${
          isDragging
            ? 'border-[var(--brand-primary)] bg-[var(--brand-light)]'
            : 'border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--brand-primary)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-white text-[var(--brand-primary)] shadow-sm">
          <UploadIcon className="size-6" />
        </div>
        <div className="text-center">
          <div className="font-semibold text-[var(--text)]">Перетащите файлы сюда</div>
          <p className="text-sm text-[var(--text-3)] mt-1">или выберите их на компьютере</p>
        </div>
        <Button variant="outline" type="button">Выбрать файлы</Button>
        <p className="text-xs text-[var(--text-3)] text-center mt-2">
          Аудио, видео, PDF, DOC, DOCX, MD, TXT · до 500 МБ
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          hidden
          onChange={handleFileInput}
          accept="audio/*,video/*,.pdf,.doc,.docx,.md,.txt"
        />
      </Card>

      {/* Список выбранных файлов (ваш код) */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--surface-2)]">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-white text-[var(--text-2)]">
                  <FileTextIcon className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text)]">{file.name}</div>
                  <div className="text-xs text-[var(--text-3)]">{(file.size / 1024 / 1024).toFixed(1)} МБ</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                <Cross2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}