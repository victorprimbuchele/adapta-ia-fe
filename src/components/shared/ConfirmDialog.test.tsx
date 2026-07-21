import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("não renderiza nada quando open é false", () => {
    render(
      <ConfirmDialog
        open={false}
        title="Remover aluno?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.queryByText("Remover aluno?")).not.toBeInTheDocument();
  });

  it("chama onConfirm ao clicar no botão de confirmação", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        open
        title="Remover aluno?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remover" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("chama onCancel ao clicar em cancelar, no overlay ou ao pressionar Escape", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        open
        title="Remover aluno?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it("desabilita os botões e não fecha via Escape enquanto isConfirming", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        open
        isConfirming
        title="Remover aluno?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Remover"
        confirmingLabel="Removendo..."
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole("button", { name: /removendo/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();

    await user.keyboard("{Escape}");
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("mostra a mensagem de erro quando informada", () => {
    render(
      <ConfirmDialog
        open
        title="Remover aluno?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Remover"
        errorMessage="Este aluno já não está mais nesta turma."
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Este aluno já não está mais nesta turma.");
  });
});
