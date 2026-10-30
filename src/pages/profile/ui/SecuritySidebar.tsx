import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CheckCircledIcon, DesktopIcon } from "@radix-ui/react-icons";
import { Badge } from "@/shared/ui/badge";
import { ExitIcon } from "@radix-ui/react-icons";

export function SecuritySidebar() {
  const { data: security, isLoading } = useQuery({
    queryKey: ["profile-security"],
    queryFn: () => fetch("/api/profile/security").then((r) => r.json()),
  });

  if (isLoading || !security) {
    return <div className="p-4 text-sm text-[var(--text-3)]">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckCircledIcon className="size-5 text-[var(--success)]" />
            <Badge
              variant="secondary"
              className="bg-[var(--success-soft)] text-[var(--success)] rounded-full"
            >
              Email подтверждён
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Пароль обновлён {security.passwordUpdatedAt}. Рекомендуем менять его
            регулярно.
          </p>
          <Button variant="outline" className="w-full">
            Изменить пароль
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные сессии</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {security.sessions.map((session: any) => (
            <div key={session.id} className="flex gap-3">
              <DesktopIcon className="mt-0.5 size-5 text-[var(--text-2)]" />
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">
                  {session.device}
                </div>
                <div className="text-xs text-[var(--text-3)]">
                  {session.location} · {session.lastActive}
                </div>
                {session.isCurrent && (
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-[var(--brand-light)] text-[var(--brand-primary)] uppercase tracking-wider text-[10px]"
                  >
                    Текущая сессия
                  </Badge>
                )}
              </div>
            </div>
          ))}
          <button className="text-left text-sm font-medium text-[var(--brand-primary)] hover:underline">
            Завершить остальные сессии
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление аккаунтом</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Чтобы удалить аккаунт, сначала передайте владение компанией «
            {security.companyToTransfer}».
          </p>
          <button className="text-left text-sm font-medium text-[var(--danger)] hover:underline">
            Удаление аккаунта
          </button>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="ghost"
            className="gap-2 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <ExitIcon className="size-4" /> Выйти из аккаунта
          </Button>
        </div>
    </div>
  );
}
