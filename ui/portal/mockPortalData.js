export const MOCK_ORGANIZATIONS = [
  { id: "org-1", name: "Movimentador Cloud", plan: "Coach+" },
  { id: "org-2", name: "Casa em Movimento", plan: "Crescimento" },
  { id: "org-3", name: "Laboratório de Hábitos", plan: "Inicial" },
];

export const MOCK_USER = {
  name: "Marcelo Silva",
  email: "marcelo@movimentador.app",
  avatar: null,
};

const ACTIVITY_STATUSES = {
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  RESETTING: "Reajustando",
  PLANNED: "Planejada",
};

const FOCUS_LEVELS = {
  BLOCKED: "Travado",
  HIGH: "Alto",
  MEDIUM: "Médio",
  LOW: "Baixo",
  NOTE: "Nota",
};

const NEXT_STEP_STATES = {
  DONE: "Feito",
  PARTLY_DONE: "Parcial",
  PLANNED: "Planejado",
  NEEDS_SUPPORT: "Precisa de apoio",
};

const WEEKLY_PLAN_STATUSES = {
  DONE: "Feito",
  IN_PROGRESS: "Em andamento",
  QUEUED: "Na fila",
  SKIPPED: "Pulado",
};

export const MOCK_ACTIVITIES = [
  {
    id: "act-1",
    name: "Semana 1 da caminhada",
    slug: "week-1-walk-reset",
    status: ACTIVITY_STATUSES.IN_PROGRESS,
    category: "Plano de caminhada",
    reportName: "Do sofá ao movimento - Semana 1",
    createdAt: "2026-03-01T00:00:00Z",
    startDate: "2026-03-03T00:00:00Z",
    endDate: "2026-03-16T00:00:00Z",
    findingsBySeverity: { blocked: 1, high: 2, medium: 3, low: 2, note: 2 },
    leetTags: [{ title: "Caminhada" }, { title: "Baixo atrito" }, { title: "Manhã" }],
  },
  {
    id: "act-2",
    name: "Rotina de energia da manhã",
    slug: "morning-energy-routine",
    status: ACTIVITY_STATUSES.RESETTING,
    category: "Reset de rotina",
    reportName: "Revisão da rotina de energia da manhã",
    createdAt: "2026-02-20T00:00:00Z",
    startDate: "2026-02-24T00:00:00Z",
    endDate: "2026-03-20T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 2, medium: 2, low: 3, note: 1 },
    leetTags: [{ title: "Energia" }, { title: "Acordar" }],
  },
  {
    id: "act-3",
    name: "Sequência de mobilidade pós-trabalho",
    slug: "after-work-mobility-streak",
    status: ACTIVITY_STATUSES.COMPLETED,
    category: "Plano de mobilidade",
    reportName: "Resumo da sequência de mobilidade pós-trabalho",
    createdAt: "2026-01-05T00:00:00Z",
    startDate: "2026-01-08T00:00:00Z",
    endDate: "2026-02-18T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 1, medium: 2, low: 2, note: 3 },
    leetTags: [{ title: "Mobilidade" }, { title: "Recuperação" }],
  },
  {
    id: "act-4",
    name: "Base de sono e passos",
    slug: "sleep-and-steps-setup",
    status: ACTIVITY_STATUSES.PLANNED,
    category: "Ajuste de estilo de vida",
    reportName: "Esboço de base de sono e passos",
    createdAt: "2026-03-06T00:00:00Z",
    startDate: null,
    endDate: null,
    findingsBySeverity: { blocked: 0, high: 0, medium: 0, low: 0, note: 0 },
    leetTags: [{ title: "Sono" }, { title: "Passos" }, { title: "Base" }],
  },
  {
    id: "act-5",
    name: "Reboot de movimento do fim de semana",
    slug: "weekend-movement-reboot",
    status: ACTIVITY_STATUSES.IN_PROGRESS,
    category: "Plano de fim de semana",
    reportName: "Check-in do reboot de movimento do fim de semana",
    createdAt: "2026-02-28T00:00:00Z",
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2026-03-29T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 1, medium: 2, low: 1, note: 2 },
    leetTags: [{ title: "Fim de semana" }, { title: "Constância" }],
  },
];

export const MOCK_SOURCES = {
  "act-1": [
    { id: "src-1", type: "file", name: "Notas atuais de passos", files: ["passos-semana-0.txt"] },
    { id: "src-2", type: "url", name: "Rota de caminhada do bairro", url: "https://maps.example.com/walk-loop" },
    { id: "src-3", type: "file", name: "Foto da agenda da manhã", files: ["agenda-manha.png"] },
  ],
  "act-2": [
    { id: "src-4", type: "file", name: "Checklist de acordar", files: ["checklist-acordar.md"] },
    { id: "src-5", type: "url", name: "Alongamento guiado", url: "https://video.example.com/stretch-8min" },
  ],
  "act-3": [
    { id: "src-6", type: "file", name: "Rastreador de mobilidade", files: ["sequencia-mobilidade.csv"] },
    { id: "src-7", type: "url", name: "Timer de pausa da mesa", url: "https://timer.example.com/desk-breaks" },
  ],
  "act-4": [],
  "act-5": [
    { id: "src-8", type: "file", name: "Rascunho do plano de fim de semana", files: ["plano-fim-de-semana.md"] },
    { id: "src-9", type: "url", name: "Playlist para caminhada indoor", url: "https://music.example.com/indoor-walk" },
  ],
};

export const MOCK_TEST_CASES = {
  "act-1": [
    { id: "plan-1", halIndex: "PLANO-001", title: "Caminhar 10 minutos depois do café", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-2", halIndex: "PLANO-002", title: "Deixar o tênis pronto antes de dormir", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-3", halIndex: "PLANO-003", title: "Bater 4.000 passos em três dias úteis", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-4", halIndex: "PLANO-004", title: "Trocar um bloco extra sentado por uma volta de 5 minutos", status: WEEKLY_PLAN_STATUSES.QUEUED },
  ],
  "act-2": [
    { id: "plan-5", halIndex: "PLANO-005", title: "Beber água até 10 minutos depois de acordar", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-6", halIndex: "PLANO-006", title: "Fazer 6 minutos de alongamento antes do celular", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-7", halIndex: "PLANO-007", title: "Preparar o café da manhã na noite anterior", status: WEEKLY_PLAN_STATUSES.SKIPPED },
  ],
  "act-3": [
    { id: "plan-8", halIndex: "PLANO-008", title: "Completar três sessões curtas de mobilidade por semana", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-9", halIndex: "PLANO-009", title: "Levantar a cada 60 minutos durante o trabalho", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-10", halIndex: "PLANO-010", title: "Fechar uma recuperação de 12 minutos na sexta", status: WEEKLY_PLAN_STATUSES.DONE },
  ],
  "act-4": [],
  "act-5": [
    { id: "plan-11", halIndex: "PLANO-011", title: "Reservar um bloco ao ar livre todo sábado de manhã", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-12", halIndex: "PLANO-012", title: "Segurar uma hora sem sofá no domingo à tarde", status: WEEKLY_PLAN_STATUSES.QUEUED },
    { id: "plan-13", halIndex: "PLANO-013", title: "Preparar uma opção indoor de plano B", status: WEEKLY_PLAN_STATUSES.QUEUED },
  ],
};

export const MOCK_FINDINGS = {
  "act-1": [
    { id: "fr-1", halIndex: "AT-01", title: "O tênis não está visível pela manhã", severity: FOCUS_LEVELS.BLOCKED, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-2", halIndex: "AT-02", title: "O café da manhã está empurrando a caminhada", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.PARTLY_DONE },
    { id: "fr-3", halIndex: "AT-03", title: "A meta de passos está grande demais para dias de baixa energia", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-4", halIndex: "AT-04", title: "A playlist certa está facilitando o início", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-2": [
    { id: "fr-5", halIndex: "AT-05", title: "O celular entra antes da rotina começar", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.NEEDS_SUPPORT },
    { id: "fr-6", halIndex: "AT-06", title: "O tapete de alongamento está guardado longe demais", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-7", halIndex: "AT-07", title: "A posição da garrafa já está funcionando bem", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-3": [
    { id: "fr-8", halIndex: "AT-08", title: "Reuniões tardias ainda quebram a sequência às vezes", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.DONE },
    { id: "fr-9", halIndex: "AT-09", title: "Uma versão mais curta melhorou a constância", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-4": [],
  "act-5": [
    { id: "fr-10", halIndex: "AT-10", title: "O fim de semana está vago demais para proteger tempo de movimento", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-11", halIndex: "AT-11", title: "Dias chuvosos eliminam a opção padrão", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.NEEDS_SUPPORT },
    { id: "fr-12", halIndex: "AT-12", title: "Um loop de tarefas em pé virou um ótimo plano B", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
};

export const MOCK_ANALYSIS = {
  "act-1": {
    status: "completed",
    updatedAt: "2026-03-08T00:00:00Z",
    insights: [
      { id: "ins-1", title: "Sua manhã precisa de um gatilho mais simples", description: "A caminhada acontece mais quando tênis, meia e rota já estão decididos na noite anterior.", severity: "high" },
      { id: "ins-2", title: "Você responde bem a vitórias pequenas", description: "As caminhadas curtas estão acontecendo. O próximo passo correto é frequência, não intensidade.", severity: "positive" },
      { id: "ins-3", title: "Dias de baixa energia pedem uma meta de resgate", description: "Uma caminhada mínima de 5 minutos protege a identidade de alguém ativo nos dias difíceis.", severity: "info" },
    ],
    provisionalFindings: 2,
  },
  "act-2": {
    status: "completed",
    updatedAt: "2026-03-05T00:00:00Z",
    insights: [
      { id: "ins-4", title: "O celular está vencendo a rotina", description: "Os primeiros cinco minutos do dia estão decidindo o fluxo inteiro. Tira o celular de perto da cama.", severity: "high" },
      { id: "ins-5", title: "O gatilho da hidratação já está firme", description: "Uma ação fácil já está pegando, então ela é um ótimo gancho para o resto da manhã.", severity: "positive" },
    ],
    provisionalFindings: 1,
  },
  "act-3": {
    status: "completed",
    updatedAt: "2026-02-18T00:00:00Z",
    insights: [
      { id: "ins-6", title: "Sessões curtas cabem no seu dia real", description: "A constância melhorou quando o plano parou de competir com o fim do expediente.", severity: "positive" },
      { id: "ins-7", title: "A sequência ainda sofre em dias sobrecarregados", description: "Manter uma opção de 4 minutos protege o hábito quando o trabalho atrasa.", severity: "medium" },
    ],
    provisionalFindings: 0,
  },
  "act-4": null,
  "act-5": {
    status: "in_progress",
    updatedAt: "2026-03-09T00:00:00Z",
    insights: [],
    provisionalFindings: 0,
  },
};
