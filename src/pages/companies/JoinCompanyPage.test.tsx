
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

import { JoinCompanyPage } from "./JoinCompanyPage";

function CurrentPath() {
  const location = useLocation();

  return (
    <output data-testid="current-path">
      {location.pathname + location.search}
    </output>
  );
}

function renderJoinCompanyPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter initialEntries={["/companies/join"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/companies/join"
            element={<JoinCompanyPage />}
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

describe("JoinCompanyPage — интеграционные тесты", () => {
  it("отображает заголовок, форму и информацию пользователя", async () => {
    renderJoinCompanyPage();

    expect(
      await screen.findByRole("heading", {
        name: "Вступить в компанию",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("ID компании")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Или вставьте ссылку-приглашение")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Алексей Морозов")
    ).toBeInTheDocument();

    expect(
  screen.getByText(/a\.morozov@nordwind\.ru/)
).toBeInTheDocument();
  });

  it("загружает информацию о компании после ввода её ID", async () => {
    const user = userEvent.setup();

    renderJoinCompanyPage();

    const companyIdInput = await screen.findByLabelText("ID компании");

    await user.type(companyIdInput, "c-2");

    expect(
      await screen.findByText("Skyline Retail")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Отправить запрос",
      })
    ).toBeEnabled();
  });

  it("не позволяет отправить запрос, если компания не найдена", async () => {
    const user = userEvent.setup();

    renderJoinCompanyPage();

    const companyIdInput = await screen.findByLabelText("ID компании");

    await user.type(companyIdInput, "unknown-company");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Отправить запрос",
        })
      ).toBeDisabled();
    });

    expect(
      screen.queryByText("Skyline Retail")
    ).not.toBeInTheDocument();
  });

  it("отправляет запрос и переходит на страницу ожидания", async () => {
    const user = userEvent.setup();

    renderJoinCompanyPage();

    const companyIdInput = await screen.findByLabelText("ID компании");

    await user.type(companyIdInput, "c-2");

    expect(
      await screen.findByText("Skyline Retail")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Отправить запрос",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("current-path").textContent
      ).toBe("/companies/waiting?companyId=c-2");
    });
  });
});
