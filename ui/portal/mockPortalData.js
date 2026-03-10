export const MOCK_TEAMS = [
  { id: "team-1", name: "Time Pessoal", plan: "Cloud" },
  { id: "team-2", name: "Casa em Movimento", plan: "Compartilhado" },
  { id: "team-3", name: "Time do Trabalho", plan: "Piloto" },
];

export const MOCK_USER = {
  name: "Marcelo Silva",
  email: "marcelo@movimentador.app",
  avatar: null,
};

export const MOCK_EQUIPMENT_BY_TEAM = {
  "team-1": [],
  "team-2": [],
  "team-3": [],
};

export const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    teamId: "team-1",
    title: "Destravar minha semana",
    preview: "Vamos começar com blocos curtos e possíveis.",
    updatedLabel: "Agora",
    unread: 0,
  },
  {
    id: "conv-2",
    teamId: "team-1",
    title: "Rotina da manhã",
    preview: "Seu plano B precisa caber até em dia cansado.",
    updatedLabel: "Ontem",
    unread: 2,
  },
  {
    id: "conv-3",
    teamId: "team-1",
    title: "Passos e pausas",
    preview: "Faltam 600 passos para a meta leve de hoje.",
    updatedLabel: "Sáb",
    unread: 0,
  },
  {
    id: "conv-4",
    teamId: "team-2",
    title: "Mover mais em casa",
    preview: "Vamos usar tarefas domésticas como gatilho.",
    updatedLabel: "Hoje",
    unread: 0,
  },
  {
    id: "conv-5",
    teamId: "team-3",
    title: "Pausas no trabalho",
    preview: "Você já tem duas janelas boas entre reuniões.",
    updatedLabel: "Qui",
    unread: 1,
  },
];

export const MOCK_MESSAGES_BY_CONVERSATION = {
  "conv-1": [],
  "conv-2": [
    {
      id: "m-2",
      role: "assistant",
      content:
        "Sua manhã está ficando mais estável quando a primeira ação é curta.\n\nHoje eu manteria um começo de **4 minutos** e deixaria o celular para depois.",
    },
    {
      id: "m-3",
      role: "user",
      content: "Quero uma versão mais leve para dias em que acordo sem energia.",
    },
    {
      id: "m-4",
      role: "assistant",
      content:
        "Fechado. A versão de resgate pode ser só: beber água, alongar 2 minutos e caminhar 3 minutos dentro de casa.",
      suggestedActions: [
        {
          label: "Transformar em tarefa",
          message: "Transforma essa versão leve em tarefa para amanhã cedo.",
        },
      ],
    },
  ],
  "conv-3": [
    {
      id: "m-5",
      role: "assistant",
      content:
        "Hoje você já acumulou **3.600 passos**. Falta pouco para bater a meta leve e manter o ritmo da semana.",
    },
  ],
  "conv-4": [
    {
      id: "m-6",
      role: "assistant",
      content:
        "Se a ideia é mover mais em casa, eu começaria conectando movimento a tarefas que já existem, sem depender de motivação extra.",
    },
  ],
  "conv-5": [
    {
      id: "m-7",
      role: "assistant",
      content:
        "Seu trabalho tem blocos curtos entre reuniões. A melhor aposta parece ser uma pausa guiada de **3 a 5 minutos**.",
    },
  ],
};

export const MOCK_HABITS = [
  {
    id: "habit-1",
    teamId: "team-1",
    name: "Caminhada leve",
    cadence: "Diário",
    targetLabel: "12 min",
    progress: 67,
    progressLabel: "8 de 12 min",
    statusLabel: "Faltam 4 min hoje",
  },
  {
    id: "habit-2",
    teamId: "team-1",
    name: "Alongar antes da série",
    cadence: "Diário",
    targetLabel: "3 min",
    progress: 100,
    progressLabel: "3 de 3 min",
    statusLabel: "Feito hoje",
  },
  {
    id: "habit-3",
    teamId: "team-1",
    name: "Bloco ativo de sábado",
    cadence: "Semanal",
    targetLabel: "30 min",
    progress: 35,
    progressLabel: "11 de 30 min",
    statusLabel: "Próximo bloco no sábado",
  },
  {
    id: "habit-4",
    teamId: "team-2",
    name: "Subir escadas em casa",
    cadence: "Diário",
    targetLabel: "5 min",
    progress: 40,
    progressLabel: "2 de 5 min",
    statusLabel: "Ainda cabe hoje",
  },
  {
    id: "habit-5",
    teamId: "team-3",
    name: "Pausa entre reuniões",
    cadence: "Diário",
    targetLabel: "4 pausas",
    progress: 50,
    progressLabel: "2 de 4 pausas",
    statusLabel: "Duas pausas restantes",
  },
];

export const MOCK_TASKS = [
  {
    id: "task-1",
    teamId: "team-1",
    title: "Separar tênis antes de dormir",
    description: "Deixar visível reduz o atrito da caminhada de amanhã.",
    whenLabel: "Hoje, 21:30",
    status: "Hoje",
    linkedConversationId: "conv-1",
  },
  {
    id: "task-2",
    teamId: "team-1",
    title: "Escolher plano B indoor",
    description: "Definir uma versão curta para dias corridos ou de chuva.",
    whenLabel: "Amanhã",
    status: "Próxima",
    linkedConversationId: "conv-2",
  },
  {
    id: "task-3",
    teamId: "team-1",
    title: "Fechar meta leve de passos",
    description: "Mais 600 passos resolvem a meta do dia.",
    whenLabel: "Hoje",
    status: "Hoje",
    linkedConversationId: "conv-3",
  },
  {
    id: "task-4",
    teamId: "team-2",
    title: "Definir circuito da sala",
    description: "Dois pontos da casa já bastam para começar.",
    whenLabel: "Hoje",
    status: "Hoje",
    linkedConversationId: "conv-4",
  },
  {
    id: "task-5",
    teamId: "team-3",
    title: "Bloquear pausa pós-almoço",
    description: "Reservar 5 minutos antes da próxima reunião.",
    whenLabel: "Hoje, 14:00",
    status: "Hoje",
    linkedConversationId: "conv-5",
  },
];

export const MOCK_UPCOMING_ACTIVITIES = [
  {
    id: "next-1",
    teamId: "team-1",
    type: "habit",
    title: "Caminhada leve",
    description: "Faltam 4 minutos para fechar o hábito de hoje.",
    meta: "8/12 min",
    whenLabel: "Hoje",
    linkedConversationId: "conv-1",
  },
  {
    id: "next-2",
    teamId: "team-1",
    type: "task",
    title: "Separar tênis antes de dormir",
    description: "Se isso ficar pronto hoje, amanhã começa mais fácil.",
    meta: "Tarefa rápida",
    whenLabel: "21:30",
    linkedConversationId: "conv-1",
  },
  {
    id: "next-3",
    teamId: "team-1",
    type: "insight",
    title: "Coach detectou um padrão",
    description: "Sua constância sobe quando a meta fica abaixo de 15 minutos.",
    meta: "Novo insight",
    whenLabel: "Agora",
    linkedConversationId: "conv-2",
  },
  {
    id: "next-4",
    teamId: "team-1",
    type: "task",
    title: "Fechar meta leve de passos",
    description: "Mais 600 passos e o dia fecha no verde.",
    meta: "600 passos",
    whenLabel: "Hoje",
    linkedConversationId: "conv-3",
  },
  {
    id: "next-5",
    teamId: "team-2",
    type: "habit",
    title: "Subir escadas em casa",
    description: "Dois minutos já protegem o hábito da casa.",
    meta: "2/5 min",
    whenLabel: "Hoje",
    linkedConversationId: "conv-4",
  },
  {
    id: "next-6",
    teamId: "team-3",
    type: "insight",
    title: "Janela boa entre reuniões",
    description: "Seu melhor espaço para pausa está entre 13:00 e 13:20.",
    meta: "IA",
    whenLabel: "Hoje",
    linkedConversationId: "conv-5",
  },
];

export const MOVEMENT_WIDGET_SUMMARY = {
  weeklyMinutes: {
    completed: 86,
    target: 150,
    delta: "+18",
  },
  todayRhythm: [
    { label: "Manhã", value: "4 min", detail: "alongamento leve" },
    { label: "Almoço", value: "8 min", detail: "caminhada curta" },
    { label: "Noite", value: "3 min", detail: "mobilidade em casa" },
  ],
  habits: [
    { name: "Caminhada leve", progress: 67, label: "8/12 min" },
    { name: "Alongar antes da série", progress: 100, label: "feito" },
    { name: "Bloco ativo de sábado", progress: 35, label: "11/30 min" },
  ],
  tasks: [
    { title: "Separar tênis antes de dormir", status: "Hoje" },
    { title: "Escolher plano B indoor", status: "Amanhã" },
    { title: "Fechar meta leve de passos", status: "Hoje" },
  ],
  stepsTrend: [3100, 4200, 3900, 5100, 4800, 5600, 6200],
  coachNotes: [
    "Você responde melhor a metas curtas em minutos.",
    "O plano da manhã ainda depende demais de energia alta.",
    "Seu plano B ficou mais importante do que subir intensidade agora.",
  ],
  balance: [
    { label: "Minutos", score: 57, color: "bg-hAccent" },
    { label: "Passos", score: 63, color: "bg-lightBlue" },
    { label: "Pausas", score: 48, color: "bg-black-green" },
  ],
  consistency: [
    { label: "Seg", active: true },
    { label: "Ter", active: true },
    { label: "Qua", active: false },
    { label: "Qui", active: true },
    { label: "Sex", active: true },
    { label: "Sáb", active: false },
    { label: "Dom", active: true },
  ],
};
