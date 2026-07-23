import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HomeworkReviewScreen } from "./HomeworkReviewScreen";
import { useHomeworkDetail } from "../hooks/useHomeworkDetail";
import { useAdaptationStatus } from "../hooks/useAdaptationStatus";
import { useAuthenticatedFileUrl } from "../hooks/useAuthenticatedFileUrl";
import { useLearningProfiles } from "../../students/hooks/useLearningProfiles";
import { useClassDetail } from "../../classes/hooks/useClassDetail";
import { useSendHomework } from "../hooks/useSendHomework";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useHomeworkDetail");
jest.mock("../hooks/useAdaptationStatus");
jest.mock("../hooks/useAuthenticatedFileUrl");
jest.mock("../../students/hooks/useLearningProfiles");
jest.mock("../../classes/hooks/useClassDetail");
jest.mock("../hooks/useSendHomework");

const mockedUseHomeworkDetail = useHomeworkDetail as jest.MockedFunction<typeof useHomeworkDetail>;
const mockedUseAdaptationStatus = useAdaptationStatus as jest.MockedFunction<typeof useAdaptationStatus>;
const mockedUseAuthenticatedFileUrl = useAuthenticatedFileUrl as jest.MockedFunction<
  typeof useAuthenticatedFileUrl
>;
const mockedUsePerfis = useLearningProfiles as jest.MockedFunction<typeof useLearningProfiles>;
const mockedUseTurmaDetalhe = useClassDetail as jest.MockedFunction<typeof useClassDetail>;
const mockedUseSendHomework = useSendHomework as jest.MockedFunction<typeof useSendHomework>;

const PERFIS = [
  {
    id: "profile-1",
    name: "Simplificado + glossário + TTS",
    prompt: {
      code: "P1",
      adaptations: {
        simplifyText: true,
        glossary: true,
        tts: true,
        microtasks: false,
        visualStructure: false,
        highContrast: false,
        largeFont: false,
        screenReader: false,
      },
    },
  },
  {
    id: "profile-3",
    name: "Alto contraste + fonte grande + leitor de tela",
    prompt: {
      code: "P3",
      adaptations: {
        simplifyText: false,
        glossary: false,
        tts: false,
        microtasks: false,
        visualStructure: false,
        highContrast: true,
        largeFont: true,
        screenReader: true,
      },
    },
  },
];

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/atividades/hw-1/revisao"]}>
      <Routes>
        <Route path="/atividades/:id/revisao" element={<HomeworkReviewScreen />} />
        <Route path="/atividades/:id/processando" element={<div>Tela de processamento</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomeworkReviewScreen", () => {
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

    mockedUsePerfis.mockReturnValue({ data: PERFIS } as unknown as ReturnType<typeof useLearningProfiles>);

    mockedUseTurmaDetalhe.mockReturnValue({
      students: [
        { id: "s1", name: "Lucas Mendes", learningProfile: { id: "profile-1" } },
        { id: "s2", name: "Isabela Ferreira", learningProfile: { id: "profile-3" } },
      ],
    } as unknown as ReturnType<typeof useClassDetail>);

    mockedUseAuthenticatedFileUrl.mockReturnValue({
      url: "blob:fake-audio-url",
      isPending: false,
      isError: false,
    });

    mockedUseSendHomework.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSendHomework>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("redireciona para o processamento se ainda houver perfil pendente", () => {
    mockedUseHomeworkDetail.mockReturnValue({
      data: { id: "hw-1", title: "Frações", classId: "turma-1", adaptations: [] },
      isPending: false,
    } as unknown as ReturnType<typeof useHomeworkDetail>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: { homeworkId: "hw-1", status: "processando", adaptations: [] },
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByText("Tela de processamento")).toBeInTheDocument();
  });

  it("mostra conteúdo, glossário e áudio da variante do perfil 1", () => {
    mockedUseHomeworkDetail.mockReturnValue({
      data: {
        id: "hw-1",
        title: "Frações",
        classId: "turma-1",
        adaptations: [
          {
            id: "v1",
            title: "Frações",
            content: "Texto simplificado sobre frações.",
            glossary: [{ term: "Fração", definition: "Parte de um todo." }],
            audioFileId: "file-1",
            learningProfileId: "profile-1",
            classId: "turma-1",
          },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useHomeworkDetail>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "concluido",
        adaptations: [{ learningProfileId: "profile-1", status: "concluido", variantId: "v1" }],
      },
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByText("Texto simplificado sobre frações.")).toBeInTheDocument();
    expect(screen.getByText(/Fração:/)).toBeInTheDocument();
    expect(screen.getByText("Lucas Mendes")).toBeInTheDocument();
    expect(document.querySelector("audio")).toHaveAttribute("src", "blob:fake-audio-url");
  });

  it("habilita 'Confirmar e enviar' só quando todos os perfis estão concluídos", () => {
    mockedUseHomeworkDetail.mockReturnValue({
      data: {
        id: "hw-1",
        title: "Frações",
        classId: "turma-1",
        adaptations: [
          {
            id: "v1",
            title: "Frações",
            content: "Texto.",
            glossary: null,
            audioFileId: null,
            learningProfileId: "profile-1",
            classId: "turma-1",
          },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useHomeworkDetail>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "erro",
        adaptations: [
          { learningProfileId: "profile-1", status: "concluido", variantId: "v1" },
          { learningProfileId: "profile-3", status: "erro", failedReason: "Falha." },
        ],
      },
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    renderScreen();

    expect(screen.getByRole("button", { name: /confirmar e enviar/i })).toBeDisabled();
  });

  it("dispara o envio e navega para a tela de acompanhamento ao confirmar", async () => {
    const mutate = jest.fn((_payload, options) => {
      options?.onSuccess?.({ deliveryId: "delivery-1", enqueuedCount: 1, skippedCount: 0 });
    });
    mockedUseSendHomework.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSendHomework>);

    mockedUseHomeworkDetail.mockReturnValue({
      data: {
        id: "hw-1",
        title: "Frações",
        classId: "turma-1",
        adaptations: [
          {
            id: "v1",
            title: "Frações",
            content: "Texto.",
            glossary: null,
            audioFileId: null,
            learningProfileId: "profile-1",
            classId: "turma-1",
          },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useHomeworkDetail>);
    mockedUseAdaptationStatus.mockReturnValue({
      data: {
        homeworkId: "hw-1",
        status: "concluido",
        adaptations: [{ learningProfileId: "profile-1", status: "concluido", variantId: "v1" }],
      },
    } as unknown as ReturnType<typeof useAdaptationStatus>);

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/atividades/hw-1/revisao"]}>
        <Routes>
          <Route path="/atividades/:id/revisao" element={<HomeworkReviewScreen />} />
          <Route path="/atividades/:id/envio/:deliveryId" element={<div>Tela de envio</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /confirmar e enviar/i }));

    expect(mutate).toHaveBeenCalledWith(undefined, expect.anything());
    expect(screen.getByText("Tela de envio")).toBeInTheDocument();
  });
});
