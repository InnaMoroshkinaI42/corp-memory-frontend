
import { describe, it, expect } from "vitest";

const API_URL = "http://localhost";

describe("Mock API: панель управления", () => {
  it("возвращает панель управления компании", async () => {
    const response = await fetch(
      `${API_URL}/api/company/c-1/dashboard`
    );

    expect(response.status).toBe(200);

    const dashboard = await response.json();

    expect(dashboard).toBeDefined();
    expect(typeof dashboard).toBe("object");
  });

  it("возвращает панель управления другой компании", async () => {
    const response = await fetch(
      `${API_URL}/api/company/c-2/dashboard`
    );

    expect(response.status).toBe(200);

    const dashboard = await response.json();

    expect(dashboard).toBeDefined();
  });

  it("возвращает 404 для несуществующей компании", async () => {
    const response = await fetch(
      `${API_URL}/api/company/unknown-id/dashboard`
    );

    expect(response.status).toBe(404);
  });
});
