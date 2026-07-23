import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HomeworkNewScreen } from "./HomeworkNewScreen";
import { useClassOptions } from "../hooks/useClassOptions";
import { useCreateHomework } from "../hooks/useCreateHomework";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useClassOptions");
jest.mock("../hooks/useCreateHomework");

const mockedUseTurmasOptions = useClassOptions as jest.MockedFunction<typeof useClassOptions>;
const mockedUseCreateAtividade = useCreateHomework as jest.MockedFunction<typeof useCreateHomework>;

function renderScreen() {
  return render(
    <MemoryRouter>
      <HomeworkNewScreen />
    </MemoryRouter>,
  );
}

describe("HomeworkNewScreen", () => {
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

    mockedUseCreateAtividade.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateHomework>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mostra estado vazio quando o professor não tem turmas", () => {
    mockedUseTurmasOptions.mockReturnValue({
      data: [],
      isPending: false,
    } as unknown as ReturnType<typeof useClassOptions>);

    renderScreen();

    expect(screen.getByText("Crie uma turma primeiro")).toBeInTheDocument();
    expect(screen.queryByLabelText("Título da atividade")).not.toBeInTheDocument();
  });

  it("mantém o botão desabilitado enquanto campos obrigatórios estão vazios", () => {
    mockedUseTurmasOptions.mockReturnValue({
      data: [{ id: "turma-1", name: "6º Ano A" }],
      isPending: false,
    } as unknown as ReturnType<typeof useClassOptions>);

    renderScreen();

    expect(screen.getByRole("button", { name: /salvar e continuar/i })).toBeDisabled();
  });

  it("envia os dados do formulário ao confirmar", async () => {
    mockedUseTurmasOptions.mockReturnValue({
      data: [{ id: "turma-1", name: "6º Ano A" }],
      isPending: false,
    } as unknown as ReturnType<typeof useClassOptions>);

    const mutate = jest.fn();
    mockedUseCreateAtividade.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateHomework>);

    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText("Título da atividade"), "Interpretação — Capítulo 3");
    await user.selectOptions(screen.getByLabelText("Disciplina"), "Língua Portuguesa");
    await user.selectOptions(screen.getByLabelText("Turma destinatária"), "turma-1");
    await user.type(screen.getByLabelText("Texto principal"), "Texto da atividade.");
    await user.type(screen.getByLabelText("Questões"), "1. Pergunta?");
    await user.click(screen.getByRole("button", { name: /salvar e continuar/i }));

    expect(mutate).toHaveBeenCalledWith(
      {
        title: "Interpretação — Capítulo 3",
        subject: "Língua Portuguesa",
        classId: "turma-1",
        content: "Texto da atividade.",
        question: "1. Pergunta?",
      },
      expect.anything(),
    );
  });
});
