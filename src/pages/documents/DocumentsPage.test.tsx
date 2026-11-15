import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { DocumentsPage } from "./DocumentsPage";

const mockUseQuery = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useQuery: mockUseQuery,
}));

const company = {
  id: "company-1",
  name: "Тестовая компания",
};

const createDocument = (
  uuid: string,
  mimeType = "application/pdf",
  status = "ACTIVE",
) => ({
  uuid,
  company_id: "company-1",
  original_name: `Документ ${uuid}`,
  mime_type: mimeType,
  status,
  created_at: "2026-01-15T10:00:00.000Z",
});

const documents = [
  createDocument("doc-1", "application/pdf", "ACTIVE"),
  createDocument("doc-2", "video/mp4", "ACTIVE"),
  createDocument("doc-3", "audio/mpeg", "PREPARING"),
  createDocument("doc-4", "application/pdf", "PREPARING"),
  createDocument("doc-5", "video/mp4", "ACTIVE"),
  createDocument("doc-6", "audio/mpeg", "ACTIVE"),
  createDocument("doc-7", "application/pdf", "ERROR"),
  createDocument("doc-8", "video/mp4", "PREPARING"),
  createDocument("doc-9", "audio/mpeg", "ERROR"),
  createDocument("doc-10", "application/pdf", "ACTIVE"),
  createDocument("doc-11", "video/mp4", "ACTIVE"),
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/app/documents/company-1"]}>
      <Routes>
        <Route path="/app/documents/:id" element={<DocumentsPage />} />
        <Route
          path="/app/documents/upload/:id"
          element={<div>Страница загрузки документа</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

function mockQueries(docs = documents, companyData = company, loading = false) {
  mockUseQuery.mockImplementation(({ queryKey }: { queryKey: string[] }) => {
    if (queryKey[0] === "documents") {
      return {
        data: docs,
        isLoading: loading,
      };
    }

    if (queryKey[0] === "company") {
      return {
        data: companyData,
        isLoading: loading,
      };
    }

    return {
      data: undefined,
      isLoading: false,
    };
  });
}

describe("DocumentsPage — интеграционные тесты", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueries();
  });

  it("отображает заголовок страницы и название компании", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Документы" }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Тестовая компания/)).toBeInTheDocument();

    expect(
      screen.getByText(/11 материала в памяти компании/),
    ).toBeInTheDocument();
  });

  it("отображает список документов", () => {
    renderPage();

    expect(screen.getByText("Документ doc-1")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-2")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-9")).toBeInTheDocument();

    // На первой странице отображается не более 9 документов.
    expect(screen.queryByText("Документ doc-10")).not.toBeInTheDocument();
  });

  it("отображает сообщение, если документов нет", () => {
    mockQueries([]);

    renderPage();

    expect(screen.getByText("Документов пока нет")).toBeInTheDocument();

    expect(
      screen.getByText(/0 материала в памяти компании/),
    ).toBeInTheDocument();
  });

  it("отображает состояние загрузки", () => {
    mockQueries([], company, true);

    renderPage();

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Документы" }),
    ).not.toBeInTheDocument();
  });

  it("фильтрует документы по типу", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /Все типы/ }));

    expect(screen.getByText("Документ doc-2")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-5")).toBeInTheDocument();
    expect(screen.queryByText("Документ doc-1")).not.toBeInTheDocument();
    expect(screen.queryByText("Документ doc-3")).not.toBeInTheDocument();

    expect(
      screen.getByText(/4 материала в памяти компании/),
    ).toBeInTheDocument();
  });

  it("фильтрует документы по статусу", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /Все статусы/ }));

    expect(screen.getByText("Документ doc-1")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-2")).toBeInTheDocument();
    expect(screen.queryByText("Документ doc-3")).not.toBeInTheDocument();
    expect(screen.queryByText("Документ doc-4")).not.toBeInTheDocument();

    expect(
      screen.getByText(/6 материала в памяти компании/),
    ).toBeInTheDocument();
  });

  it("позволяет выбрать один документ и снять выделение", () => {
    renderPage();

    const checkboxes = screen.getAllByRole("checkbox");

    // Первый checkbox — выбор всех документов.
    // Второй — выбор первого документа.
    fireEvent.click(checkboxes[1]);

    expect(screen.getByText("Выбрано: 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Скачать" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Удалить" })).toBeInTheDocument();

    fireEvent.click(checkboxes[1]);

    expect(screen.queryByText("Выбрано: 1")).not.toBeInTheDocument();
  });

  it("позволяет выбрать все документы и снять общее выделение", () => {
    renderPage();

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0];

    fireEvent.click(selectAllCheckbox);

    expect(screen.getByText("Выбрано: 11")).toBeInTheDocument();
    expect(selectAllCheckbox).toBeChecked();

    fireEvent.click(selectAllCheckbox);

    expect(screen.queryByText("Выбрано: 11")).not.toBeInTheDocument();
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("переключает страницы и отображает документы текущей страницы", () => {
    renderPage();

    expect(screen.getByText("Документ doc-1")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-9")).toBeInTheDocument();
    expect(screen.queryByText("Документ doc-10")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Далее" }));

    expect(screen.getByText("Документ doc-10")).toBeInTheDocument();
    expect(screen.getByText("Документ doc-11")).toBeInTheDocument();
    expect(screen.queryByText("Документ doc-1")).not.toBeInTheDocument();

    expect(
      screen.getByText("Показано 10–11 из 11 документов"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(screen.getByText("Документ doc-1")).toBeInTheDocument();
    expect(screen.queryByText("Документ doc-10")).not.toBeInTheDocument();
  });

  it("переходит на страницу загрузки документа", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /Загрузить документ/ }));

    expect(screen.getByText("Страница загрузки документа")).toBeInTheDocument();
  });

  it("отображает статус документа", () => {
    renderPage();

    expect(screen.getAllByText("Готов").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Обрабатывается").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ошибка").length).toBeGreaterThan(0);
  });
});
