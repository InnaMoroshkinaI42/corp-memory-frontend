import { describe, it, expect } from "vitest";

const API_URL = "http://localhost";

describe("Mock API: получение документа", () => {
  it("возвращает существующий документ", async () => {
    const response = await fetch(
      `${API_URL}/api/documents/d-1`
    );

    expect(response.status).toBe(200);

    const document = await response.json();

    expect(document).toBeDefined();
    expect(typeof document).toBe("object");
  });

  it("возвращает 404 для несуществующего документа", async () => {
    const response = await fetch(
      `${API_URL}/api/documents/unknown-id`
    );

    expect(response.status).toBe(404);
  });
});