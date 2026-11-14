
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeftIcon, UploadIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { UploadDropzone } from './ui/UploadDropzone'
import { ProcessingStatus } from './ui/ProcessingStatus'

type UploadPayload = {
  companyId: string
  files: File[]
  content: string
  title: string
  language: string
  mode: 'files' | 'text'
}

export function UploadDocumentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [files, setFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState<'files' | 'text'>('files')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Русский')
  const [error, setError] = useState('')

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await fetch(`/api/companies/${id}`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить компанию')
      }
      return response.json()
    },
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: async (payload: UploadPayload) => {
      const formData = new FormData()
      formData.append('company_id', payload.companyId)
      formData.append('title', payload.title)
      formData.append('language', payload.language)
      formData.append('mode', payload.mode)

      if (payload.mode === 'files') {
        payload.files.forEach((file) => {
          formData.append('files', file)
        })
      } else {
        formData.append('content', payload.content)
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.message || 'Не удалось загрузить документ')
      }

      return response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['documents', id],
      })
      navigate(`/app/documents/${id}`)
    },
    onError: (uploadError: Error) => {
      setError(uploadError.message)
    },
  })

  const handleSubmit = () => {
    setError('')

    if (!id) {
      setError('Не удалось определить компанию')
      return
    }

    if (!title.trim()) {
      setError('Укажите название документа')
      return
    }

    if (activeTab === 'files' && files.length === 0) {
      setError('Выберите хотя бы один файл')
      return
    }

    if (activeTab === 'text' && !content.trim()) {
      setError('Введите текст документа')
      return
    }

    mutation.mutate({
      companyId: id,
      files,
      content: content.trim(),
      title: title.trim(),
      language,
      mode: activeTab,
    })
  }

  if (isCompanyLoading) {
    return <div className="p-8">Загрузка...</div>
  }

  if (!company) {
    return <div className="p-8">Компания не найдена</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Загрузить документ
          </h1>
          <p className="mt-2 text-[var(--text-2)]">
            Новые материалы попадут в память компании «{company.name}».
          </p>
        </div>

        <Link to={`/app/documents/${id}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Назад к документам
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6 border-b border-[var(--border)] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('files')}
                  className={`pb-3 text-sm font-medium ${
                    activeTab === 'files'
                      ? 'text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]'
                      : 'text-[var(--text-3)]'
                  }`}
                >
                  Загрузка файлов
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`pb-3 text-sm font-medium ${
                    activeTab === 'text'
                      ? 'text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]'
                      : 'text-[var(--text-3)]'
                  }`}
                >
                  Текстовая запись
                </button>
              </div>

              {activeTab === 'files' ? (
                <UploadDropzone
                  files={files}
                  onFilesChange={setFiles}
                />
              ) : (
                <textarea
                  aria-label="Текст документа"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="w-full min-h-[200px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-[var(--brand-primary)] resize-none"
                  placeholder="Вставьте заметки..."
                />
              )}

              <div className="border-t border-[var(--border)] pt-6 mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Название документа</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например, Планирование запуска Atlas"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Компания</Label>
                    <div className="flex h-10 items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-2)]">
                      {company.name} · {company.uuid}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="language">Язык записи</Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="h-10 w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm"
                    >
                      <option value="Русский">Русский</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
                <Link to={`/app/documents/${id}`}>
                  <Button variant="outline" type="button">
                    Отмена
                  </Button>
                </Link>

                <Button
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="gap-2"
                >
                  <UploadIcon className="size-4" />
                  {mutation.isPending
                    ? 'Загрузка...'
                    : 'Загрузить и обработать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ProcessingStatus />
        </div>
      </div>
    </div>
  )
}
