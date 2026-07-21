import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AlunoNovoScreen } from "./AlunoNovoScreen";
import { usePerfisAprendizagem } from "../hooks/usePerfisAprendizagem";
import { useEnrollStudent } from "../hooks/useEnrollStudent";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/usePerfisAprendizagem");
jest.mock("../hooks/useEnrollStudent");

const mockedUsePerfis = usePerfisAprendizagem as jest.MockedFunction<typeof usePerfisAprendizagem>;
const mockedUseEnrollStudent = useEnrollStudent as jest.MockedFunction<typeof useEnrollStudent>;

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/turmas/turma-1/alunos/novo"]}>
      <Routes>
        <Route path="/turmas/:id/alunos/novo" element={<AlunoNovoScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AlunoNovoScreen", () => {
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
    } as ReturnType<typeof usePerfisAprendizagem>);

    mockedUseEnrollStudent.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useEnrollStudent>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mantém o botão desabilitado enquanto nome, e-mail e perfil não estão preenchidos", () => {
    renderScreen();

    expect(screen.getByRole("button", { name: /cadastrar aluno/i })).toBeDisabled();
  });

  it("permite selecionar apenas um perfil por vez", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByText(/P1 · Simplificado/));
    await user.click(screen.getByText(/P2 · Microtarefas/));

    // Só o perfil 2 deve mostrar o ícone de selecionado.
    const profile1Button = screen.getByText(/P1 · Simplificado/).closest("button");
    const profile2Button = screen.getByText(/P2 · Microtarefas/).closest("button");
    expect(profile1Button?.querySelector("svg")).not.toBeInTheDocument();
    expect(profile2Button?.querySelector("svg")).toBeInTheDocument();
  });

  it("envia nome, e-mail e o perfil selecionado ao confirmar", async () => {
    const mutate = jest.fn();
    mockedUseEnrollStudent.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useEnrollStudent>);

    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText("Nome completo"), "Lucas Mendes");
    await user.type(screen.getByLabelText("E-mail"), "lucas@escola.com");
    await user.click(screen.getByText(/P2 · Microtarefas/));
    await user.click(screen.getByRole("button", { name: /cadastrar aluno/i }));

    expect(mutate).toHaveBeenCalledWith(
      { name: "Lucas Mendes", email: "lucas@escola.com", learningProfileId: "profile-2" },
      expect.anything(),
    );
  });
});
