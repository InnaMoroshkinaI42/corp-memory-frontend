import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  PlusIcon,
  FileTextIcon,
  RocketIcon,
  ClockIcon,
  CheckCircledIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { StatCard } from "@/shared/ui/StatCard";

const fetchDashboard = async (id: string) => {
  const res = await fetch(`/api/company/${id}/dashboard`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

const fetchCompany = async (id: string) => {
  const res = await fetch(`/api/companies/${id}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export function OverviewPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", id],
    queryFn: () => fetchDashboard(id as string),
    enabled: !!id,
  });

  const { data: company } = useQuery({
    queryKey: ["company", id],
    queryFn: () => fetchCompany(id as string),
    enabled: !!id,
  });

  if (isLoading || !company) return <div className="p-8">Загрузка...</div>;
  if (!data) return <div className="p-8">Нет данных</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Обзор компании
          </h1>
          <p className="mt-1 text-[var(--text-2)]">
            {company.name} · Ваша команда, её знания и договорённости в одном
            месте.
          </p>
        </div>
        <Link to={`/app/documents/upload/${id}`}>
          <Button className="gap-2">
            <PlusIcon className="size-4" /> Загрузить документ
          </Button>
        </Link>
      </div>

      {/* Промо-блок */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-[var(--brand-light)] p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-10 place-items-center rounded-lg bg-white text-[var(--brand-primary)] shadow-sm">
            <RocketIcon className="size-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-[var(--text)]">
              Что ваша команда решила на последней встрече?
            </div>
            <div className="text-sm text-[var(--text-2)]">
              Спросите ИИ — он найдёт ответ в {data.stats.documents} документах
              компании и покажет источники.
            </div>
          </div>
        </div>
        <Button className="bg-white text-[var(--brand-primary)] hover:bg-gray-50 border border-[var(--border)] gap-2">
          <ChatBubbleIcon className="size-4" /> Спросить MeetMind
        </Button>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={FileTextIcon}
          label="Документы"
          value={data.stats.documents}
          subtext="+ 4 за последние 7 дней"
        />
        <StatCard
          icon={ClockIcon}
          label="Часы встреч"
          value={data.stats.chats}
          subtext="Сохранено в памяти команды"
        />
        <StatCard
          icon={RocketIcon}
          label="Решения"
          value={data.stats.decisions}
          subtext="3 из последней встречи"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Последние документы</CardTitle>
              <Link to={`/app/documents/${id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--brand-primary)]"
                >
                  Все документы →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {data.recentDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border-b border-[var(--border)] p-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-2)]">
                      {doc.type === "pdf" ? (
                        <FileTextIcon className="size-5" />
                      ) : (
                        <ChatBubbleIcon className="size-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text)]">
                        {doc.title}
                      </div>
                      <div className="text-xs text-[var(--text-3)]">
                        {doc.meta}
                      </div>
                    </div>
                  </div>
                  {doc.status === "ready" ? (
                    <Badge
                      variant="secondary"
                      className="bg-[var(--success-soft)] text-[var(--success)]"
                    >
                      Готов
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-[var(--warn-soft)] text-[var(--warn)]"
                    >
                      Обрабатывается
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Последние решения</CardTitle>
              <Link to={`/app/decisions/${id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--brand-primary)]"
                >
                  Все решения →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {data.recentDecisions.map((dec: any) => (
                <div
                  key={dec.id}
                  className="p-4 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircledIcon className="size-4 text-[var(--success)]" />
                    <span className="font-semibold text-[var(--text)]">
                      {dec.text}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-2)] mb-2">{dec.sub}</p>
                  <Link
                    to={`/app/documents/${id}`}
                    className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
                  >
                    {dec.source}
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>В команде</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {data.teamActivity.map((act: any) => (
                <div key={act.id} className="flex items-start gap-3">
                  {act.initials ? (
                    <Avatar className="size-8 bg-[var(--brand-light)]">
                      <AvatarFallback className="text-[var(--brand-primary)] text-xs font-bold">
                        {act.initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="size-8 rounded-full bg-[var(--surface-2)]" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-[var(--text)]">
                      {act.text}
                    </div>
                    <div className="text-xs text-[var(--text-3)]">
                      {act.date}
                    </div>
                    {act.link && (
                      <Link
                        to={`/app/members/${id}`}
                        className="text-xs font-medium text-[var(--brand-primary)] hover:underline mt-1 inline-block"
                      >
                        {act.link}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
