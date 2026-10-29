import { useQuery } from "@tanstack/react-query";
import {
  PlusIcon,
  Link2Icon,
  ArrowRightIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Link } from "react-router-dom";
import type { Company, CompanyJoinRequest } from "@/shared/api/types";

interface JoinRequest {
  uuid: string;
  company_id: string;
  user_id: string;
  status: string;
  created_at: string;
}

const fetchCompanies = async (): Promise<Company[]> => {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
};

const fetchJoinRequests = async (): Promise<JoinRequest[]> => {
  const res = await fetch("/api/join-requests");
  if (!res.ok) throw new Error("Failed to fetch join requests");
  return res.json();
};

export function CompaniesPage() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const { data: requests } = useQuery({
    queryKey: ["join-requests"],
    queryFn: fetchJoinRequests,
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-[var(--text-2)]">
        Загрузка компаний...
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8">
      <div className="mx-auto max-w-5xl">
        {/* Заголовок */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">
              Мои компании
            </h1>
            <p className="mt-2 text-[var(--text-2)]">
              Выберите компанию, чтобы продолжить работу с её документами и
              чатами.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Link2Icon className="size-4" /> Вступить в компанию
            </Button>
            <Button className="gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-dark)] text-white">
              <PlusIcon className="size-4" /> Создать компанию
            </Button>
          </div>
        </div>

        {/* Сетка всех компаний */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {companies?.map((company) => (
            <Card key={company.uuid} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-xl bg-[var(--brand-primary)] text-white text-lg font-bold">
                      {company.name[0]}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[var(--text)]">
                        {company.name}
                      </div>
                      <div className="text-xs text-[var(--text-3)]">
                        Компания · {company.uuid}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[var(--brand-light)] text-[var(--brand-primary)] rounded-full"
                  >
                    {company.owner_id === "u-1" ? "Владелец" : "Участник"}
                  </Badge>
                </div>

                <div className="flex gap-6 border-t border-[var(--border)] pt-4 mb-6">
                  <div>
                    <div className="text-lg font-bold">{company.members}</div>
                    <div className="text-xs text-[var(--text-3)]">
                      участников
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{company.documents}</div>
                    <div className="text-xs text-[var(--text-3)]">
                      документа
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{company.chats}</div>
                    <div className="text-xs text-[var(--text-3)]">чатов</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-3)]">
                    Открыта {company.lastActive}
                  </span>
                  <Link to={`/app/overview/${company.uuid}`}>
                    <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-dark)] text-white gap-2">
                      <ArrowRightIcon className="size-4" /> Открыть компанию
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Заявки на вступление */}
        {requests && requests.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">
              Ожидающие запросы
            </h2>
            {requests.map((req: any) => (
              <Card key={req.uuid} className="shadow-sm mb-3">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10 bg-[var(--brand-light)]">
                      <AvatarFallback className="text-[var(--brand-primary)] text-xs font-bold">
                        {req.user_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">
                        {req.user_name} хочет вступить в «{req.company_name}»
                      </div>
                      <div className="text-xs text-[var(--text-3)]">
                        {req.user_email} · по ID {req.company_id} ·{" "}
                        {req.dateText}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-[var(--warn-soft)] text-[var(--warn)] rounded-full">
                      <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" />{" "}
                      Ожидает подтверждения
                    </Badge>
                    <Button variant="outline">Рассмотреть запрос</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Сноска */}
        <div className="mt-12 flex items-center gap-2 text-xs text-[var(--text-3)]">
          <CheckCircledIcon className="size-4 text-[var(--success)]" />
          Для вступления нужен ID или ссылка-приглашение. Каждый запрос
          подтверждает владелец компании.
        </div>
      </div>
    </div>
  );
}
