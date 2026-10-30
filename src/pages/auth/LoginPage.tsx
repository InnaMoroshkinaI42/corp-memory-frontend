import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { AuthInput } from '@/shared/ui/AuthInput'
import { GoogleButton } from '@/shared/ui/GoogleButton'
import { ArrowRightIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { AuthAside } from '@/shared/ui/AuthAside'

export function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 font-sans bg-[var(--surface)]">
      
      {/* Левая панель — промо */}
      <AuthAside />

      {/* Правая панель — форма */}
      <div className="flex items-center justify-center bg-[var(--surface)] p-8">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-[var(--text)] tracking-tight">С возвращением</h2>
            <p className="mt-2 text-[15px] text-[var(--text-2)] leading-relaxed">
              Войдите, чтобы продолжить работу<br />с памятью вашей компании.
            </p>
          </div>

          <GoogleButton>Продолжить с Google</GoogleButton>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]"></div>
            <span className="text-[13px] font-medium text-[var(--text-3)]">или по email</span>
            <div className="h-px flex-1 bg-[var(--border)]"></div>
          </div>

          <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/companies' }}>
            <div className="grid gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text)]">Рабочий email</label>
              <AuthInput icon="email" type="email" defaultValue="alexey@sever.team" />
            </div>
            
            <div className="grid gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text)]">Пароль</label>
              <AuthInput icon="lock" type="password" defaultValue="пумпум"/>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-2)] cursor-pointer">
                <input type="checkbox" defaultChecked className="size-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                Запомнить меня
              </label>
              <Link to="#" className="text-[13px] font-medium text-[var(--brand-primary)] hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full h-11 mt-2">
              <ArrowRightIcon className="mr-2 size-4" />
              Войти
            </Button>
          </form>

          <div className="mt-8 text-center text-[13px] text-[var(--text-2)]">
            Нет аккаунта?{' '}
            <Link to="/register" className="font-semibold text-[var(--brand-primary)] hover:underline">
              Зарегистрироваться →
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-[12px] font-medium text-[var(--text-3)]">
            <LockClosedIcon className="size-3.5" />
            Защищённый вход в личный аккаунт
          </div>

        </div>
      </div>
    </div>
  )
}