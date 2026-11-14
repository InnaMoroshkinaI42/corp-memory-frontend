
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";

const initialCompanies = structuredClone(db.companies);

const API_URL = "http://localhost";

describe("Mock API: компании", () => {
  beforeEach(() => {
    // Возвращаем Mock-базу к исходному состоянию
    db.companies.splice(
      0,
      db.companies.length,
      ...structuredClone(initialCompanies)
    );
  });

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

  it("создаёт новую компанию", async () => {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Новая тестовая компания",
      }),
    });

    expect(response.status).toBe(201);

    const company = await response.json();

    expect(company.uuid).toBeDefined();
    expect(company.name).toBe("Новая тестовая компания");
    expect(company.owner_id).toBe("u-1");
    expect(company.created_at).toBeDefined();

    // Проверяем, что компания действительно попала в Mock-базу
    const savedCompany = db.companies.find(
      (item) => item.uuid === company.uuid
    );

    expect(savedCompany).toBeDefined();
    expect(savedCompany?.name).toBe("Новая тестовая компания");
  });
});
