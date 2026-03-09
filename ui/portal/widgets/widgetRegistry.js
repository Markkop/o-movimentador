import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Eye,
  ClipboardCheck,
  Shield,
} from "lucide-react";

export const TOOL_TO_WIDGET_MAP = {
  "activation-plan": "today-plan",
  "consistency-check": "consistency-score",
  "coach-review": "activity",
  "sleep-reset": "habit-balance",
  "momentum-check": "streak-trend",
};

export const WIDGET_REGISTRY = [
  {
    id: "consistency-score",
    name: "Índice de constância",
    description: "Uma visão rápida de quão estável está seu ciclo de hábitos nesta semana",
    icon: ShieldAlert,
    category: "overview",
    defaultSize: { width: 120, height: 120 },
    previewColor: "text-salmon",
  },
  {
    id: "today-plan",
    name: "Plano de hoje",
    description: "Suas rotinas ativas e as próximas ações do dia",
    icon: Activity,
    category: "momentum",
    defaultSize: { width: 300, height: 140 },
    previewColor: "text-hAccent",
  },
  {
    id: "activity",
    name: "Fase atual",
    description: "Progresso da sua fase atual de transição para mais movimento",
    icon: CheckCircle2,
    category: "coaching",
    defaultSize: { width: 620, height: 180 },
    previewColor: "text-lightBlue",
  },
  {
    id: "wins",
    name: "Vitórias e atritos",
    description: "Bloqueios recentes, vitórias e notas do coach",
    icon: AlertTriangle,
    category: "coaching",
    defaultSize: { width: 400, height: 340 },
    previewColor: "text-salmon",
  },
  {
    id: "habit-balance",
    name: "Equilíbrio da rotina",
    description: "Como movimento, sono, alimentação e recuperação estão se alinhando",
    icon: ClipboardCheck,
    category: "routine",
    defaultSize: { width: 300, height: 180 },
    previewColor: "text-lightBlue",
  },
  {
    id: "streak-trend",
    name: "Tendência da sequência",
    description: "Constância do movimento nas últimas semanas",
    icon: BarChart3,
    category: "momentum",
    defaultSize: { width: 400, height: 200 },
    previewColor: "text-hAccent",
  },
  {
    id: "routine-coverage",
    name: "Cobertura da rotina",
    description: "Quantos gatilhos do seu dia já têm um movimento associado",
    icon: Eye,
    category: "overview",
    defaultSize: { width: 300, height: 180 },
    previewColor: "text-black-green",
  },
  {
    id: "focus-breakdown",
    name: "Mapa de foco",
    description: "Onde focar a seguir entre energia, horário e ambiente",
    icon: Shield,
    category: "overview",
    defaultSize: { width: 400, height: 200 },
    previewColor: "text-salmon",
  },
];

export function getWidgetById({ id }) {
  return WIDGET_REGISTRY.find((w) => w.id === id);
}

export function getSuggestedWidgetForTool({ toolId }) {
  const widgetId = TOOL_TO_WIDGET_MAP[toolId];
  if (!widgetId) return null;
  return getWidgetById({ id: widgetId });
}

export function getDefaultWidgets() {
  return ["consistency-score", "today-plan", "activity"];
}

export function computeWidgetPositions({ widgetIds }) {
  const GAP = 20;
  let x = GAP;
  let y = GAP;
  let rowMaxHeight = 0;
  const containerWidth = 1080;

  return widgetIds.map((id) => {
    const def = getWidgetById({ id });
    if (!def) return null;

    const { width, height } = def.defaultSize;

    if (x + width > containerWidth && x > GAP) {
      x = GAP;
      y += rowMaxHeight + GAP;
      rowMaxHeight = 0;
    }

    const pos = { id, x, y, width, height };
    x += width + GAP;
    rowMaxHeight = Math.max(rowMaxHeight, height);
    return pos;
  }).filter(Boolean);
}
