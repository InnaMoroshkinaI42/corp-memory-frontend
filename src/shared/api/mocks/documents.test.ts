
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";

const initialDocuments = structuredClone(db.documents);
const API_URL = "http://localhost";

describe("Mock API: документы", () => {
  beforeEach(() => {
    db.documents.splice(
      0,
      db.documents.length,
      ...structuredClone(initialDocuments)
    );
  });

  it("возвращает документы конкретной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-1/documents`
    );

    expect(response.status).toBe(200);

    const documents = await response.json();

    expect(Array.isArray(documents)).toBe(true);
    expect(documents.length).toBe(2);

    expect(
      documents.every((doc: { company_id: string }) =>
        doc.company_id === "c-1"
      )
    ).toBe(true);
  });

  it("не возвращает документы другой компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-2/documents`
    );

    expect(response.status).toBe(200);

    const documents = await response.json();

    expect(documents.length).toBe(1);
    expect(documents[0].uuid).toBe("d-3");
    expect(documents[0].company_id).toBe("c-2");
  });

  it("возвращает пустой список, если у компании нет документов", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/unknown-id/documents`
    );

    expect(response.status).toBe(200);

    const documents = await response.json();

    expect(documents).toEqual([]);
  });

 it("создаёт новый документ", async () => {
  const formData = new FormData();

  formData.append("company_id", "c-1");
  formData.append("title", "Встреча команды");
  formData.append("language", "Русский");
  formData.append("mode", "text");
  formData.append("content", "Содержание документа");

  const response = await fetch(`${API_URL}/api/documents`, {
    method: "POST",
    body: formData,
  });

  expect(response.status).toBe(201);

  const document = await response.json();

  expect(document.uuid).toBeDefined();
  expect(document.company_id).toBe("c-1");
  expect(document.user_id).toBe("u-1");
  expect(document.title).toBe("Встреча команды");
  expect(document.language).toBe("Русский");
  expect(document.original_name).toBe("Встреча команды");
  expect(document.mime_type).toBe("text/plain");
  expect(document.content).toBe("Содержание документа");
  expect(document.status).toBe("UPLOAD");

  const savedDocument = db.documents.find(
    item => item.uuid === document.uuid
  );

  expect(savedDocument).toBeDefined();
});
});
