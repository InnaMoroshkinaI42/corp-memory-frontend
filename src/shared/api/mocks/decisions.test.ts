
import { describe, it, expect } from "vitest";
import { db } from "./db";

const API_URL = "http://localhost";

describe("Mock API: решения компании", () => {
  it("возвращает решения конкретной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-1/decisions`
    );

    expect(response.status).toBe(200);

    const decisions = await response.json();
    const expected = db.decisions.filter(
      decision => decision.company_id === "c-1"
    );

    expect(decisions).toEqual(expected);
  });

  it("возвращает только решения указанной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-1/decisions`
    );

    const decisions = await response.json();

    expect(
      decisions.every(
        (decision: { company_id: string }) =>
          decision.company_id === "c-1"
      )
    ).toBe(true);
  });

  it("возвращает решения другой компании отдельно", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-2/decisions`
    );

    expect(response.status).toBe(200);

    const decisions = await response.json();
    const expected = db.decisions.filter(
      decision => decision.company_id === "c-2"
    );

    expect(decisions).toEqual(expected);
  });

  it("возвращает пустой массив для неизвестной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/unknown-id/decisions`
    );

    expect(response.status).toBe(200);

    const decisions = await response.json();

    expect(decisions).toEqual([]);
  });

  it("не изменяет исходные данные при получении решений", async () => {
    const initialDecisions = structuredClone(db.decisions);

    await fetch(`${API_URL}/api/companies/c-1/decisions`);

    expect(db.decisions).toEqual(initialDecisions);
  });
});
