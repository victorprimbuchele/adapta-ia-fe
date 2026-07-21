import React, { useState } from "react";
import {
  Brain, LayoutDashboard, Users, FileText, Plus, LogOut,
  ChevronRight, Send, CheckCircle, Mail, ArrowLeft,
  Sparkles, Clock, UserPlus, Loader2, Volume2, List,
  ZoomIn, CheckCheck, GraduationCap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

type Screen =
  | "login" | "register" | "dashboard"
  | "turmas" | "turma-nova" | "turma-detalhe"
  | "aluno-novo" | "atividade-nova" | "atividade-revisao" | "atividade-sucesso";

type DifficultyProfile = 1 | 2 | 3;

interface Student {
  id: string; name: string; email: string;
  profile: DifficultyProfile; turmaId: string;
}

interface Turma {
  id: string; name: string; serie: string; escola: string;
}

interface Activity {
  id: string; title: string; disciplina: string;
  turmaId: string; createdAt: string;
  status: "enviada" | "rascunho"; sentTo: number;
}

interface ActivityDraft {
  title: string; disciplina: string; turmaId: string;
  content: string; questions: string;
}

// ─── Mock Data ───────────────────────────────────────────────

const INIT_TURMAS: Turma[] = [
  { id: "1", name: "6º Ano A", serie: "6º Ano", escola: "E.M. Santos Dumont" },
  { id: "2", name: "7º Ano B", serie: "7º Ano", escola: "E.M. Santos Dumont" },
  { id: "3", name: "8º Ano C", serie: "8º Ano", escola: "E.E. Monteiro Lobato" },
];

const INIT_STUDENTS: Student[] = [
  { id: "s1", name: "Lucas Mendes", email: "lucas@escola.edu.br", profile: 1, turmaId: "1" },
  { id: "s2", name: "Ana Paula Souza", email: "ana@escola.edu.br", profile: 2, turmaId: "1" },
  { id: "s3", name: "Rafael Costa", email: "rafael@escola.edu.br", profile: 3, turmaId: "1" },
  { id: "s4", name: "Beatriz Lima", email: "beatriz@escola.edu.br", profile: 1, turmaId: "2" },
  { id: "s5", name: "Marcos Oliveira", email: "marcos@escola.edu.br", profile: 2, turmaId: "2" },
  { id: "s6", name: "Isabela Ferreira", email: "isabela@escola.edu.br", profile: 3, turmaId: "3" },
];

const INIT_ACTIVITIES: Activity[] = [
  { id: "a1", title: "Interpretação: A Crise Hídrica", disciplina: "Língua Portuguesa", turmaId: "1", createdAt: "28 jun 2026", status: "enviada", sentTo: 3 },
  { id: "a2", title: "Frações e Números Decimais", disciplina: "Matemática", turmaId: "2", createdAt: "25 jun 2026", status: "enviada", sentTo: 2 },
  { id: "a3", title: "A Revolução Industrial", disciplina: "História", turmaId: "1", createdAt: "20 jun 2026", status: "rascunho", sentTo: 0 },
];

const DISCIPLINAS = [
  "Língua Portuguesa", "Matemática", "Ciências",
  "História", "Geografia", "Arte", "Inglês", "Educação Física",
];

const SERIES = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "6º Ano", "7º Ano", "8º Ano", "9º Ano",
  "1º EM", "2º EM", "3º EM",
];

const PROFILES: Record<DifficultyProfile, {
  label: string; fullDesc: string;
  Icon: React.FC<{ className?: string }>;
  tagClass: string; headerBg: string;
}> = {
  1: {
    label: "Perfil 1",
    fullDesc: "Texto simplificado + glossário + áudio (TTS)",
    Icon: Volume2,
    tagClass: "bg-blue-50 text-blue-700 border border-blue-200",
    headerBg: "bg-blue-600",
  },
  2: {
    label: "Perfil 2",
    fullDesc: "Fragmentação em microtarefas + estrutura visual",
    Icon: List,
    tagClass: "bg-violet-50 text-violet-700 border border-violet-200",
    headerBg: "bg-violet-600",
  },
  3: {
    label: "Perfil 3",
    fullDesc: "Alto contraste + fonte grande + leitor de tela",
    Icon: ZoomIn,
    tagClass: "bg-amber-50 text-amber-700 border border-amber-200",
    headerBg: "bg-amber-600",
  },
};

// ─── Shared atoms ────────────────────────────────────────────

const inputCls = "w-full px-4 py-3 rounded-xl border border-[#D4E4DE] bg-[#F4F8F6] text-[#1A2D27] text-sm placeholder:text-[#A0B5AF] focus:outline-none focus:ring-2 focus:ring-[#1A6E54]/20 focus:border-[#1A6E54] transition-all";
const labelCls = "block text-sm font-semibold text-[#1A2D27] mb-1.5";
const cardCls = "bg-white rounded-2xl border border-[#E0ECE8]";

function ProfileBadge({ profile }: { profile: DifficultyProfile }) {
  const p = PROFILES[profile];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${p.tagClass}`}>
      <p.Icon className="w-3 h-3" />
      {p.label}
    </span>
  );
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
      status === "enviada"
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-slate-100 text-slate-500 border border-slate-200"
    }`}>
      {status === "enviada" ? <CheckCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {status === "enviada" ? "Enviada" : "Rascunho"}
    </span>
  );
}

function BackBtn({ onClick, label = "Voltar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[#6B8279] text-sm mb-6 hover:text-[#1A6E54] transition-colors font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}

// ─── Login ───────────────────────────────────────────────────

function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("prof.carlos@escola.edu.br");
  const [password, setPassword] = useState("minhasenha123");

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1100);
  };

  return (
    <div className="min-h-screen flex font-[Nunito,sans-serif]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-[#0D4030] via-[#1A6E54] to-[#1A5480] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-[Plus_Jakarta_Sans,sans-serif]">Adapta.ia</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-8 font-[Plus_Jakarta_Sans,sans-serif]">
            Atividades adaptadas para cada aluno, sem esforço extra.
          </h1>
          <div className="space-y-4">
            {[
              "A IA gera versões personalizadas por perfil de aprendizagem",
              "Envio automático em PDF por e-mail para cada aluno",
              "Interface simples como o WhatsApp — curva zero",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6EE7B7] flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-xs">© 2026 Adapta.ia — Educação inclusiva para todos</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F4F8F6]">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Brain className="w-7 h-7 text-[#1A6E54]" />
            <span className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">Adapta.ia</span>
          </div>

          <div className={`${cardCls} p-8 shadow-sm`}>
            <h2 className="text-2xl font-bold text-[#1A2D27] mb-1 font-[Plus_Jakarta_Sans,sans-serif]">Entrar</h2>
            <p className="text-[#6B8279] text-sm mb-7">Acesse sua conta de professor</p>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-[#1A2D27]">Senha</label>
                  <button className="text-xs text-[#1A6E54] hover:underline font-medium">Esqueci minha senha</button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1A6E54] hover:bg-[#155A43] active:bg-[#114A38] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-[#1A6E54]/20 mt-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Entrando..." : "Entrar na plataforma"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E8F0ED] text-center">
              <span className="text-[#6B8279] text-sm">Ainda não tem conta? </span>
              <button onClick={onRegister} className="text-[#1A6E54] font-bold text-sm hover:underline">
                Cadastre-se gratuitamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Register ────────────────────────────────────────────────

function RegisterScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", escola: "", password: "", confirm: "" });
  const up = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F8F6] font-[Nunito,sans-serif]">
      <div className="w-full max-w-[480px]">
        <div className="flex items-center gap-2.5 mb-8">
          <Brain className="w-7 h-7 text-[#1A6E54]" />
          <span className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">Adapta.ia</span>
        </div>

        <div className={`${cardCls} p-8 shadow-sm`}>
          <BackBtn onClick={onBack} />
          <h2 className="text-2xl font-bold text-[#1A2D27] mb-1 font-[Plus_Jakarta_Sans,sans-serif]">Criar conta</h2>
          <p className="text-[#6B8279] text-sm mb-7">Cadastre-se como professor</p>

          <div className="space-y-4">
            {[
              { key: "name", label: "Nome completo", type: "text", ph: "Prof. Maria da Silva" },
              { key: "email", label: "E-mail institucional", type: "email", ph: "maria@escola.edu.br" },
              { key: "escola", label: "Escola", type: "text", ph: "E.M. Santos Dumont" },
              { key: "password", label: "Senha", type: "password", ph: "Mínimo 8 caracteres" },
              { key: "confirm", label: "Confirmar senha", type: "password", ph: "Repita a senha" },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={(form as Record<string, string>)[key]}
                  onChange={up(key)}
                  className={inputCls}
                />
              </div>
            ))}
            <button
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1200); }}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1A6E54] hover:bg-[#155A43] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-[#1A6E54]/20 mt-1"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Criando conta..." : "Criar minha conta"}
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-[#E8F0ED] text-center">
            <span className="text-[#6B8279] text-sm">Já tem conta? </span>
            <button onClick={onBack} className="text-[#1A6E54] font-bold text-sm hover:underline">Entrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────

function Sidebar({
  screen, onNavigate, onLogout,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}) {
  const items = [
    { label: "Dashboard", Icon: LayoutDashboard, target: "dashboard" as Screen, group: ["dashboard"] },
    { label: "Turmas", Icon: Users, target: "turmas" as Screen, group: ["turmas", "turma-nova", "turma-detalhe", "aluno-novo"] },
    { label: "Nova Atividade", Icon: Plus, target: "atividade-nova" as Screen, group: ["atividade-nova", "atividade-revisao", "atividade-sucesso"] },
  ];

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#101F1A] flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1A6E54] flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white font-[Plus_Jakarta_Sans,sans-serif]">Adapta.ia</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 pt-4">
        {items.map(({ label, Icon, target, group }) => {
          const active = group.includes(screen);
          return (
            <button
              key={label}
              onClick={() => onNavigate(target)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-[#1A6E54] text-white shadow-sm"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="px-3 py-2.5 mb-1 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1A6E54] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            CS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Prof. Carlos Silva</p>
            <p className="text-xs text-white/35 truncate">E.M. Santos Dumont</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard ───────────────────────────────────────────────

function DashboardScreen({
  turmas, students, activities, onNavigate,
}: {
  turmas: Turma[]; students: Student[]; activities: Activity[];
  onNavigate: (s: Screen, turmaId?: string) => void;
}) {
  const sent = activities.filter(a => a.status === "enviada");
  const recent = [...activities].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">
            Olá, Prof. Carlos! 👋
          </h1>
          <p className="text-[#6B8279] text-sm mt-1">Terça-feira, 1 de julho de 2026</p>
        </div>
        <button
          onClick={() => onNavigate("atividade-nova")}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1A6E54] hover:bg-[#155A43] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#1A6E54]/20"
        >
          <Plus className="w-4 h-4" />
          Nova Atividade
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Turmas ativas", value: turmas.length, sub: "3 escolas cadastradas", color: "text-[#1A6E54]", bg: "bg-[#E8F5F0]" },
          { label: "Alunos cadastrados", value: students.length, sub: "com perfil configurado", color: "text-[#2463A8]", bg: "bg-blue-50" },
          { label: "Atividades enviadas", value: sent.length, sub: `${activities.length} atividades no total`, color: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className={`${cardCls} p-5`}>
            <p className="text-xs font-bold text-[#6B8279] uppercase tracking-wide mb-2">{label}</p>
            <p className={`text-4xl font-bold ${color} mb-1 font-[Plus_Jakarta_Sans,sans-serif]`}>{value}</p>
            <p className="text-xs text-[#6B8279]">{sub}</p>
            <div className={`w-8 h-1.5 rounded-full ${bg} mt-3`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Recent activities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">
              Atividades recentes
            </h2>
            <button
              onClick={() => onNavigate("atividade-nova")}
              className="text-xs text-[#1A6E54] font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />Criar nova
            </button>
          </div>
          <div className="space-y-3">
            {recent.map(a => {
              const turma = turmas.find(t => t.id === a.turmaId);
              return (
                <div
                  key={a.id}
                  className={`${cardCls} p-4 flex items-center gap-4 hover:border-[#1A6E54]/25 hover:shadow-sm transition-all cursor-pointer`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#1A6E54]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1A2D27] truncate">{a.title}</p>
                    <p className="text-xs text-[#6B8279] mt-0.5">
                      {a.disciplina} · {turma?.name} · {a.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={a.status} />
                    {a.status === "enviada" && (
                      <span className="text-xs text-[#6B8279] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {a.sentTo}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Turmas quick access */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">
              Turmas
            </h2>
            <button onClick={() => onNavigate("turmas")} className="text-xs text-[#1A6E54] font-bold hover:underline">
              Ver todas
            </button>
          </div>
          <div className="space-y-2.5">
            {turmas.map(t => {
              const count = students.filter(s => s.turmaId === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => onNavigate("turma-detalhe", t.id)}
                  className={`${cardCls} w-full p-4 text-left hover:border-[#1A6E54]/30 hover:bg-[#FAFDFB] transition-all group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#1A2D27]">{t.name}</p>
                      <p className="text-xs text-[#6B8279] mt-0.5">
                        {count} aluno{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5D8D2] group-hover:text-[#1A6E54] transition-colors" />
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => onNavigate("turma-nova")}
              className="w-full rounded-2xl border-2 border-dashed border-[#D4E4DE] p-4 text-[#6B8279] hover:border-[#1A6E54]/40 hover:text-[#1A6E54] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Nova turma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Turmas List ─────────────────────────────────────────────

function TurmasScreen({
  turmas, students, onNavigate,
}: {
  turmas: Turma[]; students: Student[];
  onNavigate: (s: Screen, turmaId?: string) => void;
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">Turmas</h1>
          <p className="text-[#6B8279] text-sm mt-1">
            {turmas.length} turma{turmas.length !== 1 ? "s" : ""} cadastrada{turmas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => onNavigate("turma-nova")}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1A6E54] hover:bg-[#155A43] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#1A6E54]/20"
        >
          <Plus className="w-4 h-4" />
          Nova turma
        </button>
      </div>

      <div className="space-y-4">
        {turmas.map(t => {
          const ts = students.filter(s => s.turmaId === t.id);
          const profileCounts = ([1, 2, 3] as DifficultyProfile[]).map(p => ({
            p, count: ts.filter(s => s.profile === p).length,
          }));

          return (
            <div key={t.id} className={`${cardCls} p-5 hover:border-[#1A6E54]/25 hover:shadow-sm transition-all`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F5F0] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-[#1A6E54]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2D27] text-base font-[Plus_Jakarta_Sans,sans-serif]">{t.name}</h3>
                    <p className="text-sm text-[#6B8279] mt-0.5">{t.serie} · {t.escola}</p>
                    <div className="flex items-center gap-2.5 mt-3">
                      <span className="text-xs text-[#6B8279]">
                        <span className="font-bold text-[#1A2D27]">{ts.length}</span>{" "}
                        aluno{ts.length !== 1 ? "s" : ""}
                      </span>
                      {profileCounts.filter(pc => pc.count > 0).map(({ p, count }) => (
                        <span key={p} className={`text-xs font-bold px-2 py-0.5 rounded-full ${PROFILES[p].tagClass}`}>
                          {count}× P{p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onNavigate("aluno-novo", t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1A6E54] border border-[#1A6E54]/25 rounded-lg hover:bg-[#E8F5F0] transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Adicionar aluno
                  </button>
                  <button
                    onClick={() => onNavigate("turma-detalhe", t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1A6E54] rounded-lg hover:bg-[#155A43] transition-colors"
                  >
                    Detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Turma Nova ──────────────────────────────────────────────

function TurmaNovaScreen({ onSave, onBack }: {
  onSave: (t: Omit<Turma, "id">) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({ name: "", serie: "", escola: "" });
  const up = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));
  const valid = form.name && form.serie && form.escola;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <BackBtn onClick={onBack} label="Turmas" />
      <h1 className="text-2xl font-bold text-[#1A2D27] mb-1 font-[Plus_Jakarta_Sans,sans-serif]">Nova turma</h1>
      <p className="text-[#6B8279] text-sm mb-8">Preencha os dados para criar a turma</p>

      <div className={`${cardCls} p-6 space-y-5`}>
        <div>
          <label className={labelCls}>Nome da turma</label>
          <input value={form.name} onChange={up("name")} placeholder="Ex: 6º Ano A" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Série</label>
          <select value={form.serie} onChange={up("serie")} className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Selecione a série</option>
            {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Escola</label>
          <input value={form.escola} onChange={up("escola")} placeholder="Nome da escola" className={inputCls} />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-[#D4E4DE] text-[#1A2D27] text-sm font-bold hover:bg-[#F4F8F6] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (valid) onSave(form); }}
            disabled={!valid}
            className="flex-1 py-3 rounded-xl bg-[#1A6E54] text-white text-sm font-bold hover:bg-[#155A43] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar turma
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Turma Detalhe ───────────────────────────────────────────

function TurmaDetalheScreen({
  turma, students, onNavigate, onAddAluno,
}: {
  turma?: Turma; students: Student[];
  onNavigate: (s: Screen, turmaId?: string) => void;
  onAddAluno: () => void;
}) {
  if (!turma) return null;
  const ts = students.filter(s => s.turmaId === turma.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <BackBtn onClick={() => onNavigate("turmas")} label="Turmas" />

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5F0] flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-[#1A6E54]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">{turma.name}</h1>
            <p className="text-[#6B8279] text-sm mt-0.5">{turma.serie} · {turma.escola}</p>
            <p className="text-sm font-bold text-[#1A6E54] mt-1">
              {ts.length} aluno{ts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={onAddAluno}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1A6E54] hover:bg-[#155A43] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#1A6E54]/20"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar aluno
        </button>
      </div>

      <h2 className="text-base font-bold text-[#1A2D27] mb-4 font-[Plus_Jakarta_Sans,sans-serif]">Alunos</h2>

      {ts.length === 0 ? (
        <div className={`${cardCls} p-12 text-center`}>
          <Users className="w-10 h-10 text-[#C5D8D2] mx-auto mb-3" />
          <p className="text-[#6B8279] text-sm">Nenhum aluno nesta turma.</p>
          <button onClick={onAddAluno} className="mt-4 text-sm text-[#1A6E54] font-bold hover:underline">
            Adicionar primeiro aluno
          </button>
        </div>
      ) : (
        <div className={`${cardCls} overflow-hidden`}>
          {ts.map((student, i) => (
            <div
              key={student.id}
              className={`flex items-center gap-4 px-5 py-4 ${i < ts.length - 1 ? "border-b border-[#EEF4F2]" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#1A6E54] text-xs font-bold flex-shrink-0">
                {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1A2D27]">{student.name}</p>
                <p className="text-xs text-[#6B8279] mt-0.5">{student.email}</p>
              </div>
              <ProfileBadge profile={student.profile} />
              <p className="text-xs text-[#6B8279] hidden lg:block max-w-[180px] truncate">
                {PROFILES[student.profile].fullDesc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Aluno Novo ──────────────────────────────────────────────

function AlunoNovoScreen({
  turmas, defaultTurmaId, onSave, onBack,
}: {
  turmas: Turma[]; defaultTurmaId: string;
  onSave: (s: Omit<Student, "id">) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    name: "", email: "", profile: 1 as DifficultyProfile, turmaId: defaultTurmaId,
  });
  const upText = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));
  const valid = form.name && form.email && form.turmaId;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <BackBtn onClick={onBack} />
      <h1 className="text-2xl font-bold text-[#1A2D27] mb-1 font-[Plus_Jakarta_Sans,sans-serif]">Cadastrar aluno</h1>
      <p className="text-[#6B8279] text-sm mb-8">Configure o perfil de aprendizagem para personalizar as atividades</p>

      <div className={`${cardCls} p-6 space-y-5`}>
        <div>
          <label className={labelCls}>Nome completo</label>
          <input value={form.name} onChange={upText("name")} placeholder="Nome do aluno" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>E-mail</label>
          <input type="email" value={form.email} onChange={upText("email")} placeholder="aluno@escola.edu.br" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Turma</label>
          <select value={form.turmaId} onChange={upText("turmaId")} className={`${inputCls} appearance-none cursor-pointer`}>
            {turmas.map(t => <option key={t.id} value={t.id}>{t.name} — {t.escola}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Perfil de aprendizagem</label>
          <div className="space-y-3 mt-1">
            {([1, 2, 3] as DifficultyProfile[]).map(p => {
              const prof = PROFILES[p];
              const active = form.profile === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, profile: p }))}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    active ? "border-[#1A6E54] bg-[#F0FAF6]" : "border-[#E0ECE8] hover:border-[#1A6E54]/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "bg-[#1A6E54]" : "bg-[#E8F0ED]"
                    }`}>
                      <prof.Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#6B8279]"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#1A2D27]">{prof.label}</p>
                      <p className="text-xs text-[#6B8279] mt-0.5 leading-relaxed">{prof.fullDesc}</p>
                    </div>
                    {active && <CheckCircle className="w-5 h-5 text-[#1A6E54] flex-shrink-0 mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-[#D4E4DE] text-[#1A2D27] text-sm font-bold hover:bg-[#F4F8F6] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (valid) onSave(form); }}
            disabled={!valid}
            className="flex-1 py-3 rounded-xl bg-[#1A6E54] text-white text-sm font-bold hover:bg-[#155A43] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cadastrar aluno
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Atividade Nova ──────────────────────────────────────────

function AtividadeNovaScreen({
  turmas, onGenerate, onBack,
}: {
  turmas: Turma[];
  onGenerate: (d: ActivityDraft) => void;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState<ActivityDraft>({
    title: "Sistema Solar: Planetas e Movimentos",
    disciplina: "Ciências",
    turmaId: "1",
    content:
      "O Sistema Solar é formado pelo Sol e por oito planetas que giram ao seu redor: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Cada planeta possui características únicas — tamanho, composição, distância do Sol e presença ou não de satélites naturais. A Terra é o único planeta com vida conhecida. O movimento de revolução é o que cada planeta faz ao redor do Sol, determinando o que chamamos de ano. Já o movimento de rotação é o giro do planeta sobre si mesmo, determinando o dia e a noite.",
    questions:
      "1. Quais são os oito planetas do Sistema Solar? Liste-os em ordem de distância do Sol.\n2. Qual é a diferença entre movimento de revolução e movimento de rotação?\n3. Por que a Terra é considerada especial em relação aos outros planetas?",
  });
  const up = (f: keyof ActivityDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));
  const valid = form.title && form.disciplina && form.turmaId && form.content && form.questions;

  const handleGenerate = () => {
    if (!valid) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); onGenerate(form); }, 2200);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <BackBtn onClick={onBack} />
      <h1 className="text-2xl font-bold text-[#1A2D27] mb-1 font-[Plus_Jakarta_Sans,sans-serif]">Nova atividade</h1>
      <p className="text-[#6B8279] text-sm mb-8">
        Preencha o conteúdo e a IA gera versões adaptadas para cada perfil automaticamente
      </p>

      <div className="space-y-4">
        {/* Info */}
        <div className={`${cardCls} p-6 space-y-4`}>
          <p className="text-xs font-bold text-[#6B8279] uppercase tracking-widest">Identificação</p>
          <div>
            <label className={labelCls}>Título da atividade</label>
            <input value={form.title} onChange={up("title")} placeholder="Ex: Interpretação — Capítulo 3" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Disciplina</label>
              <select value={form.disciplina} onChange={up("disciplina")} className={`${inputCls} appearance-none cursor-pointer`}>
                {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Turma destinatária</label>
              <select value={form.turmaId} onChange={up("turmaId")} className={`${inputCls} appearance-none cursor-pointer`}>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${cardCls} p-6 space-y-4`}>
          <p className="text-xs font-bold text-[#6B8279] uppercase tracking-widest">Conteúdo</p>
          <div>
            <label className={labelCls}>Texto principal</label>
            <textarea
              value={form.content}
              onChange={up("content")}
              rows={5}
              placeholder="Cole ou escreva o texto da atividade..."
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>
          <div>
            <label className={labelCls}>Questões</label>
            <textarea
              value={form.questions}
              onChange={up("questions")}
              rows={4}
              placeholder="Escreva as questões numeradas..."
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={!valid || generating}
          className="w-full py-4 rounded-xl bg-[#1A6E54] hover:bg-[#155A43] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#1A6E54]/25"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              A IA está gerando as versões adaptadas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar versões adaptadas com IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Atividade Revisao ───────────────────────────────────────

const ADAPTED_CONTENT: Record<DifficultyProfile, { title: string; lines: string[]; extras: string[] }> = {
  1: {
    title: "Versão Simplificada + Glossário + Áudio",
    lines: [
      "O Sistema Solar tem o Sol no centro. Ao redor dele giram 8 planetas.",
      "Ordem dos planetas: Mercúrio → Vênus → Terra → Marte → Júpiter → Saturno → Urano → Netuno.",
      "A Terra é especial: é o único planeta com vida.",
      "📘 Glossário: Revolução = volta ao Sol (= 1 ano). Rotação = giro próprio (= 1 dia).",
    ],
    extras: ["🔊 Áudio TTS gerado (narração completa)", "📖 Glossário com 6 termos", "🔑 Palavras-chave em negrito"],
  },
  2: {
    title: "Versão em Microtarefas + Estrutura Visual",
    lines: [
      "☐  Tarefa 1 — Leia o texto sobre o Sistema Solar",
      "☐  Tarefa 2 — Anote os 8 planetas em ordem",
      "☐  Tarefa 3 — Entenda: revolução = 1 ano",
      "☐  Tarefa 4 — Entenda: rotação = 1 dia",
      "☐  Tarefa 5 — Responda as 3 questões",
    ],
    extras: ["📊 Mapa visual dos planetas incluso", "🎯 Progresso marcável em cada tarefa", "🎨 Seções com cores distintas"],
  },
  3: {
    title: "Versão Acessível — Alto Contraste + Fonte Grande",
    lines: [
      "SISTEMA SOLAR",
      "8 planetas giram ao redor do Sol.",
      "REVOLUÇÃO → caminho ao redor do Sol = 1 ANO",
      "ROTAÇÃO → giro sobre si mesmo = 1 DIA",
      "Só a Terra tem vida conhecida.",
    ],
    extras: ["🔡 Fonte 20pt — leitura facilitada", "♿ Tags ARIA para leitores de tela", "🎨 Contraste ≥ 7:1 (WCAG AAA)"],
  },
};

function AtividadeRevisaoScreen({
  draft, turmas, students, onSend, onBack,
}: {
  draft: ActivityDraft; turmas: Turma[]; students: Student[];
  onSend: (count: number) => void;
  onBack: () => void;
}) {
  const [sending, setSending] = useState(false);
  const turma = turmas.find(t => t.id === draft.turmaId);
  const ts = students.filter(s => s.turmaId === draft.turmaId);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); onSend(ts.length); }, 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackBtn onClick={onBack} label="Editar atividade" />

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A6E54] bg-[#E8F5F0] px-3 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Versões geradas pela IA
          </div>
          <h1 className="text-2xl font-bold text-[#1A2D27] font-[Plus_Jakarta_Sans,sans-serif]">{draft.title}</h1>
          <p className="text-[#6B8279] text-sm mt-1">
            {draft.disciplina} · {turma?.name} · {ts.length} aluno{ts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Profile previews */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {([1, 2, 3] as DifficultyProfile[]).map(p => {
          const prof = PROFILES[p];
          const version = ADAPTED_CONTENT[p];
          const profileStudents = ts.filter(s => s.profile === p);

          return (
            <div key={p} className="bg-white rounded-2xl border border-[#E0ECE8] overflow-hidden flex flex-col">
              <div className={`${prof.headerBg} px-4 py-3 flex items-center gap-2`}>
                <prof.Icon className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white flex-1">{prof.label}</span>
                <span className="text-xs text-white/65">
                  {profileStudents.length} aluno{profileStudents.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-4 flex-1">
                <p className="text-[10px] font-bold text-[#6B8279] uppercase tracking-widest mb-3">{version.title}</p>
                <div className="space-y-2 mb-4">
                  {version.lines.map((line, i) => (
                    <p key={i} className={`text-xs text-[#1A2D27] leading-relaxed ${p === 3 ? "font-bold" : ""}`}>
                      {line}
                    </p>
                  ))}
                </div>
                <div className="border-t border-[#EEF4F2] pt-3 space-y-1.5">
                  {version.extras.map((e, i) => (
                    <p key={i} className="text-[11px] text-[#6B8279]">{e}</p>
                  ))}
                </div>
              </div>

              {profileStudents.length > 0 && (
                <div className="px-4 pb-4 border-t border-[#EEF4F2] pt-3">
                  <p className="text-[10px] font-bold text-[#6B8279] uppercase tracking-widest mb-2">Destinatários</p>
                  <div className="space-y-1.5">
                    {profileStudents.map(s => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#1A6E54] text-[10px] font-bold flex-shrink-0">
                          {s.name[0]}
                        </div>
                        <p className="text-xs text-[#1A2D27] font-medium truncate">{s.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Send bar */}
      <div className={`${cardCls} p-5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#1A6E54]" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#1A2D27]">Tudo pronto para enviar</p>
            <p className="text-xs text-[#6B8279] mt-0.5">
              {ts.length} aluno{ts.length !== 1 ? "s" : ""} receber{ts.length !== 1 ? "ão" : "á"} a versão adaptada em PDF por e-mail
            </p>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={sending || ts.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-[#1A6E54] hover:bg-[#155A43] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-md shadow-[#1A6E54]/25"
        >
          {sending ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
          ) : (
            <><Send className="w-4 h-4" />Confirmar e enviar</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Atividade Sucesso ───────────────────────────────────────

function AtividadeSucessoScreen({
  sentCount, onDashboard, onNova,
}: {
  sentCount: number; onDashboard: () => void; onNova: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="text-center max-w-sm">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-[#E8F5F0] animate-ping opacity-30" />
          <div className="relative w-24 h-24 rounded-full bg-[#E8F5F0] flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#1A6E54]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#1A2D27] mb-3 font-[Plus_Jakarta_Sans,sans-serif]">
          Atividade enviada!
        </h1>
        <p className="text-[#6B8279] mb-2 text-base">
          Versões adaptadas enviadas com sucesso para{" "}
          <span className="font-bold text-[#1A6E54]">{sentCount} aluno{sentCount !== 1 ? "s" : ""}</span>.
        </p>
        <p className="text-sm text-[#6B8279] mb-10 leading-relaxed">
          Cada aluno recebeu a versão correspondente ao seu perfil de aprendizagem em PDF por e-mail.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onDashboard}
            className="px-5 py-3 rounded-xl border border-[#D4E4DE] text-[#1A2D27] text-sm font-bold hover:bg-white transition-colors"
          >
            Ir para o Dashboard
          </button>
          <button
            onClick={onNova}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A6E54] hover:bg-[#155A43] text-white text-sm font-bold transition-colors shadow-md shadow-[#1A6E54]/20"
          >
            <Plus className="w-4 h-4" />
            Nova atividade
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>(INIT_TURMAS);
  const [students, setStudents] = useState<Student[]>(INIT_STUDENTS);
  const [activities, setActivities] = useState<Activity[]>(INIT_ACTIVITIES);
  const [selectedTurmaId, setSelectedTurmaId] = useState("1");
  const [activityDraft, setActivityDraft] = useState<ActivityDraft | null>(null);
  const [lastSentCount, setLastSentCount] = useState(0);

  const navigate = (s: Screen, turmaId?: string) => {
    if (turmaId) setSelectedTurmaId(turmaId);
    setScreen(s);
  };

  const handleLogin = () => { setIsLoggedIn(true); setScreen("dashboard"); };
  const handleLogout = () => { setIsLoggedIn(false); setScreen("login"); };

  const handleAddTurma = (t: Omit<Turma, "id">) => {
    setTurmas(prev => [...prev, { ...t, id: Date.now().toString() }]);
    navigate("turmas");
  };

  const handleAddStudent = (s: Omit<Student, "id">) => {
    setStudents(prev => [...prev, { ...s, id: Date.now().toString() }]);
    navigate("turma-detalhe", s.turmaId);
  };

  const handleGenerate = (draft: ActivityDraft) => {
    setActivityDraft(draft);
    navigate("atividade-revisao");
  };

  const handleSend = (count: number) => {
    if (activityDraft) {
      setActivities(prev => [{
        id: Date.now().toString(),
        title: activityDraft.title,
        disciplina: activityDraft.disciplina,
        turmaId: activityDraft.turmaId,
        createdAt: "1 jul 2026",
        status: "enviada",
        sentTo: count,
      }, ...prev]);
    }
    setLastSentCount(count);
    navigate("atividade-sucesso");
  };

  if (!isLoggedIn) {
    return screen === "register"
      ? <RegisterScreen onLogin={handleLogin} onBack={() => setScreen("login")} />
      : <LoginScreen onLogin={handleLogin} onRegister={() => setScreen("register")} />;
  }

  return (
    <div className="flex h-screen bg-[#F4F8F6] overflow-hidden font-[Nunito,sans-serif]">
      <Sidebar screen={screen} onNavigate={navigate} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {screen === "dashboard" && (
          <DashboardScreen turmas={turmas} students={students} activities={activities} onNavigate={navigate} />
        )}
        {screen === "turmas" && (
          <TurmasScreen turmas={turmas} students={students} onNavigate={navigate} />
        )}
        {screen === "turma-nova" && (
          <TurmaNovaScreen onSave={handleAddTurma} onBack={() => navigate("turmas")} />
        )}
        {screen === "turma-detalhe" && (
          <TurmaDetalheScreen
            turma={turmas.find(t => t.id === selectedTurmaId)}
            students={students}
            onNavigate={navigate}
            onAddAluno={() => navigate("aluno-novo", selectedTurmaId)}
          />
        )}
        {screen === "aluno-novo" && (
          <AlunoNovoScreen
            turmas={turmas}
            defaultTurmaId={selectedTurmaId}
            onSave={handleAddStudent}
            onBack={() => navigate("turma-detalhe", selectedTurmaId)}
          />
        )}
        {screen === "atividade-nova" && (
          <AtividadeNovaScreen
            turmas={turmas}
            onGenerate={handleGenerate}
            onBack={() => navigate("dashboard")}
          />
        )}
        {screen === "atividade-revisao" && activityDraft && (
          <AtividadeRevisaoScreen
            draft={activityDraft}
            turmas={turmas}
            students={students}
            onSend={handleSend}
            onBack={() => navigate("atividade-nova")}
          />
        )}
        {screen === "atividade-sucesso" && (
          <AtividadeSucessoScreen
            sentCount={lastSentCount}
            onDashboard={() => navigate("dashboard")}
            onNova={() => navigate("atividade-nova")}
          />
        )}
      </main>
    </div>
  );
}
