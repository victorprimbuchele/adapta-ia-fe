import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ClassNewScreen } from "./ClassNewScreen";
import { useSchools } from "../hooks/useSchools";
import { useGrades } from "../hooks/useGrades";
import { useCreateClass } from "../hooks/useCreateClass";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useSchools");
jest.mock("../hooks/useGrades");
jest.mock("../hooks/useCreateClass");

const mockedUseEscolas = useSchools as jest.MockedFunction<typeof useSchools>;
const mockedUseSeries = useGrades as jest.MockedFunction<typeof useGrades>;
const mockedUseCreateTurma = useCreateClass as jest.MockedFunction<typeof useCreateClass>;

function renderScreen() {
  return render(
    <MemoryRouter>
      <ClassNewScreen />
    </MemoryRouter>,
  );
}

describe("ClassNewScreen", () => {
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

    mockedUseEscolas.mockReturnValue({
      data: [{ id: "school-1", name: "E.M. Santos Dumont", city: "São Paulo", state: "SP", createdAt: "", updatedAt: "" }],
      isPending: false,
    } as ReturnType<typeof useSchools>);

    mockedUseSeries.mockReturnValue({
      data: [{ id: "grade-1", name: "6º Ano", sortOrder: 6, createdAt: "", updatedAt: "" }],
      isPending: false,
    } as ReturnType<typeof useGrades>);

    mockedUseCreateTurma.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateClass>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mantém o botão desabilitado enquanto campos obrigatórios estão vazios", () => {
    renderScreen();

    expect(screen.getByRole("button", { name: /criar turma/i })).toBeDisabled();
  });

  it("habilita o botão quando nome, série e escola são preenchidos", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText("Nome da turma"), "6º Ano A");
    await user.selectOptions(screen.getByLabelText("Série"), "grade-1");
    await user.selectOptions(screen.getByLabelText("Escola"), "E.M. Santos Dumont");

    expect(screen.getByRole("button", { name: /criar turma/i })).toBeEnabled();
  });

  it("envia os dados do formulário ao confirmar", async () => {
    const mutate = jest.fn();
    mockedUseCreateTurma.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateClass>);

    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText("Nome da turma"), "6º Ano A");
    await user.selectOptions(screen.getByLabelText("Série"), "grade-1");
    await user.selectOptions(screen.getByLabelText("Escola"), "E.M. Santos Dumont");
    await user.click(screen.getByRole("button", { name: /criar turma/i }));

    expect(mutate).toHaveBeenCalledWith(
      { name: "6º Ano A", gradeId: "grade-1", schoolName: "E.M. Santos Dumont" },
      expect.anything(),
    );
  });
});
