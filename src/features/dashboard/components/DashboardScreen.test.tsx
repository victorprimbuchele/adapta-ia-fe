import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardScreen } from "./DashboardScreen";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useAuthStore } from "../../../store/authStore";
import type { DashboardSummary } from "../hooks/useDashboardSummary";

jest.mock("../hooks/useDashboardSummary");

const mockedUseDashboardSummary = useDashboardSummary as jest.MockedFunction<typeof useDashboardSummary>;

function mockSummaryResult(overrides: Partial<ReturnType<typeof useDashboardSummary>>) {
  mockedUseDashboardSummary.mockReturnValue({
    data: undefined,
    isPending: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useDashboardSummary>);
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardScreen />
    </MemoryRouter>,
  );
}

describe("DashboardScreen", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: "token-fake",
      user: {
        id: "1",
        name: "Prof. Carla Souza",
        email: "carla@escola.com",
        lastLoginAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mostra o estado de loading enquanto os dados carregam", () => {
    mockSummaryResult({ isPending: true });

    renderDashboard();

    expect(screen.getByText("Olá, Prof.!")).toBeInTheDocument();
    expect(screen.queryByText("Turmas ativas")).not.toBeInTheDocument();
  });

  it("mostra o estado de erro quando a busca falha", () => {
    mockSummaryResult({ isPending: false, isError: true });

    renderDashboard();

    expect(screen.getByText(/não foi possível carregar o dashboard/i)).toBeInTheDocument();
  });

  it("mostra o estado vazio quando o professor não tem turmas", () => {
    const summary: DashboardSummary = {
      classesCount: 0,
      studentsCount: 0,
      homeworksCount: 0,
      homeworksSentCount: 0,
      classes: [],
      recentActivities: [],
    };
    mockSummaryResult({ isPending: false, isError: false, data: summary });

    renderDashboard();

    expect(screen.getByText("Crie sua primeira turma")).toBeInTheDocument();
    expect(screen.getAllByText("Nova Atividade")).toHaveLength(1);
  });

  it("mostra contagens, atividades recentes e turmas quando há dados", () => {
    const summary: DashboardSummary = {
      classesCount: 2,
      studentsCount: 5,
      homeworksCount: 3,
      homeworksSentCount: 2,
      classes: [
        { id: "t1", name: "6º Ano A", studentCount: 3 },
        { id: "t2", name: "7º Ano B", studentCount: 2 },
      ],
      recentActivities: [
        { id: "a1", title: "Frações", classId: "t1", className: "6º Ano A", createdAt: "2026-06-20T10:00:00.000Z", isDraft: false },
        { id: "a2", title: "Interpretação de texto", classId: "t1", className: "6º Ano A", createdAt: "2026-06-28T10:00:00.000Z", isDraft: true },
      ],
    };
    mockSummaryResult({ isPending: false, isError: false, data: summary });

    renderDashboard();

    expect(screen.getByTestId("stat-classes")).toHaveTextContent("2");
    expect(screen.getByTestId("stat-students")).toHaveTextContent("5");
    expect(screen.getByTestId("stat-homeworks")).toHaveTextContent("2");
    expect(screen.getByText("Frações")).toBeInTheDocument();
    expect(screen.getByText("Interpretação de texto")).toBeInTheDocument();
    expect(screen.getByText("Rascunho")).toBeInTheDocument();
    expect(screen.getByText("Enviada")).toBeInTheDocument();
    expect(screen.getByText("6º Ano A")).toBeInTheDocument();
    expect(screen.getByText("7º Ano B")).toBeInTheDocument();
    expect(screen.getAllByText("Nova Atividade")).toHaveLength(2);
  });
});
