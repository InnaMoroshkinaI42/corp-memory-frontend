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

import { CreateCompanyPage } from "./CreateCompanyPage";

function CurrentPath() {
  const location = useLocation();

  return (
    <output data-testid="current-path">
      {location.pathname}
    </output>
  );
}

function renderCreateCompanyPage() {
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
    <MemoryRouter initialEntries={["/companies/create"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/companies/create"
            element={<CreateCompanyPage />}
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

describe("CreateCompanyPage — интеграционные тесты", () => {
  it("отображает заголовок и форму создания компании", async () => {
    renderCreateCompanyPage();

    expect(
      await screen.findByRole("heading", {
        name: "Создать компанию",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Название компании *")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Описание")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Рабочий домен")
    ).toBeInTheDocument();
  });

  it("отображает информацию о текущем пользователе", async () => {
    renderCreateCompanyPage();

    expect(
      await screen.findByText(/Вы станете владельцем компании/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/@/)
    ).toBeInTheDocument();
  });

  it("создаёт компанию со всеми заполненными полями и переходит на её обзор", async () => {
    const user = userEvent.setup();

    renderCreateCompanyPage();

    const nameInput = await screen.findByLabelText(
      "Название компании *"
    );

    const descriptionInput = screen.getByLabelText("Описание");
    const domainInput = screen.getByLabelText("Рабочий домен");

    await user.type(nameInput, "Тестовая команда");
    await user.type(descriptionInput, "Описание тестовой команды");
    await user.type(domainInput, "test-team.ru");

    await user.click(
      screen.getByRole("button", {
        name: /Создать компанию/,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("current-path").textContent
      ).toMatch(/^\/app\/overview\//);
    });
  }, 10000);

  it("не отправляет форму с пустым названием", async () => {
    const user = userEvent.setup();

    renderCreateCompanyPage();

    await screen.findByLabelText("Название компании *");

    const nameInput = screen.getByLabelText(
      "Название компании *"
    );

    expect(nameInput).toBeRequired();

    await user.click(
      screen.getByRole("button", {
        name: /Создать компанию/,
      })
    );

    expect(nameInput).toBeInvalid();

    expect(
      screen.queryByTestId("current-path")
    ).not.toBeInTheDocument();
  });

  it("показывает ошибку, если сервер отклоняет создание компании", async () => {
    const user = userEvent.setup();

    renderCreateCompanyPage();

    const nameInput = await screen.findByLabelText(
      "Название компании *"
    );

    await user.type(nameInput, "A".repeat(101));

    await user.click(
      screen.getByRole("button", {
        name: /Создать компанию/,
      })
    );

    expect(
      await screen.findByText(
        /Не удалось создать компанию/
      )
    ).toBeInTheDocument();
  });
});
