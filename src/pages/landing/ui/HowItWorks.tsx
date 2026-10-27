import { LayersIcon, UploadIcon, StarIcon, ChatBubbleIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { IconBox } from '@/shared/ui/IconBox'

const STEPS = [
  { num: '01', icon: LayersIcon, title: 'Создайте компанию', desc: 'Соберите команду по ID или ссылке. Подтвердите запросы коллег.' },
  { num: '02', icon: UploadIcon, title: 'Добавьте материалы', desc: 'Загрузите запись встречи, документ или вставьте текстовую заметку.' },
  { num: '03', icon: StarIcon, title: 'Доверьте рутину ИИ', desc: 'Транскрибация и анализ выделят главное. Для текстовых документов — сразу анализ.' },
  { num: '04', icon: ChatBubbleIcon, title: 'Спрашивайте и действуйте', desc: 'Задайте вопрос и получите ответ с источниками из материалов.' }
]

export function HowItWorks() {
  return (
    <section className="bg-[var(--bg)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text)]">Как это работает</h2>
        <p className="mt-4 text-center text-[var(--text-2)]">Четыре шага от записи до ответа.</p>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <IconBox icon={step.icon} className="bg-white" />
                <span className="text-xl font-bold text-[var(--border-strong)]">{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Плашки со стрелочками */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[var(--text-2)]">
          <span className="rounded-full bg-[var(--success-soft)] px-3 py-1 text-[var(--success)]">Загрузка</span>
          <ArrowRightIcon className="size-3 text-[var(--text-3)]" />
          <span className="rounded-full bg-[var(--purple-soft)] px-3 py-1 text-[var(--purple)]">Транскрибация</span>
          <ArrowRightIcon className="size-3 text-[var(--text-3)]" />
          <span className="rounded-full bg-[var(--purple-soft)] px-3 py-1 text-[var(--purple)]">AI-анализ</span>
          <span className="ml-2 text-[var(--text-3)]">Для текстовых документов — сразу анализ</span>
        </div>
      </div>
    </section>
  )
}