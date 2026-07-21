import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TurmaDetalheScreen } from "./TurmaDetalheScreen";
import { useTurmaDetalhe } from "../hooks/useTurmaDetalhe";
import { useEscolas } from "../hooks/useEscolas";
import { useSeries } from "../hooks/useSeries";
import { useRemoveStudent } from "../../alunos/hooks/useRemoveStudent";
import { useDeleteTurma } from "../hooks/useDeleteTurma";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useTurmaDetalhe");
jest.mock("../hooks/useEscolas");
jest.mock("../hooks/useSeries");
jest.mock("../../alunos/hooks/useRemoveStudent");
jest.mock("../hooks/useDeleteTurma");

const mockedUseTurmaDetalhe = useTurmaDetalhe as jest.MockedFunction<typeof useTurmaDetalhe>;
const mockedUseEscolas = useEscolas as jest.MockedFunction<typeof useEscolas>;
const mockedUseSeries = useSeries as jest.MockedFunction<typeof useSeries>;
const mockedUseRemoveStudent = useRemoveStudent as jest.MockedFunction<typeof useRemoveStudent>;
const mockedUseDeleteTurma = useDeleteTurma as jest.MockedFunction<typeof useDeleteTurma>;

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/turmas/turma-1"]}>
      <Routes>
        <Route path="/turmas/:id" element={<TurmaDetalheScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TurmaDetalheScreen — remoção de aluno", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: "token-fake",
      user: {
        id: "1",
        name: "Prof. Teste",
        email: "prof@escola.com",
        lastLoginAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    mockedUseEscolas.mockReturnValue({ data: [] } as unknown as ReturnType<typeof useEscolas>);
    mockedUseSeries.mockReturnValue({ data: [] } as unknown as ReturnType<typeof useSeries>);

    mockedUseTurmaDetalhe.mockReturnValue({
      turma: { id: "turma-1", name: "6º Ano A", schoolId: "s1", gradeId: "g1" },
      alunos: [
        { id: "aluno-1", name: "Lucas Mendes", email: "lucas@escola.com", learningProfile: null },
      ],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useTurmaDetalhe>);

    mockedUseRemoveStudent.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useRemoveStudent>);

    mockedUseDeleteTurma.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteTurma>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("não mostra o modal de confirmação por padrão", () => {
    renderScreen();

    expect(screen.queryByText("Remover aluno da turma?")).not.toBeInTheDocument();
  });

  it("abre o modal de confirmação ao clicar em Remover, com o nome do aluno", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /remover/i }));

    expect(screen.getByText("Remover aluno da turma?")).toBeInTheDocument();
    expect(screen.getByText(/Lucas Mendes será removido/)).toBeInTheDocument();
  });

  it("fecha o modal sem remover ao clicar em Cancelar", async () => {
    const mutate = jest.fn();
    mockedUseRemoveStudent.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useRemoveStudent>);

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /remover/i }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByText("Remover aluno da turma?")).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("chama a remoção com o id do aluno ao confirmar", async () => {
    const mutate = jest.fn();
    mockedUseRemoveStudent.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useRemoveStudent>);

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /remover/i }));
    // Segundo botão "Remover" é o de confirmação, dentro do modal.
    const confirmButtons = screen.getAllByRole("button", { name: /remover/i });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    expect(mutate).toHaveBeenCalledWith("aluno-1", expect.anything());
  });
});

describe("TurmaDetalheScreen — edição e exclusão de turma", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: "token-fake",
      user: {
        id: "1",
        name: "Prof. Teste",
        email: "prof@escola.com",
        lastLoginAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    mockedUseEscolas.mockReturnValue({ data: [] } as unknown as ReturnType<typeof useEscolas>);
    mockedUseSeries.mockReturnValue({ data: [] } as unknown as ReturnType<typeof useSeries>);

    mockedUseTurmaDetalhe.mockReturnValue({
      turma: { id: "turma-1", name: "6º Ano A", schoolId: "s1", gradeId: "g1" },
      alunos: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useTurmaDetalhe>);

    mockedUseRemoveStudent.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useRemoveStudent>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("não mostra o modal de confirmação de exclusão por padrão", () => {
    mockedUseDeleteTurma.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteTurma>);

    renderScreen();

    expect(screen.queryByText("Excluir turma?")).not.toBeInTheDocument();
  });

  it("abre o modal de confirmação ao clicar em Excluir", async () => {
    mockedUseDeleteTurma.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteTurma>);

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /excluir/i }));

    expect(screen.getByText("Excluir turma?")).toBeInTheDocument();
  });

  it("chama a exclusão com o id da turma ao confirmar", async () => {
    const mutate = jest.fn();
    mockedUseDeleteTurma.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteTurma>);

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /excluir/i }));
    const confirmButtons = screen.getAllByRole("button", { name: /excluir/i });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    expect(mutate).toHaveBeenCalledWith("turma-1", expect.anything());
  });
});
