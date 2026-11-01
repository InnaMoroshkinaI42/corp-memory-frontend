import { CheckCircledIcon, ClockIcon, RocketIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function ProcessingStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Обработка документа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircledIcon className="size-4 text-[var(--success)]" />
          <span className="text-sm">Загрузка завершена</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-[var(--brand-primary)]" />
          <span className="text-sm">Транскрибация — 68%</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <RocketIcon className="size-4" />
          <span className="text-sm">AI-анализ</span>
        </div>
        <Button disabled variant="secondary" className="w-full">Обработка идёт...</Button>
      </CardContent>
    </Card>
  )
}