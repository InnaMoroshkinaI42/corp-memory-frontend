import { Link } from 'react-router-dom'
import { LayersIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Hero } from './ui/Hero'
import { Features } from './ui/Features'
import { HowItWorks } from './ui/HowItWorks'
import { CompanyKnowledge } from './ui/CompanyKnowledge'
import { Roles } from './ui/Roles'
import { ForTeams } from './ui/ForTeams' 

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
            <LayersIcon className="size-5 text-white" />
          </div>
          <b className="text-lg tracking-tight text-[var(--text)]">MeetMind</b>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">Возможности</a>
          <a href="#how" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">Как это работает</a>
          <a href="#roles" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">Роли</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">Войти</Link>
          <Link to="/register">
            <Button className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)]">Попробовать бесплатно</Button>
          </Link>
        </div>
      </header>

      <main>
        <div className="bg-[var(--bg)]">
          <Hero />
        </div>
        
        <ForTeams /> 

        <div id="features"><Features /></div>
        <div id="how"><HowItWorks /></div>
        <CompanyKnowledge />
        <div id="roles"><Roles /></div>

        <section className="mx-auto mb-20 max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#0A1118] px-6 py-20 text-center text-white">
            {/* Синее свечение (можно вынести в CSS, но пока оставим) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[300px] w-[600px] rounded-full bg-blue-600/20 blur-[100px]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold">Начните собирать память компании сегодня</h2>
              <p className="mt-4 text-gray-400">Создайте компанию, добавьте запись и задайте первый вопрос.</p>
              <Link to="/register">
                <Button className="mt-8 h-12 bg-white px-8 text-black hover:bg-gray-200">
                  Начать бесплатно <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </Link>
              <p className="mt-4 text-xs text-gray-500">14 дней · без банковской карты</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white pt-16 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
                  <LayersIcon className="size-5 text-white" />
                </div>
                <b className="text-lg tracking-tight text-[var(--text)]">MeetMind</b>
              </div>
              <p className="mt-4 text-sm text-[var(--text-2)] leading-relaxed">
                Корпоративная память встреч.<br/>
                Знания, которые остаются с командой.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text)] mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-[var(--text-2)]">
                <li><a href="#features" className="hover:text-[var(--text)]">Возможности</a></li>
                <li><a href="#how" className="hover:text-[var(--text)]">Как это работает</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text)] mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-[var(--text-2)]">
                <li><a href="#" className="hover:text-[var(--text)]">Безопасность</a></li>
                <li><a href="#" className="hover:text-[var(--text)]">Связаться с нами</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text)] mb-4">Ресурсы</h4>
              <ul className="space-y-2 text-sm text-[var(--text-2)]">
                <li><a href="#" className="hover:text-[var(--text)]">Документация</a></li>
                <li><a href="#" className="hover:text-[var(--text)]">Условия использования</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-[var(--border)] pt-6 text-xs text-[var(--text-3)] md:flex-row">
            <span>© 2026 MeetMind. Все права защищены.</span>
            <div className="mt-4 flex gap-4 md:mt-0">
              <a href="#" className="hover:text-[var(--text)]">Политика конфиденциальности</a>
              <span>·</span>
              <span>Русский</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}