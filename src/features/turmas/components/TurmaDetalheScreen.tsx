import { useState } from "react";
import { GraduationCap, Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorMessage } from "../../../infra/http/apiClient";
import { useRemoveStudent } from "../../alunos/hooks/useRemoveStudent";
import { useSeries } from "../hooks/useSeries";
import { useEscolas } from "../hooks/useEscolas";
import { useTurmaDetalhe } from "../hooks/useTurmaDetalhe";
import type { ClassStudentWithProfile } from "../../../types/class";

const cardCls = "bg-white rounded-2xl border border-border-soft";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function DetalheSkeleton() {
  return (
    <div>
      <Skeleton className="h-16 w-full mb-8" />
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className={`${cardCls} p-12 text-center`}>
      <p className="text-muted text-sm">
        Não foi possível carregar esta turma agora. Tente recarregar a página em instantes.
      </p>
    </div>
  );
}

export function TurmaDetalheScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { turma, alunos, isPending, isError } = useTurmaDetalhe(id);
  const { data: escolas } = useEscolas();
  const { data: series } = useSeries();
  const removeStudent = useRemoveStudent(id as string);
  const [studentToRemove, setStudentToRemove] = useState<ClassStudentWithProfile | null>(null);

  const escola = escolas?.find((s) => s.id === turma?.schoolId);
  const serie = series?.find((g) => g.id === turma?.gradeId);

  const handleConfirmRemove = () => {
    if (!studentToRemove) return;
    removeStudent.mutate(studentToRemove.id, {
      onSuccess: () => setStudentToRemove(null),
    });
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <BackBtn onClick={() => navigate("/turmas")} label="Turmas" />

        {isPending ? (
          <DetalheSkeleton />
        ) : isError || !turma ? (
          <ErrorState />
        ) : (
          <>
            <div className="flex items-start justify-between mb-8 gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F5F0] flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-7 h-7 text-brand" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-ink font-heading">{turma.name}</h1>
                  <p className="text-muted text-sm mt-0.5">
                    {[serie?.name, escola?.name].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-sm font-bold text-brand mt-1">
                    {alunos?.length ?? 0} aluno{alunos?.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/turmas/${turma.id}/alunos/novo`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-brand/20 flex-shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                Adicionar aluno
              </button>
            </div>

            <h2 className="text-base font-bold text-ink mb-4 font-heading">Alunos</h2>

            {!alunos || alunos.length === 0 ? (
              <div className={`${cardCls} p-12 text-center`}>
                <Users className="w-10 h-10 text-border-input mx-auto mb-3" />
                <p className="text-muted text-sm">Nenhum aluno nesta turma.</p>
                <button
                  type="button"
                  onClick={() => navigate(`/turmas/${turma.id}/alunos/novo`)}
                  className="mt-4 text-sm text-brand font-bold hover:underline"
                >
                  Adicionar primeiro aluno
                </button>
              </div>
            ) : (
              <div className={`${cardCls} overflow-hidden`}>
                {alunos.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      index < alunos.length - 1 ? "border-b border-border-soft" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E8F5F0] flex items-center justify-center text-brand text-xs font-bold flex-shrink-0">
                      {initials(student.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-ink">{student.name}</p>
                      <p className="text-xs text-muted mt-0.5">{student.email}</p>
                    </div>
                    {student.learningProfile ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand max-w-[220px] truncate">
                        {student.learningProfile.name}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                        Sem perfil definido
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate(`/turmas/${turma.id}/alunos/${student.id}/editar`)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentToRemove(student)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={studentToRemove !== null}
        title="Remover aluno da turma?"
        description={`${studentToRemove?.name ?? "Este aluno"} será removido de "${turma?.name ?? "esta turma"}". Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        confirmingLabel="Removendo..."
        isConfirming={removeStudent.isPending}
        errorMessage={removeStudent.isError ? getApiErrorMessage(removeStudent.error) : null}
        onConfirm={handleConfirmRemove}
        onCancel={() => setStudentToRemove(null)}
      />
    </AppLayout>
  );
}
