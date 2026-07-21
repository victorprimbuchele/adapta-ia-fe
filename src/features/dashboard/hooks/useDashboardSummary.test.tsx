import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useDashboardSummary } from "./useDashboardSummary";
import { turmasService } from "../../turmas/services/turmasService";

jest.mock("../../turmas/services/turmasService");

const mockedTurmasService = turmasService as jest.Mocked<typeof turmasService>;

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useDashboardSummary", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("retorna resumo zerado quando o professor não tem turmas", async () => {
    mockedTurmasService.listClasses.mockResolvedValue([]);

    const { result } = renderHook(() => useDashboardSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      turmasCount: 0,
      alunosCount: 0,
      atividadesCount: 0,
      atividadesEnviadasCount: 0,
      turmas: [],
      recentActivities: [],
    });
  });

  it("agrega turmas, alunos e as 3 atividades mais recentes de todas as turmas", async () => {
    mockedTurmasService.listClasses.mockResolvedValue([
      { id: "t1", name: "6º Ano A" } as never,
      { id: "t2", name: "7º Ano B" } as never,
    ]);
    mockedTurmasService.listClassStudents.mockImplementation((classId: string) =>
      Promise.resolve(classId === "t1" ? ([{ id: "s1" }, { id: "s2" }] as never) : ([{ id: "s3" }] as never)),
    );
    mockedTurmasService.listClassActivities.mockImplementation((classId: string) =>
      Promise.resolve(
        (classId === "t1"
          ? [
              { id: "a1", title: "Frações", classId: "t1", isDraft: false, createdAt: "2026-06-20T10:00:00.000Z" },
              { id: "a2", title: "Interpretação", classId: "t1", isDraft: true, createdAt: "2026-06-28T10:00:00.000Z" },
            ]
          : [
              { id: "a3", title: "Revolução Industrial", classId: "t2", isDraft: false, createdAt: "2026-06-25T10:00:00.000Z" },
              { id: "a4", title: "Sistema Solar", classId: "t2", isDraft: false, createdAt: "2026-06-10T10:00:00.000Z" },
            ]) as never,
      ),
    );

    const { result } = renderHook(() => useDashboardSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      turmasCount: 2,
      alunosCount: 3,
      atividadesCount: 4,
      atividadesEnviadasCount: 3,
    });
    expect(result.current.data?.turmas).toEqual([
      { id: "t1", name: "6º Ano A", studentCount: 2 },
      { id: "t2", name: "7º Ano B", studentCount: 1 },
    ]);
    expect(result.current.data?.recentActivities.map((a) => a.id)).toEqual(["a2", "a3", "a1"]);
  });
});
