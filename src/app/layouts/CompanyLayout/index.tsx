import { useState } from "react";
import {
  Outlet,
  useParams,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { cn } from "@/shared/lib";
import {
  LayersIcon,
  HomeIcon,
  ChatBubbleIcon,
  FileTextIcon,
  CheckCircledIcon,
  PersonIcon,
  GearIcon,
  QuestionMarkCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

const NAV_ITEMS = [
  { to: "overview", icon: HomeIcon, label: "Обзор компании" },
  { to: "chats", icon: ChatBubbleIcon, label: "Чаты" },
  { to: "documents", icon: FileTextIcon, label: "Документы" },
  { to: "decisions", icon: CheckCircledIcon, label: "Решения" },
  { to: "members", icon: PersonIcon, label: "Участники" },
  { to: "settings", icon: GearIcon, label: "Настройки" },
];

const PAGE_LABELS: Record<string, string> = {
  overview: "Обзор",
  chats: "Чаты",
  documents: "Документы",
  decisions: "Решения",
  members: "Участники",
  settings: "Настройки",
};

export function CompanyLayout() {
  const { id } = useParams();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);

  const { data: company } = useQuery({
    queryKey: ["company", id],
    queryFn: () => fetch(`/api/companies/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  const { data: allCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => fetch("/api/companies").then((r) => r.json()),
  });

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetch("/api/profile").then((r) => r.json()),
  });

  const companyName = company?.name || "...";
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : "...";

  const pathParts = location.pathname.split('/').filter(Boolean)
  const pageSegment = pathParts.find((p) => p in PAGE_LABELS)
  const pageLabel = pageSegment ? PAGE_LABELS[pageSegment] : 'Обзор'

  if (!user) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <aside
        className={cn(
          "flex flex-col border-r border-[var(--border)] bg-white transition-all duration-200",
          isSidebarOpen ? "w-64" : "w-16",
        )}
      >
        {/* Бренд */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Link
              to="/companies"
              className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]"
            >
              <LayersIcon className="size-5 text-white" />
            </Link>
            {isSidebarOpen && (
              <b className="text-base tracking-tight">MeetMind</b>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="grid size-6 place-items-center rounded text-[var(--text-3)] hover:bg-[var(--surface-2)]"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </button>
        </div>
        {/* Переключатель компании */}
        <div className="relative p-2">
          <button
            onClick={() => setIsCompanyMenuOpen((v) => !v)}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg border border-[var(--border)] p-2 hover:bg-gray-50",
              !isSidebarOpen && "justify-center",
            )}
          >
            <div className="grid size-8 shrink-0 place-items-center rounded bg-[var(--brand-primary)] text-white font-bold">
              {companyName[0]}
            </div>
            {isSidebarOpen && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold truncate">
                    {companyName}
                  </div>
                  <div className="text-xs text-[var(--text-3)]">Компания</div>
                </div>
                {isCompanyMenuOpen ? (
                  <ChevronUpIcon className="size-4 text-[var(--text-3)]" />
                ) : (
                  <ChevronDownIcon className="size-4 text-[var(--text-3)]" />
                )}
              </>
            )}
          </button>

          {isCompanyMenuOpen && isSidebarOpen && (
            <div className="absolute left-2 right-2 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[var(--border)] bg-white shadow-lg">
              {allCompanies?.map((c: any) => (
                <Link
                  key={c.uuid}
                  to={`/app/overview/${c.uuid}`}
                  onClick={() => setIsCompanyMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-[var(--surface-2)]",
                    c.uuid === id && "bg-[var(--brand-light)]",
                  )}
                >
                  <div className="grid size-6 place-items-center rounded bg-[var(--brand-primary)] text-white text-xs font-bold">
                    {c.name[0]}
                  </div>
                  <span className="text-sm font-medium truncate">{c.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Навигация */}
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={`/app/${item.to}/${id}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  !isSidebarOpen && "justify-center px-0",
                  isActive
                    ? "bg-[var(--brand-light)] text-[var(--brand-primary)]"
                    : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Все компании */}
        <div className="border-t border-[var(--border)] p-2">
          <Link
            to="/companies"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
              !isSidebarOpen && "justify-center px-0",
            )}
          >
            <LayersIcon className="size-4 shrink-0" />
            {isSidebarOpen && <span>Все компании</span>}
          </Link>
        </div>

        {/* Помощь и поддержка */}
        <div className="border-t border-[var(--border)] p-2">
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
              !isSidebarOpen && "justify-center px-0",
            )}
          >
            <QuestionMarkCircledIcon className="size-4 shrink-0" />
            {isSidebarOpen && <span>Помощь и поддержка</span>}
          </button>
        </div>

        {/* Пользователь */}
        <div className="border-t border-[var(--border)] p-2">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2",
              !isSidebarOpen && "justify-center px-0",
            )}
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-light)] text-xs font-bold text-[var(--brand-primary)]">
              {initials}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[var(--text)]">
                  {user.first_name} {user.last_name}
                </div>
                <div className="truncate text-xs text-[var(--text-3)]">
                  {user.role || "Владелец"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопка сворачивания */}
      </aside>

      {/* Правая часть */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header
          breadcrumbs={[
            { label: "Мои компании", to: "/companies" },
            { label: companyName, to: `/app/overview/${id}` },
            { label: pageLabel },
          ]}
          user={user}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
