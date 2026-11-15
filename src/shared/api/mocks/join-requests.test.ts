
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";

const initialJoinRequests = structuredClone(db.joinRequests);
const API_URL = "http://localhost";

describe("Mock API: заявки и участники компании", () => {
  beforeEach(() => {
    db.joinRequests.splice(
      0,
      db.joinRequests.length,
      ...structuredClone(initialJoinRequests)
    );
  });

  it("возвращает заявки конкретной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-1/join-requests`
    );

    expect(response.status).toBe(200);

    const requests = await response.json();

    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);

    expect(
      requests.some(
        (request: { uuid: string }) => request.uuid === "jr-1"
      )
    ).toBe(true);

    expect(requests[0].user_name).toBeDefined();
    expect(requests[0].user_email).toBeDefined();
  });

  it("возвращает общий список заявок", async () => {
    const response = await fetch(
      `${API_URL}/api/join-requests`
    );

    expect(response.status).toBe(200);

    const requests = await response.json();

    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);

    expect(
      requests.some(
        (request: { uuid: string }) => request.uuid === "jr-1"
      )
    ).toBe(true);
  });

  it("подтверждает существующую заявку", async () => {
    const response = await fetch(
      `${API_URL}/api/join-requests/jr-1/approve`,
      { method: "POST" }
    );

    expect(response.status).toBe(200);

    const result = await response.json();

    expect(result.success).toBe(true);

    const approvedRequest = db.joinRequests.find(
      request => request.uuid === "jr-1"
    );

    expect(approvedRequest).toBeDefined();
    expect(approvedRequest?.status).toBe("ACCEPT");
  });


    it("отклоняет существующую заявку", async () => {
    const response = await fetch(
      `${API_URL}/api/join-requests/jr-1/reject`,
      { method: "POST" }
    );

    expect(response.status).toBe(200);

    const result = await response.json();

    expect(result.success).toBe(true);

    const rejectedRequest = db.joinRequests.find(
      request => request.uuid === "jr-1"
    );

    expect(rejectedRequest).toBeDefined();
    expect(rejectedRequest?.status).toBe("REJECT");
  });

  it("возвращает 404 при отклонении несуществующей заявки", async () => {
    const response = await fetch(
      `${API_URL}/api/join-requests/unknown-id/reject`,
      { method: "POST" }
    );

    expect(response.status).toBe(404);

    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.message).toBe("Заявка не найдена");
  });

  
  it("возвращает список участников компании", async () => {
    const response = await fetch(
      `${API_URL}/api/companies/c-1/members`
    );

    expect(response.status).toBe(200);

    const members = await response.json();

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBe(6);
  });

  it("создаёт новую заявку на вступление в компанию", async () => {
    const initialLength = db.joinRequests.length;

    const response = await fetch(
      `${API_URL}/api/companies/c-1/join-requests`,
      { method: "POST" }
    );

    expect(response.status).toBe(201);

    const newRequest = await response.json();

    expect(newRequest.uuid).toBeDefined();
    expect(newRequest.company_id).toBe("c-1");
    expect(newRequest.user_id).toBe("u-1");
    expect(newRequest.status).toBe("SENDED");

    expect(db.joinRequests.length).toBe(initialLength + 1);
  });

  it("добавляет созданную заявку в общий список", async () => {
    await fetch(
      `${API_URL}/api/companies/c-2/join-requests`,
      { method: "POST" }
    );

    const response = await fetch(
      `${API_URL}/api/join-requests`
    );

    expect(response.status).toBe(200);

    const requests = await response.json();

    expect(
      requests.some(
        (request: { company_id: string; status: string }) =>
          request.company_id === "c-2" &&
          request.status === "SENDED"
      )
    ).toBe(true);
  });
});
