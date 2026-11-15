
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { CompanyWaitingPage } from "./CompanyWaitingPage";

function CurrentPath() {
  const location = useLocation();

  return (
    <output data-testid="current-path">
      {location.pathname}
    </output>
  );
}

function renderCompanyWaitingPage(initialEntry = "/companies/waiting?companyId=c-2") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/companies/waiting"
            element={<CompanyWaitingPage />}
          />
          <Route
            path="*"
            element={<CurrentPath />}
          />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("CompanyWaitingPage — интеграционные тесты", () => {
  it("отображает заголовок и информацию о пользователе", async () => {
    renderCompanyWaitingPage();

    expect(
      await screen.findByRole("heading", {
        name: "Мои компании",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Алексей, здесь появятся компании/)
    ).toBeInTheDocument();
  });

  it("отображает информацию о компании и отправленной заявке", async () => {
    renderCompanyWaitingPage();

    expect(
      await screen.findByText("Skyline Retail")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Запрос на вступление в «Skyline Retail» отправлен/)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ожидает подтверждения")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Подтверждает Марина Соколова/)
    ).toBeInTheDocument();
  });

  it("отображает информацию о действиях после одобрения заявки", async () => {
    renderCompanyWaitingPage();

    expect(
      await screen.findByRole("heading", {
        name: "Что будет после одобрения",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Компания появится в вашем списке")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Вы получите роль «Участник»")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Откроются документы и чаты «Skyline Retail»/)
    ).toBeInTheDocument();

    expect(
      screen.getByText("На email придёт подтверждение")
    ).toBeInTheDocument();
  });

  it("содержит ссылки на вступление и создание компании", async () => {
    renderCompanyWaitingPage();

    await screen.findByText("Skyline Retail");

    expect(
      screen.getByRole("link", {
        name: /Вступить в компанию/,
      })
    ).toHaveAttribute("href", "/companies/join");

    const createLinks = screen.getAllByRole("link", {
      name: /Создать компанию/,
    });

    expect(createLinks).toHaveLength(2);

    createLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/companies/create");
    });
  });

  it("использует компанию c-1, если companyId не указан", async () => {
    renderCompanyWaitingPage("/companies/waiting");

    expect(
      await screen.findByText("Nordwind Analytics")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Запрос на вступление в «Nordwind Analytics» отправлен/)
    ).toBeInTheDocument();
  });
});
