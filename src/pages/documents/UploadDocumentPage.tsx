import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, UploadIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { UploadDropzone } from "./ui/UploadDropzone";
import { ProcessingStatus } from "./ui/ProcessingStatus";

export function UploadDocumentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"files" | "text">("files");

  const { data: company } = useQuery({
    queryKey: ["company", id],
    queryFn: () => fetch(`/api/companies/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/documents", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", id] });
      navigate(`/app/documents/${id}`);
    },
  });

  if (!company) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Заголовок */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Загрузить документ
          </h1>
          <p className="mt-2 text-[var(--text-2)]">
            Новые материалы попадут в память компании «{company.name}».
          </p>
        </div>
        <Link to={`/app/documents/${id}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="size-4" /> Назад к документам
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              {/* Табы */}
              <div className="flex gap-6 border-b border-[var(--border)] mb-6">
                <button
                  onClick={() => setActiveTab("files")}
                  className={`pb-3 text-sm font-medium ${activeTab === "files" ? "text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]" : "text-[var(--text-3)]"}`}
                >
                  Загрузка файлов
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`pb-3 text-sm font-medium ${activeTab === "text" ? "text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]" : "text-[var(--text-3)]"}`}
                >
                  Текстовая запись
                </button>
              </div>

              {/* Компонент */}
              {activeTab === "files" ? (
                <UploadDropzone files={files} onFilesChange={setFiles} />
              ) : (
                <textarea
                  className="w-full min-h-[200px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-[var(--brand-primary)] resize-none"
                  placeholder="Вставьте заметки..."
                />
              )}

              {/* Метаданные */}
              <div className="border-t border-[var(--border)] pt-6 mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Название документа</Label>
                  <Input
                    id="title"
                    placeholder="Например, Планирование запуска Atlas"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Компания</Label>
                    <div className="flex h-10 items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-2)]">
                      {company.name} · {company.uuid}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Язык записи</Label>
                    <select className="h-10 w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--brand-primary)]">
                      <option>Русский</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
                <Link to={`/app/documents/${id}`}>
                  <Button variant="outline">Отмена</Button>
                </Link>
                <Button
                  onClick={() => mutation.mutate()}
                  disabled={
                    (activeTab === "files" && files.length === 0) ||
                    mutation.isPending
                  }
                  className="gap-2"
                >
                  <UploadIcon className="size-4" />{" "}
                  {mutation.isPending
                    ? "Загрузка..."
                    : "Загрузить и обработать"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ProcessingStatus />
        </div>
      </div>
    </div>
  );
}
