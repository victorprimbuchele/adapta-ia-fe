import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ClassesScreen } from "./ClassesScreen";
import { useClasses } from "../hooks/useClasses";
import { useDeleteClass } from "../hooks/useDeleteClass";
import { useAuthStore } from "../../../store/authStore";
import type { ClassSummary } from "../hooks/useClasses";

jest.mock("../hooks/useClasses");
jest.mock("../hooks/useDeleteClass");

const mockedUseClasses = useClasses as jest.MockedFunction<typeof useClasses>;
const mockedUseDeleteTurma = useDeleteClass as jest.MockedFunction<typeof useDeleteClass>;

function mockClassesResult(overrides: Partial<ReturnType<typeof useClasses>>) {
  mockedUseClasses.mockReturnValue({
    data: undefined,
    isPending: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useClasses>);
}

function renderScreen() {
  return render(
    <MemoryRouter>
      <ClassesScreen />
    </MemoryRouter>,
  );
}

describe("ClassesScreen", () => {
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

    mockedUseDeleteTurma.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteClass>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mostra o estado de erro quando a busca falha", () => {
    mockClassesResult({ isError: true });

    renderScreen();

    expect(screen.getByText(/não foi possível carregar suas turmas/i)).toBeInTheDocument();
  });

  it("mostra o estado vazio quando não há turmas", () => {
    mockClassesResult({ data: [] });

    renderScreen();

    expect(screen.getByText("Nenhuma turma cadastrada ainda.")).toBeInTheDocument();
  });

  it("mostra as turmas com contagem de alunos e perfis", () => {
    const classes: ClassSummary[] = [
      {
        id: "t1",
        name: "6º Ano A",
        schoolId: "school-1",
        gradeId: "grade-1",
        teacherId: "1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        deletedAt: null,
        students: [
          { id: "s1", name: "Lucas", email: "lucas@escola.com", learningProfile: { id: "p1", name: "Simplificado", prompt: {} } },
          { id: "s2", name: "Ana", email: "ana@escola.com", learningProfile: null },
        ],
      },
    ];
    mockClassesResult({ data: classes });

    renderScreen();

    expect(screen.getByText("6º Ano A")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1× Simplificado")).toBeInTheDocument();
  });

  it("chama a exclusão com o id da turma ao confirmar no card", async () => {
    const mutate = jest.fn();
    mockedUseDeleteTurma.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteClass>);

    const classes: ClassSummary[] = [
      {
        id: "t1",
        name: "6º Ano A",
        schoolId: "school-1",
        gradeId: "grade-1",
        teacherId: "1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        deletedAt: null,
        students: [],
      },
    ];
    mockClassesResult({ data: classes });

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: "Excluir turma" }));
    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(mutate).toHaveBeenCalledWith("t1", expect.anything());
  });
});
