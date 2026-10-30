import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { AuthInput } from '@/shared/ui/AuthInput'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { AuthAside } from '@/shared/ui/AuthAside'

export function RegisterPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 font-sans bg-[var(--surface)]">
      
      {/* Левая панель */}
      <AuthAside />

      {/* Правая панель — форма регистрации */}
      <div className="flex items-center justify-center bg-[var(--surface)] p-8">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-[var(--text)] tracking-tight">Создать аккаунт</h2>
            <p className="mt-2 text-[15px] text-[var(--text-2)] leading-relaxed">
              Бесплатно для первого рабочего пространства.
            </p>
          </div>

          <form className="grid gap-5">
            <div className="grid gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text)]">Имя и фамилия *</label>
              <AuthInput type="text" placeholder="Например, Иван Петров" />
            </div>
            
            <div className="grid gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text)]">Рабочий email *</label>
              <AuthInput icon="email" type="email" placeholder="you@company.ru" />
            </div>

            <div className="grid gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text)]">Пароль *</label>
              <AuthInput icon="lock" type="password" placeholder="Минимум 8 символов" />
              <span className="text-[12px] text-[var(--text-3)]">Только латиница и цифры, от 8 символов.</span>
            </div>

            <label className="flex items-start gap-2 mt-2 cursor-pointer">
              <input type="checkbox" className="mt-1 size-4 rounded border-[var(--border-strong)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
              <span className="text-[13px] font-medium text-[var(--text-2)]">
                Согласен с условиями использования и обработкой данных
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full h-11 mt-2">
              Создать аккаунт
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </form>

          <div className="mt-8 text-center text-[13px] text-[var(--text-2)]">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="font-semibold text-[var(--brand-primary)] hover:underline">
              Войти
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}