import { ChevronRight, FileText, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { cardBaseClass as cardCls } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAuthStore } from "../../../store/authStore";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import type { DashboardSummary } from "../hooks/useDashboardSummary";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" });

function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

function StatsCards({ summary }: { summary: DashboardSummary }) {
  const stats = [
    {
      key: "classes",
      label: "Turmas ativas",
      value: summary.classesCount,
      color: "text-brand",
      bg: "bg-brand-soft",
    },
    {
      key: "students",
      label: "Alunos cadastrados",
      value: summary.studentsCount,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      key: "homeworks",
      label: "Atividades enviadas",
      value: summary.homeworksSentCount,
      sub: `${summary.homeworksCount} atividade${summary.homeworksCount === 1 ? "" : "s"} no total`,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map(({ key, label, value, sub, color, bg }) => (
        <div key={key} className={`${cardCls} p-5`}>
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">{label}</p>
          <p className={`text-4xl font-bold ${color} mb-1 font-heading`} data-testid={`stat-${key}`}>
            {value}
          </p>
          {sub ? <p className="text-xs text-muted">{sub}</p> : null}
          <div className={`w-8 h-1.5 rounded-full ${bg} mt-3`} />
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${cardCls} p-5`}>
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-9 w-14 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function RecentActivities({ activities }: { activities: DashboardSummary["recentActivities"] }) {
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <div className={`${cardCls} p-6 text-center`}>
        <p className="text-sm text-muted">Nenhuma atividade criada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <button
          key={activity.id}
          type="button"
          onClick={() => navigate(`/atividades/${activity.id}/revisao`)}
          className={`${cardCls} w-full p-4 flex items-center gap-4 text-left hover:border-brand/25 hover:shadow-sm transition-all`}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-ink truncate">{activity.title}</p>
            <p className="text-xs text-muted mt-0.5">
              {activity.className} · {formatDate(activity.createdAt)}
            </p>
          </div>
          <StatusBadge isDraft={activity.isDraft} />
        </button>
      ))}
    </div>
  );
}

function ClassesQuickAccess({ classes }: { classes: DashboardSummary["classes"] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2.5">
      {classes.map((classItem) => (
        <button
          key={classItem.id}
          type="button"
          onClick={() => navigate(`/turmas/${classItem.id}`)}
          className={`${cardCls} w-full p-4 text-left hover:border-brand/30 transition-all group`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-ink">{classItem.name}</p>
              <p className="text-xs text-muted mt-0.5">
                {classItem.studentCount} aluno{classItem.studentCount !== 1 ? "s" : ""}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-border-input group-hover:text-brand transition-colors" />
          </div>
        </button>
      ))}
      <button
        type="button"
        onClick={() => navigate("/turmas/nova")}
        className="w-full rounded-2xl border-2 border-dashed border-border-input p-4 text-muted hover:border-brand/40 hover:text-brand transition-all flex items-center justify-center gap-2 text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        Nova turma
      </button>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className={`${cardCls} p-10 text-center max-w-md mx-auto mt-8`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
        <Users className="w-7 h-7 text-brand" />
      </div>
      <h2 className="text-lg font-bold text-ink font-heading mb-1.5">Crie sua primeira turma</h2>
      <p className="text-sm text-muted mb-6">
        Cadastre uma turma para começar a matricular alunos e criar atividades adaptadas por IA.
      </p>
      <button
        type="button"
        onClick={() => navigate("/turmas/nova")}
        className="inline-flex items-center gap-2 px-5 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-brand/20"
      >
        <Plus className="w-4 h-4" />
        Criar turma
      </button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className={`${cardCls} p-10 text-center max-w-md mx-auto mt-8`}>
      <p className="text-sm text-muted">
        Não foi possível carregar o dashboard agora. Tente recarregar a página em instantes.
      </p>
    </div>
  );
}

export function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const { data: summary, isPending, isError } = useDashboardSummary();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] ?? "professor";

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink font-heading">Olá, {firstName}!</h1>
            <p className="text-muted text-sm mt-1">Bem-vindo(a) de volta ao Adapta.ia</p>
          </div>
          {summary && summary.classesCount > 0 ? (
            <button
              type="button"
              onClick={() => navigate("/atividades/nova")}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-brand/20 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nova Atividade
            </button>
          ) : null}
        </div>

        {isPending ? (
          <>
            <StatsSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </>
        ) : isError || !summary ? (
          <ErrorState />
        ) : summary.classesCount === 0 ? (
          <EmptyState />
        ) : (
          <>
            <StatsCards summary={summary} />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-ink font-heading">Atividades recentes</h2>
                </div>
                <RecentActivities activities={summary.recentActivities} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-ink font-heading">Turmas</h2>
                  <button
                    type="button"
                    onClick={() => navigate("/turmas")}
                    className="text-xs text-brand font-bold hover:underline"
                  >
                    Ver todas
                  </button>
                </div>
                <ClassesQuickAccess classes={summary.classes} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
