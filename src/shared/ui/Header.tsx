import { Link } from "react-router-dom";
import { QuestionMarkCircledIcon, LayersIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback } from "./avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { BellIcon } from "@radix-ui/react-icons";

interface HeaderProps {
  breadcrumbs: { label: string; to?: string }[];
  user: { first_name: string; last_name: string };
  showLogo?: boolean;
}

export function Header({ breadcrumbs, user, showLogo = false }: HeaderProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`;
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-8">
      <div className="flex items-center gap-8">
        {/* Логотип — только если showLogo === true (для страниц без сайдбара) */}
        {showLogo && (
          <Link to="/companies" className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
              <LayersIcon className="size-5 text-white" />
            </div>
            <b className="text-lg tracking-tight text-[var(--text)]">
              MeetMind
            </b>
          </Link>
        )}

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <BreadcrumbSeparator className="text-[var(--text-3)]">
                    /
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {item.to ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.to}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--text-2)]">{today}</span>
        <Link
          to="/support"
          className="text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
        >
          <QuestionMarkCircledIcon className="size-5 text-[var(--text-3)]" />
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative grid size-10 place-items-center rounded-lg hover:bg-[var(--surface-2)]">
              <BellIcon className="size-5 text-[var(--text-2)]" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[var(--danger)]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <div className="font-semibold text-sm">Уведомления</div>
              <div className="p-3 rounded-lg bg-[var(--surface-2)] text-sm">
                Елена Соколова хочет вступить в компанию
              </div>
              <div className="p-3 rounded-lg bg-[var(--surface-2)] text-sm">
                Документ «Стратегия Q3» обработан
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Link
          to="/profile"
          className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]"
        >
          Личный профиль
        </Link>
        <Avatar className="size-8">
          <AvatarFallback variant="brand">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
