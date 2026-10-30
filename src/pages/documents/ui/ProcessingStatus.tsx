import { CheckCircledIcon, ClockIcon, RocketIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function ProcessingStatus() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Обработка документа</CardTitle>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Можно закрыть страницу. Мы сообщим, когда документ будет готов.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* через мок не хочу штопать все это ))
          
          
          <div className="flex items-start gap-3">
            <div className="grid size-7 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
              <CheckCircledIcon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Загрузка</div>
              <div className="text-xs text-[var(--text-3)]"></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid size-7 place-items-center rounded-full bg-[var(--brand-light)] text-[var(--brand-primary)]">
              <ClockIcon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Транскрибация</div>
              <div className="text-xs text-[var(--text-3)]"></div>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-50">
            <div className="grid size-7 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--text-3)]">
              <RocketIcon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">AI-анализ</div>
              <div className="text-xs text-[var(--text-3)]">Начнётся после транскрибации</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-[var(--surface-2)]">
              <div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: '68%' }} />
            </div>
            <p className="text-xs text-[var(--text-3)]">Осталось примерно ... минуты</p>
          </div>

          {/* <Button disabled variant="secondary" className="w-full">
            Обработка идёт...
          </Button> */} 
        </CardContent>
      </Card>
    </div>
  )
}