
import { describe, it, expect } from "vitest";
import { ROUTES, buildPath } from "./routes";

describe("ROUTES", () => {
  it("содержит основные маршруты приложения", () => {
    expect(ROUTES.ROOT).toBe("/");
    expect(ROUTES.AUTH_LOGIN).toBe("/auth/login");
    expect(ROUTES.COMPANIES).toBe("/companies");
    expect(ROUTES.CHATS).toBe("/chats");
  });
});

describe("buildPath", () => {
  it("формирует ссылку на обзор компании", () => {
    expect(buildPath.companyOverview("c-1"))
      .toBe("/companies/c-1");
  });

  it("формирует ссылку на заявки компании", () => {
    expect(buildPath.companyRequests("c-1"))
      .toBe("/companies/c-1/requests");
  });

  it("формирует ссылку на участников компании", () => {
    expect(buildPath.companyMembers("c-1"))
      .toBe("/companies/c-1/members");
  });

  it("формирует ссылку на настройки компании", () => {
    expect(buildPath.companySettings("c-1"))
      .toBe("/companies/c-1/settings");
  });

  it("формирует ссылку на документы компании", () => {
    expect(buildPath.companyDocuments("c-1"))
      .toBe("/companies/c-1/documents");
  });

  it("формирует ссылку на чат", () => {
    expect(buildPath.chatDetail("chat-1"))
      .toBe("/chats/chat-1");
  });

  it("формирует ссылку на документ", () => {
    expect(buildPath.documentVideo("doc-1"))
      .toBe("/documents/doc-1/video");
  });
});
