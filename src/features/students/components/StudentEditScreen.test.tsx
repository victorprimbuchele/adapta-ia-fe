import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StudentEditScreen } from "./StudentEditScreen";
import { useLearningProfiles } from "../hooks/useLearningProfiles";
import { useUpdateStudent } from "../hooks/useUpdateStudent";
import { useClassDetail } from "../../classes/hooks/useClassDetail";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useLearningProfiles");
jest.mock("../hooks/useUpdateStudent");
jest.mock("../../classes/hooks/useClassDetail");

const mockedUsePerfis = useLearningProfiles as jest.MockedFunction<typeof useLearningProfiles>;
const mockedUseUpdateStudent = useUpdateStudent as jest.MockedFunction<typeof useUpdateStudent>;
const mockedUseTurmaDetalhe = useClassDetail as jest.MockedFunction<typeof useClassDetail>;

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/turmas/turma-1/alunos/aluno-1/editar"]}>
      <Routes>
        <Route path="/turmas/:id/alunos/:studentId/editar" element={<StudentEditScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("StudentEditScreen", () => {
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

    mockedUsePerfis.mockReturnValue({
      data: [
        { id: "profile-1", name: "Simplificado + glossário + TTS", prompt: { code: "P1" } },
        { id: "profile-2", name: "Microtarefas + estrutura visual", prompt: { code: "P2" } },
      ],
      isPending: false,
    } as ReturnType<typeof useLearningProfiles>);

    mockedUseUpdateStudent.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useUpdateStudent>);

    mockedUseTurmaDetalhe.mockReturnValue({
      classDetail: { id: "turma-1", name: "6º Ano A" },
      students: [
        {
          id: "aluno-1",
          name: "Lucas Mendes",
          email: "lucas@escola.com",
          learningProfile: { id: "profile-1", name: "Simplificado + glossário + TTS", prompt: { code: "P1" } },
        },
      ],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useClassDetail>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("preenche o formulário com os dados atuais do aluno", () => {
    renderScreen();

    expect(screen.getByLabelText("Nome completo")).toHaveValue("Lucas Mendes");
    expect(screen.getByLabelText("E-mail")).toHaveValue("lucas@escola.com");
    const profile1Button = screen.getByText(/P1 · Simplificado/).closest("button");
    expect(profile1Button?.querySelector("svg")).toBeInTheDocument();
  });

  it("mostra mensagem quando o aluno não é encontrado na turma", () => {
    mockedUseTurmaDetalhe.mockReturnValue({
      classDetail: { id: "turma-1", name: "6º Ano A" },
      students: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useClassDetail>);

    renderScreen();

    expect(screen.getByText(/não foi possível carregar este aluno/i)).toBeInTheDocument();
  });

  it("envia nome, e-mail e perfil atualizados ao salvar", async () => {
    const mutate = jest.fn();
    mockedUseUpdateStudent.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useUpdateStudent>);

    const user = userEvent.setup();
    renderScreen();

    await user.clear(screen.getByLabelText("Nome completo"));
    await user.type(screen.getByLabelText("Nome completo"), "Lucas M. Andrade");
    await user.click(screen.getByText(/P2 · Microtarefas/));
    await user.click(screen.getByRole("button", { name: /salvar alterações/i }));

    expect(mutate).toHaveBeenCalledWith(
      { name: "Lucas M. Andrade", email: "lucas@escola.com", learningProfileId: "profile-2" },
      expect.anything(),
    );
  });
});
