
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { MemberRequestCard } from "./ui/MemberRequestCard";
import { MembersTable } from "./ui/MembersTable";

export function MembersPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"members" | "invites">("members");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members } = useQuery({
    queryKey: ["members", id],
    queryFn: () => fetch(`/api/companies/${id}/members`).then((r) => r.json()),
  });

  const { data: requests } = useQuery({
    queryKey: ["join-requests", id],
    queryFn: () =>
      fetch(`/api/companies/${id}/join-requests`).then((r) => r.json()),
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) =>
      fetch(`/api/join-requests/${requestId}/approve`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join-requests", id] });
      queryClient.invalidateQueries({ queryKey: ["members", id] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) =>
      fetch(`/api/join-requests/${requestId}/reject`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join-requests", id] });
    },
  });

  const pendingRequests =
    requests?.filter((r: any) => r.status === "SENDED") || [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMembers = (members || []).filter((member: any) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const firstName = member.first_name.toLowerCase();
    const lastName = member.last_name.toLowerCase();
    const email = member.email.toLowerCase();

    return (
      fullName.includes(normalizedQuery) ||
      firstName.includes(normalizedQuery) ||
      lastName.includes(normalizedQuery) ||
      email.includes(normalizedQuery)
    );
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Заголовок */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Участники</h1>
          <p className="mt-2 text-[var(--text-2)]">
            Управляйте командой и доступом к памяти компании.
          </p>
        </div>
        <Button>
          <PlusIcon className="size-4" /> Пригласить участника
        </Button>
      </div>

      {/* Заявки */}
      <MemberRequestCard
        requests={pendingRequests}
        onApprove={approveMutation.mutate}
        onReject={rejectMutation.mutate}
      />

      {/* Табы и поиск */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setTab("members")}
            className={`pb-2 text-sm font-semibold transition-colors ${
              tab === "members"
                ? "text-[var(--text)] border-b-2 border-[var(--brand-primary)]"
                : "text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            Участники · {members?.length || 0}
          </button>

          <button
            onClick={() => setTab("invites")}
            className={`pb-2 text-sm font-semibold transition-colors ${
              tab === "invites"
                ? "text-[var(--text)] border-b-2 border-[var(--brand-primary)]"
                : "text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            Приглашения · 0
          </button>
        </div>

        <div className="relative w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
          <Input
            placeholder="Поиск по имени или email"
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      {/* Контент */}
      {tab === "members" ? (
        filteredMembers.length > 0 ? (
          <MembersTable members={filteredMembers} />
        ) : (
          <div className="text-center p-8 text-[var(--text-3)]">
            Участники не найдены.
          </div>
        )
      ) : (
        <div className="text-center p-8 text-[var(--text-3)]">
          Приглашений пока нет.
        </div>
      )}
    </div>
  );
}
