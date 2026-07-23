import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HomeworkProcessingScreen } from "./HomeworkProcessingScreen";
import { useHomeworkDetail } from "../hooks/useHomeworkDetail";
import { useAdaptHomework } from "../hooks/useAdaptHomework";
import { useAdaptationStatus } from "../hooks/useAdaptationStatus";
import { useLearningProfiles } from "../../students/hooks/useLearningProfiles";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useHomeworkDetail");
jest.mock("../hooks/useAdaptHomework");
jest.mock("../hooks/useAdaptationStatus");
jest.mock("../../students/hooks/useLearningProfiles");

const mockedUseHomeworkDetail = useHomeworkDetail as jest.MockedFunction<typeof useHomeworkDetail>;
const mockedUseAdaptHomework = useAdaptHomework as jest.MockedFunction<typeof useAdaptHomework>;
const mockedUseAdaptationStatus = useAdaptationStatus as jest.MockedFunction<typeof useAdaptationStatus>;
const mockedUsePerfis = useLearningProfiles as jest.MockedFunction<typeof useLearningProfiles>;

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/atividades/hw-1/processando"]}>
      <Routes>
        <Route path="/atividades/:id/processando" element={<HomeworkProcessingScreen />} />
        <Route path="/atividades/:id/revisao" element={<div>Tela de revisão</div>} />
        <Route path="/turmas" element={<div>Tela de turmas</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomeworkProcessingScreen", () => {
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

    mockedUseHomeworkDetail.mockReturnValue({
      data: { id: "hw-1", title: "Frações", adaptations: [] },
      isPending: false,
    } as unknown as ReturnType<typeof useHomeworkDetail>);

    mockedUsePerfis.mockReturnValue({
      data: [
        { id: "profile-1", name: "Simplificado + glossário + TTS", prompt: { code: "P1" } },
        { id: "profile-2", name: "Microtarefas + estrutura visual", prompt: { code: "P2" } },
      ],
      isPending: false,
    } as unknown as ReturnType<typeof useLearningProfiles>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("dispara a adaptação uma única vez ao montar", () => {
    const mutate = jest.fn();
    mockedUseAdaptHomework.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useAdaptHomework>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: { homeworkId: "hw-1", status: "pendente", adaptations: [] },
      isPending: false,
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(undefined);
  });

  it("mostra o progresso por perfil com os status corretos", () => {
    mockedUseAdaptHomework.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useAdaptHomework>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "processando",
        adaptations: [
          { learningProfileId: "profile-1", status: "concluido", variantId: "v1" },
          { learningProfileId: "profile-2", status: "processando" },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByText("Simplificado + glossário + TTS")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.getByText("Microtarefas + estrutura visual")).toBeInTheDocument();
    expect(screen.getByText("Processando")).toBeInTheDocument();
  });

  it("mostra o motivo da falha e permite tentar novamente só aquele perfil", async () => {
    const mutate = jest.fn();
    mockedUseAdaptHomework.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useAdaptHomework>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "erro",
        adaptations: [
          { learningProfileId: "profile-1", status: "concluido", variantId: "v1" },
          {
            learningProfileId: "profile-2",
            status: "erro",
            failedReason: "Falha ao adaptar o texto com a IA. Tente novamente em instantes.",
          },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    const user = userEvent.setup();
    renderScreen();

    expect(
      screen.getByText("Falha ao adaptar o texto com a IA. Tente novamente em instantes."),
    ).toBeInTheDocument();
    expect(screen.getByText("Ver adaptações concluídas mesmo assim")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));

    expect(mutate).toHaveBeenLastCalledWith(["profile-2"]);
  });

  it("mostra mensagem clara quando a turma não tem perfis para adaptar", () => {
    mockedUseAdaptHomework.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: true,
      error: {
        isAxiosError: true,
        response: { data: { error: { code: "NO_LEARNING_PROFILES_TO_ADAPT", message: "..." } } },
      },
    } as unknown as ReturnType<typeof useAdaptHomework>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: { homeworkId: "hw-1", status: "pendente", adaptations: [] },
      isPending: false,
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByText(/nenhum aluno desta turma tem um perfil de aprendizagem/i)).toBeInTheDocument();
  });

  it("navega para a revisão quando todos os perfis concluem", () => {
    mockedUseAdaptHomework.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useAdaptHomework>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "concluido",
        adaptations: [{ learningProfileId: "profile-1", status: "concluido", variantId: "v1" }],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByText("Tela de revisão")).toBeInTheDocument();
  });
});
