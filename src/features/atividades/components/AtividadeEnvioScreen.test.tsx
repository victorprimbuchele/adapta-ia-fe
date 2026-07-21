import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AtividadeEnvioScreen } from "./AtividadeEnvioScreen";
import { useDeliveryStatus } from "../hooks/useDeliveryStatus";
import { useResendDelivery } from "../hooks/useResendDelivery";
import { useAuthStore } from "../../../store/authStore";

jest.mock("../hooks/useDeliveryStatus");
jest.mock("../hooks/useResendDelivery");

const mockedUseDeliveryStatus = useDeliveryStatus as jest.MockedFunction<typeof useDeliveryStatus>;
const mockedUseResendDelivery = useResendDelivery as jest.MockedFunction<typeof useResendDelivery>;

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/atividades/hw-1/envio/delivery-1"]}>
      <Routes>
        <Route path="/atividades/:id/envio/:deliveryId" element={<AtividadeEnvioScreen />} />
        <Route path="/atividades/:id/revisao" element={<div>Tela de revisão</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AtividadeEnvioScreen", () => {
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

    mockedUseResendDelivery.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useResendDelivery>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mostra 'Enviando...' enquanto houver destinatário pendente", () => {
    mockedUseDeliveryStatus.mockReturnValue({
      data: {
        id: "delivery-1",
        recipients: [
          { id: "r1", studentName: "Lucas", studentEmail: "lucas@escola.com", status: "pendente", failedReason: null, variantHomeworkId: "v1" },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryStatus>);

    renderScreen();

    expect(screen.getByText("Enviando atividade...")).toBeInTheDocument();
    expect(screen.getByText("Enviando...")).toBeInTheDocument();
  });

  it("mostra sucesso total quando todos os destinatários foram enviados", () => {
    mockedUseDeliveryStatus.mockReturnValue({
      data: {
        id: "delivery-1",
        recipients: [
          { id: "r1", studentName: "Lucas", studentEmail: "lucas@escola.com", status: "enviado", failedReason: null, variantHomeworkId: "v1" },
          { id: "r2", studentName: "Ana", studentEmail: "ana@escola.com", status: "enviado", failedReason: null, variantHomeworkId: "v2" },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryStatus>);

    renderScreen();

    expect(screen.getByText("Envio concluído")).toBeInTheDocument();
    expect(screen.getByText(/2 de 2 alunos/)).toBeInTheDocument();
    expect(screen.getByText("Todos os e-mails foram entregues com sucesso.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reenviar falhas/i })).not.toBeInTheDocument();
  });

  it("mostra falha parcial com motivo e permite reenviar só quem falhou", async () => {
    const mutate = jest.fn();
    mockedUseResendDelivery.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useResendDelivery>);

    mockedUseDeliveryStatus.mockReturnValue({
      data: {
        id: "delivery-1",
        recipients: [
          { id: "r1", studentName: "Lucas", studentEmail: "lucas@escola.com", status: "enviado", failedReason: null, variantHomeworkId: "v1" },
          {
            id: "r2",
            studentName: "Ana",
            studentEmail: "ana@escola.com",
            status: "falhou",
            failedReason: "Falha ao enviar o e-mail. Tente novamente em instantes.",
            variantHomeworkId: "v2",
          },
        ],
      },
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryStatus>);

    const user = userEvent.setup();
    renderScreen();

    expect(screen.getByText("Envio com falhas")).toBeInTheDocument();
    expect(screen.getByText(/1 de 2 alunos/)).toBeInTheDocument();
    expect(
      screen.getByText("Falha ao enviar o e-mail. Tente novamente em instantes."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reenviar falhas/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
