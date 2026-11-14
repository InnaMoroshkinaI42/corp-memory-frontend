
import { describe, it, expect } from "vitest";
import { db, CURRENT_USER_ID } from "./db";

const API_URL = "http://localhost";

describe("Mock API: профиль пользователя", () => {
  it("возвращает список пользователей", async () => {
    const response = await fetch(`${API_URL}/api/users`);

    expect(response.status).toBe(200);

    const users = await response.json();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(db.users.length);
    expect(users.length).toBeGreaterThan(0);
  });

  it("возвращает профиль текущего пользователя", async () => {
    const response = await fetch(`${API_URL}/api/profile`);

    expect(response.status).toBe(200);

    const profile = await response.json();

    expect(profile.uuid).toBe(CURRENT_USER_ID);
    expect(profile.first_name).toBe("Алексей");
    expect(profile.last_name).toBe("Морозов");
    expect(profile.email).toBe("a.morozov@nordwind.ru");
    expect(profile.phone).toBe("+7 916 240-18-52");
    expect(profile.role).toBe("Владелец");
    expect(profile.timezone).toBe("Europe/Moscow");
  });

  it("возвращает настройки безопасности", async () => {
    const response = await fetch(
      `${API_URL}/api/profile/security`
    );

    expect(response.status).toBe(200);

    const security = await response.json();

    expect(security).toEqual(db.profileSecurity);
    expect(security.passwordUpdatedAt).toBeDefined();
    expect(Array.isArray(security.sessions)).toBe(true);
    expect(security.sessions.length).toBeGreaterThan(0);
    expect(security.sessions[0].isCurrent).toBe(true);
  });
});
