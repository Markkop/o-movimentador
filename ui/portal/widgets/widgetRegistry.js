import {
  Activity,
  BarChart3,
  CheckSquare,
  Clock3,
  Footprints,
  Lightbulb,
  Target,
} from "lucide-react";

export const WIDGET_REGISTRY = [
  {
    id: "weekly-minutes",
    name: "Minutos na semana",
    description: "Meta semanal de minutos com leitura rápida do quanto já foi protegido.",
    icon: Clock3,
    category: "progress",
    defaultSize: { width: 180, height: 150 },
    previewColor: "text-hAccent",
  },
  {
    id: "today-rhythm",
    name: "Ritmo de hoje",
    description: "Blocos curtos que mantêm o dia em movimento sem exigir demais.",
    icon: Activity,
    category: "progress",
    defaultSize: { width: 360, height: 180 },
    previewColor: "text-lightBlue",
  },
  {
    id: "habit-focus",
    name: "Hábitos em foco",
    description: "Visão compacta dos hábitos diários e semanais mais importantes.",
    icon: Footprints,
    category: "habits",
    defaultSize: { width: 360, height: 220 },
    previewColor: "text-hAccent",
  },
  {
    id: "open-tasks",
    name: "Tarefas abertas",
    description: "Os próximos ajustes pequenos que destravam sua rotina.",
    icon: CheckSquare,
    category: "tasks",
    defaultSize: { width: 360, height: 220 },
    previewColor: "text-lightBlue",
  },
  {
    id: "steps-trend",
    name: "Passos",
    description: "Tendência recente dos passos para acompanhar o ritmo sem obsessão.",
    icon: BarChart3,
    category: "progress",
    defaultSize: { width: 420, height: 220 },
    previewColor: "text-black-green",
  },
  {
    id: "movement-balance",
    name: "Equilíbrio",
    description: "Como minutos, passos e pausas estão se apoiando na semana.",
    icon: Target,
    category: "progress",
    defaultSize: { width: 320, height: 180 },
    previewColor: "text-salmon",
  },
  {
    id: "coach-notes",
    name: "Notas do coach",
    description: "Insights curtos que a IA aprendeu sobre você até aqui.",
    icon: Lightbulb,
    category: "coach",
    defaultSize: { width: 440, height: 240 },
    previewColor: "text-salmon",
  },
];

export function getWidgetById({ id }) {
  return WIDGET_REGISTRY.find((widget) => widget.id === id);
}

export function getSuggestedWidgetForTool() {
  return null;
}

export function getDefaultWidgets() {
  return ["weekly-minutes", "habit-focus", "open-tasks"];
}

export function computeWidgetPositions({ widgetIds }) {
  const gap = 20;
  let x = gap;
  let y = gap;
  let rowMaxHeight = 0;
  const containerWidth = 1080;

  return widgetIds
    .map((id) => {
      const definition = getWidgetById({ id });
      if (!definition) return null;

      const { width, height } = definition.defaultSize;

      if (x + width > containerWidth && x > gap) {
        x = gap;
        y += rowMaxHeight + gap;
        rowMaxHeight = 0;
      }

      const position = { id, x, y, width, height };
      x += width + gap;
      rowMaxHeight = Math.max(rowMaxHeight, height);
      return position;
    })
    .filter(Boolean);
}
