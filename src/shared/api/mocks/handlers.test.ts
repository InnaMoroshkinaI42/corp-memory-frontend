
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";

const initialCompanies = structuredClone(db.companies);
const initialDocuments = structuredClone(db.documents);
const initialDecisions = structuredClone(db.decisions);
const initialChats = structuredClone(db.chats);
const initialChatMessages = structuredClone(db.chatMessages);
const initialJoinRequests = structuredClone(db.joinRequests);
const initialDashboards = structuredClone(db.dashboards);

const API_URL = "http://localhost";

describe("Mock API: компании", () => {
  beforeEach(() => {
    // Восстанавливаем компании
    db.companies.splice(
      0,
      db.companies.length,
      ...structuredClone(initialCompanies)
    );

    // Восстанавливаем документы
    db.documents.splice(
      0,
      db.documents.length,
      ...structuredClone(initialDocuments)
    );

    // Восстанавливаем решения
    db.decisions.splice(
      0,
      db.decisions.length,
      ...structuredClone(initialDecisions)
    );

    // Восстанавливаем чаты
    db.chats.splice(
      0,
      db.chats.length,
      ...structuredClone(initialChats)
    );

    // Восстанавливаем сообщения
    db.chatMessages.splice(
      0,
      db.chatMessages.length,
      ...structuredClone(initialChatMessages)
    );

    // Восстанавливаем заявки
    db.joinRequests.splice(
      0,
      db.joinRequests.length,
      ...structuredClone(initialJoinRequests)
    );

    // Восстанавливаем dashboard
    Object.keys(db.dashboards).forEach((key) => {
      delete db.dashboards[key as keyof typeof db.dashboards];
    });

    Object.assign(db.dashboards, structuredClone(initialDashboards));
  });

  // ================================
  // GET: получение компаний
  // ================================

  it("возвращает список компаний", async () => {
    const response = await fetch(`${API_URL}/api/companies`);

    expect(response.status).toBe(200);

    const companies = await response.json();

    expect(Array.isArray(companies)).toBe(true);
    expect(companies.length).toBe(2);
    expect(companies[0].name).toBe("Nordwind Analytics");
    expect(companies[1].name).toBe("Skyline Retail");
  });

  it("возвращает компанию по ID", async () => {
    const response = await fetch(`${API_URL}/api/companies/c-1`);

    expect(response.status).toBe(200);

    const company = await response.json();

    expect(company.uuid).toBe("c-1");
    expect(company.name).toBe("Nordwind Analytics");
    expect(company.owner_id).toBe("u-1");
  });

  it("возвращает 404 для несуществующей компании", async () => {
    const response = await fetch(`${API_URL}/api/companies/unknown-id`);

    expect(response.status).toBe(404);
  });

  // ================================
  // POST: создание компании
  // ================================

  it("создаёт новую компанию", async () => {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Новая тестовая компания",
        description: "Описание тестовой компании",
        domain: "test-company.ru",
      }),
    });

    expect(response.status).toBe(201);

    const company = await response.json();

    expect(company.uuid).toBeDefined();
    expect(company.name).toBe("Новая тестовая компания");
    expect(company.owner_id).toBe("u-1");
    expect(company.created_at).toBeDefined();
    expect(company.description).toBe("Описание тестовой компании");
    expect(company.domain).toBe("test-company.ru");

    const savedCompany = db.companies.find(
      (item) => item.uuid === company.uuid
    );

    expect(savedCompany).toBeDefined();
    expect(savedCompany?.name).toBe("Новая тестовая компания");
    expect(savedCompany?.description).toBe("Описание тестовой компании");
    expect(savedCompany?.domain).toBe("test-company.ru");
  });

  it("не создаёт компанию без названия", async () => {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "Компания без названия",
      }),
    });

    expect(response.status).toBe(400);
    expect(db.companies).toHaveLength(initialCompanies.length);
  });

  it("не создаёт компанию с названием длиннее 100 символов", async () => {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "A".repeat(101),
      }),
    });

    expect(response.status).toBe(400);
    expect(db.companies).toHaveLength(initialCompanies.length);
  });

  // ================================
  // PUT: редактирование компании
  // ================================

  it("обновляет данные компании", async () => {
    const originalCompany = db.companies.find(
      (item) => item.uuid === "c-1"
    );

    expect(originalCompany).toBeDefined();

    const originalMembers = originalCompany?.members;
    const originalRole = originalCompany?.role;

    const response = await fetch(`${API_URL}/api/companies/c-1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Обновлённое название",
        description: "Новое описание",
        domain: "updated-company.ru",
      }),
    });

    expect(response.status).toBe(200);

    const company = await response.json();

    expect(company.uuid).toBe("c-1");
    expect(company.name).toBe("Обновлённое название");
    expect(company.description).toBe("Новое описание");
    expect(company.domain).toBe("updated-company.ru");

    // Проверяем, что дополнительные данные компании сохранились
    expect(company.members).toBe(originalMembers);
    expect(company.role).toBe(originalRole);

    const savedCompany = db.companies.find(
      (item) => item.uuid === "c-1"
    );

    expect(savedCompany?.name).toBe("Обновлённое название");
  });

  it("не обновляет компанию с пустым названием", async () => {
    const response = await fetch(`${API_URL}/api/companies/c-1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
      }),
    });

    expect(response.status).toBe(400);

    const company = db.companies.find(
      (item) => item.uuid === "c-1"
    );

    expect(company?.name).toBe("Nordwind Analytics");
  });

  it("не позволяет редактировать чужую компанию", async () => {
    const response = await fetch(`${API_URL}/api/companies/c-2`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Попытка изменить чужую компанию",
      }),
    });

    expect(response.status).toBe(403);

    const company = db.companies.find(
      (item) => item.uuid === "c-2"
    );

    expect(company?.name).toBe("Skyline Retail");
  });

  it("возвращает 404 при редактировании несуществующей компании", async () => {
    const response = await fetch(`${API_URL}/api/companies/unknown-id`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Новое название",
      }),
    });

    expect(response.status).toBe(404);
  });

  // ================================
  // DELETE: удаление компании
  // ================================

  it("удаляет компанию и связанные с ней данные", async () => {
    const companyChatIds = db.chats
      .filter((chat) => chat.company_id === "c-1")
      .map((chat) => chat.uuid);

    const response = await fetch(`${API_URL}/api/companies/c-1`, {
      method: "DELETE",
    });

    expect(response.status).toBe(200);

    // Компания удалена
    expect(
      db.companies.some((company) => company.uuid === "c-1")
    ).toBe(false);

    // Вторая компания осталась
    expect(
      db.companies.some((company) => company.uuid === "c-2")
    ).toBe(true);

    // Связанные документы удалены
    expect(
      db.documents.some((document) => document.company_id === "c-1")
    ).toBe(false);

    // Связанные решения удалены
    expect(
      db.decisions.some((decision) => decision.company_id === "c-1")
    ).toBe(false);

    // Связанные чаты удалены
    expect(
      db.chats.some((chat) => chat.company_id === "c-1")
    ).toBe(false);

    // Сообщения удалённых чатов удалены
    expect(
      db.chatMessages.some((message) =>
        companyChatIds.includes(message.chat_id)
      )
    ).toBe(false);

    // Заявки на вступление удалены
    expect(
      db.joinRequests.some((request) => request.company_id === "c-1")
    ).toBe(false);

    // Dashboard компании удалён
    expect(db.dashboards["c-1"]).toBeUndefined();
  });

  it("не позволяет удалить чужую компанию", async () => {
    const response = await fetch(`${API_URL}/api/companies/c-2`, {
      method: "DELETE",
    });

    expect(response.status).toBe(403);

    expect(
      db.companies.some((company) => company.uuid === "c-2")
    ).toBe(true);
  });

  it("возвращает 404 при удалении несуществующей компании", async () => {
    const response = await fetch(`${API_URL}/api/companies/unknown-id`, {
      method: "DELETE",
    });

    expect(response.status).toBe(404);
  });
});
