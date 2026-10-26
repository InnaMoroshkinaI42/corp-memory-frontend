import { LayersIcon, StarIcon } from '@radix-ui/react-icons'

export function AuthAside() {
  return (
    <div className="relative hidden bg-[#0A1118] p-12 text-white lg:flex lg:flex-col overflow-hidden">
      <div className="absolute bottom-[-100px] left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
          <LayersIcon className="size-5 text-white" />
        </div>
        <b className="text-xl tracking-tight">MeetMind</b>
      </div>

      <div className="relative z-10 mt-auto mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-300">
          <StarIcon className="size-3" />
          Память компании
        </span>
        <h1 className="mt-6 text-[40px] font-medium leading-[1.15] tracking-tight">
          «Мы больше не ищем, что решили на прошлой встрече — просто спрашиваем у MeetMind»
        </h1>
        <p className="mt-8 text-sm text-gray-400 max-w-[400px] leading-relaxed">
          Единое пространство знаний: записи, документы в одном месте с ответами, подкреплёнными источниками.
        </p>
        <p className="mt-8 text-xs text-gray-500">
          Изолированные данные · Ролевой доступ · Ответы с источниками
        </p>
      </div>
    </div>
  )
}