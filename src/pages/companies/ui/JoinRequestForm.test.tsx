
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { JoinRequestForm } from "./JoinRequestForm";

const company = {
  name: "Skyline Retail",
  members: 12,
};

function renderForm(overrides = {}) {
  const props = {
    companyId: "",
    setCompanyId: vi.fn(),
    company: null,
    isPending: false,
    isSent: false,
    onSubmit: vi.fn((e) => e.preventDefault()),
    ...overrides,
    message: '',
    setMessage: vi.fn(),
  };

  return {
    ...render(<JoinRequestForm {...props} />),
    props,
  };
}

describe("JoinRequestForm", () => {
  it("отображает поля формы", () => {
    renderForm();

    expect(screen.getByLabelText("ID компании")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Или вставьте ссылку-приглашение")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Сообщение владельцу")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Отправить запрос" })
    ).toBeInTheDocument();
  });

  it("передаёт введённый ID компании через setCompanyId", async () => {
    const user = userEvent.setup();
    const { props } = renderForm();

    await user.type(screen.getByLabelText("ID компании"), "c-2");

    expect(props.setCompanyId).toHaveBeenCalled();
    expect(props.setCompanyId).toHaveBeenLastCalledWith("2");
  });

  it("отображает информацию о найденной компании", () => {
    renderForm({ company });

    expect(screen.getByText("Skyline Retail")).toBeInTheDocument();
    expect(screen.getByText("Компания · 12 участников")).toBeInTheDocument();
  });

  it("блокирует отправку, если компания не найдена", () => {
    renderForm();

    expect(
      screen.getByRole("button", { name: "Отправить запрос" })
    ).toBeDisabled();
  });

  it("разрешает отправку, если компания найдена", () => {
    renderForm({ company });

    expect(
      screen.getByRole("button", { name: "Отправить запрос" })
    ).toBeEnabled();
  });

  it("блокирует кнопку во время отправки", () => {
    renderForm({ company, isPending: true });

    expect(
      screen.getByRole("button", { name: "Отправка..." })
    ).toBeDisabled();
  });

  it("вызывает onSubmit при отправке формы", async () => {
    const user = userEvent.setup();
    const { props } = renderForm({ company });

    await user.click(
      screen.getByRole("button", { name: "Отправить запрос" })
    );

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("отображает состояние успешно отправленного запроса", () => {
    renderForm({ company, isSent: true });

    expect(screen.getByText("Skyline Retail")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Запрос отправлен/ })
    ).toBeDisabled();

    expect(screen.getByText(/Уведомление об одобрении придёт на email/))
      .toBeInTheDocument();

    expect(
      screen.queryByLabelText("ID компании")
    ).not.toBeInTheDocument();
  });

  it("показывает название компании по умолчанию, если данные отсутствуют", () => {
    renderForm({ isSent: true });

    expect(screen.getByText("Компания")).toBeInTheDocument();
  });
});
