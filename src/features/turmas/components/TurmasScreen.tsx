import { useState } from "react";
import { ChevronRight, GraduationCap, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { ProfileBadge } from "../../../components/shared/ProfileBadge";
import { cardBaseClass as cardCls } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorMessage } from "../../../infra/http/apiClient";
import { useDeleteTurma } from "../hooks/useDeleteTurma";
import { useTurmas } from "../hooks/useTurmas";
import type { TurmaResumo } from "../hooks/useTurmas";

function profileBreakdown(turma: TurmaResumo): Array<{ id: string; name: string; count: number }> {
  const counts = new Map<string, { name: string; count: number }>();
  for (const student of turma.students) {
    if (!student.learningProfile) continue;
    const existing = counts.get(student.learningProfile.id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(student.learningProfile.id, { name: student.learningProfile.name, count: 1 });
    }
  }
  return Array.from(counts.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => b.count - a.count);
}

function TurmaCard({ turma, onDelete }: { turma: TurmaResumo; onDelete: (turma: TurmaResumo) => void }) {
  const navigate = useNavigate();
  const profiles = profileBreakdown(turma);

  return (
    <div className={`${cardCls} p-5 hover:border-brand/25 hover:shadow-sm transition-all`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-brand" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-ink text-base font-heading">{turma.name}</h3>
            <div className="flex items-center gap-2.5 mt-3 flex-wrap">
              <span className="text-xs text-muted">
                <span className="font-bold text-ink">{turma.students.length}</span>{" "}
                aluno{turma.students.length !== 1 ? "s" : ""}
              </span>
              {profiles.slice(0, 3).map((profile) => (
                <ProfileBadge
                  key={profile.id}
                  name={profile.name}
                  count={profile.count}
                  className="px-2 py-0.5 max-w-[160px]"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate(`/turmas/${turma.id}/editar`)}
            title="Editar turma"
            aria-label="Editar turma"
            className="flex items-center justify-center w-8 h-8 text-muted border border-border-input rounded-lg hover:bg-bg-soft transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(turma)}
            title="Excluir turma"
            aria-label="Excluir turma"
            className="flex items-center justify-center w-8 h-8 text-muted border border-border-input rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/turmas/${turma.id}/alunos/novo`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand border border-brand/25 rounded-lg hover:bg-brand-soft transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Adicionar aluno
          </button>
          <button
            type="button"
            onClick={() => navigate(`/turmas/${turma.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand rounded-lg hover:bg-brand-dark transition-colors"
          >
            Detalhes
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TurmasSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className={`${cardCls} p-12 text-center`}>
      <GraduationCap className="w-10 h-10 text-border-input mx-auto mb-3" />
      <p className="text-muted text-sm">Nenhuma turma cadastrada ainda.</p>
      <button
        type="button"
        onClick={() => navigate("/turmas/nova")}
        className="mt-4 text-sm text-brand font-bold hover:underline"
      >
        Criar primeira turma
      </button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className={`${cardCls} p-12 text-center`}>
      <p className="text-muted text-sm">
        Não foi possível carregar suas turmas agora. Tente recarregar a página em instantes.
      </p>
    </div>
  );
}

export function TurmasScreen() {
  const navigate = useNavigate();
  const { data: turmas, isPending, isError } = useTurmas();
  const deleteTurma = useDeleteTurma();
  const [turmaToDelete, setTurmaToDelete] = useState<TurmaResumo | null>(null);

  const handleConfirmDelete = () => {
    if (!turmaToDelete) return;
    deleteTurma.mutate(turmaToDelete.id, {
      onSuccess: () => setTurmaToDelete(null),
    });
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink font-heading">Turmas</h1>
            <p className="text-muted text-sm mt-1">
              {isPending ? "Carregando..." : `${turmas?.length ?? 0} turma${turmas?.length === 1 ? "" : "s"} cadastrada${turmas?.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/turmas/nova")}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-brand/20 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova turma
          </button>
        </div>

        {isPending ? (
          <TurmasSkeleton />
        ) : isError || !turmas ? (
          <ErrorState />
        ) : turmas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {turmas.map((turma) => (
              <TurmaCard key={turma.id} turma={turma} onDelete={setTurmaToDelete} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={turmaToDelete !== null}
        title="Excluir turma?"
        description={`"${turmaToDelete?.name ?? "Esta turma"}" será excluída. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmingLabel="Excluindo..."
        isConfirming={deleteTurma.isPending}
        errorMessage={deleteTurma.isError ? getApiErrorMessage(deleteTurma.error) : null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTurmaToDelete(null)}
      />
    </AppLayout>
  );
}
