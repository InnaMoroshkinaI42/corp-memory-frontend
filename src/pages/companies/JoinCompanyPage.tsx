import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { JoinProfileHeader } from "./ui/JoinProfileHeader";
import { JoinRequestForm } from "./ui/JoinRequestForm";
import { JoinStatusCard } from "./ui/JoinStatusCard";
import { useNavigate } from "react-router-dom";

export function JoinCompanyPage() {
  const [isSent, setIsSent] = useState(false);
  const [companyId, setCompanyId] = useState("");

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetch("/api/profile").then((r) => r.json()),
  });

  const { data: company } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () =>
      fetch(`/api/companies/${companyId}`).then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    enabled: companyId.length > 1,
    retry: false,
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/companies/${companyId}/join-requests`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      navigate(`/companies/waiting?companyId=${companyId}`);
    },
  });

  if (!user) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Вступить в компанию
          </h1>
          <p className="mt-2 text-[var(--text-2)]">
            Найдите компанию и отправьте запрос. Доступ появится после одобрения
            владельцем.
          </p>
        </div>
        <Link to="/companies">
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="size-4" /> К моим компаниям
          </Button>
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Форма (левая колонка) */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <JoinProfileHeader user={user} />
            <JoinRequestForm
              companyId={companyId}
              setCompanyId={setCompanyId}
              company={company}
              isPending={mutation.isPending}
              isSent={isSent}
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            />
          </CardContent>
        </Card>

        {/* Статус (правая колонка) */}
        <div className="w-80 space-y-6">
          <JoinStatusCard
            isSent={isSent}
            companyName={company?.name}
            ownerName={company?.owner_name}
            onCancel={() => setIsSent(false)}
          />

          <div>
            <h3 className="text-sm font-bold text-[var(--text)] mb-2">
              Ссылка — не автоматический доступ
            </h3>
            <p className="text-sm text-[var(--text-2)] leading-relaxed mb-3">
              Любой способ вступления создаёт запрос. Это помогает владельцу
              контролировать, кто видит корпоративные знания.
            </p>
            <a
              href="#"
              className="text-sm font-medium text-[var(--brand-primary)] hover:underline"
            >
              Как устроены роли →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
