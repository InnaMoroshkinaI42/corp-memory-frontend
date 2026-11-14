
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "./db";

const initialChats = structuredClone(db.chats);
const initialMessages = structuredClone(db.chatMessages);
const API_URL = "http://localhost";

describe("Mock API: чаты", () => {
  beforeEach(() => {
    db.chats.splice(
      0,
      db.chats.length,
      ...structuredClone(initialChats)
    );

    db.chatMessages.splice(
      0,
      db.chatMessages.length,
      ...structuredClone(initialMessages)
    );
  });

  it("возвращает сообщения конкретного чата", async () => {
    const response = await fetch(
      `${API_URL}/api/chats/ch-1/messages`
    );

    expect(response.status).toBe(200);

    const messages = await response.json();

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBe(2);
    expect(messages[0].chat_id).toBe("ch-1");
    expect(messages[0].role).toBe("USER");
    expect(messages[1].role).toBe("AI");
  });

  it("возвращает пустой список для чата без сообщений", async () => {
    const response = await fetch(
      `${API_URL}/api/chats/unknown-chat/messages`
    );

    expect(response.status).toBe(200);

    const messages = await response.json();

    expect(messages).toEqual([]);
  });

  it("отправляет сообщение пользователя", async () => {
    const response = await fetch(
      `${API_URL}/api/chats/ch-1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "Тестовое сообщение",
        }),
      }
    );

    expect(response.status).toBe(201);

    const message = await response.json();

    expect(message.uuid).toBeDefined();
    expect(message.chat_id).toBe("ch-1");
    expect(message.role).toBe("USER");
    expect(message.content).toBe("Тестовое сообщение");

    const savedMessage = db.chatMessages.find(
      item => item.uuid === message.uuid
    );

    expect(savedMessage).toBeDefined();
  });

  it("возвращает список чатов конкретной компании", async () => {
    const response = await fetch(
      `${API_URL}/api/chats?companyId=c-1`
    );

    expect(response.status).toBe(200);

    const chats = await response.json();

    expect(chats.length).toBe(1);
    expect(chats[0].uuid).toBe("ch-1");
    expect(chats[0].company_id).toBe("c-1");
  });

  it("создаёт новый чат", async () => {
    const response = await fetch(
      `${API_URL}/api/chats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: "c-1",
          title: "Новый тестовый чат",
        }),
      }
    );

    expect(response.status).toBe(201);

    const chat = await response.json();

    expect(chat.uuid).toBeDefined();
    expect(chat.company_id).toBe("c-1");
    expect(chat.user_id).toBe("u-1");
    expect(chat.title).toBe("Новый тестовый чат");

    const savedChat = db.chats.find(
      item => item.uuid === chat.uuid
    );

    expect(savedChat).toBeDefined();
  });

  it("создаёт ответ AI", async () => {
    const response = await fetch(
      `${API_URL}/api/chats/ch-1/ai-messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "Ответ искусственного интеллекта",
        }),
      }
    );

    expect(response.status).toBe(201);

    const message = await response.json();

    expect(message.uuid).toBeDefined();
    expect(message.chat_id).toBe("ch-1");
    expect(message.role).toBe("AI");
    expect(message.content).toBe(
      "Ответ искусственного интеллекта"
    );
    expect(message.sources).toBeDefined();
    expect(message.sources.length).toBeGreaterThan(0);
  });
});
