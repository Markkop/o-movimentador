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
    name: "Consistency Score",
    description: "A quick view of how steady your habit loop is this week",
    icon: ShieldAlert,
    category: "overview",
    defaultSize: { width: 120, height: 120 },
    previewColor: "text-salmon",
  },
  {
    id: "today-plan",
    name: "Today's Plan",
    description: "Your current active routines and next actions",
    icon: Activity,
    category: "momentum",
    defaultSize: { width: 300, height: 140 },
    previewColor: "text-hAccent",
  },
  {
    id: "activity",
    name: "Current Activity Phase",
    description: "Progress through your current movement reset",
    icon: CheckCircle2,
    category: "coaching",
    defaultSize: { width: 620, height: 180 },
    previewColor: "text-lightBlue",
  },
  {
    id: "wins",
    name: "Wins & Friction",
    description: "Recent blockers, wins, and coach notes",
    icon: AlertTriangle,
    category: "coaching",
    defaultSize: { width: 400, height: 340 },
    previewColor: "text-salmon",
  },
  {
    id: "habit-balance",
    name: "Habit Balance",
    description: "How movement, sleep, food, and recovery are lining up",
    icon: ClipboardCheck,
    category: "routine",
    defaultSize: { width: 300, height: 180 },
    previewColor: "text-lightBlue",
  },
  {
    id: "streak-trend",
    name: "Streak Trend",
    description: "Movement consistency over the last several weeks",
    icon: BarChart3,
    category: "momentum",
    defaultSize: { width: 400, height: 200 },
    previewColor: "text-hAccent",
  },
  {
    id: "routine-coverage",
    name: "Routine Coverage",
    description: "How many of your day anchors already have a movement cue",
    icon: Eye,
    category: "overview",
    defaultSize: { width: 300, height: 180 },
    previewColor: "text-black-green",
  },
  {
    id: "focus-breakdown",
    name: "Focus Breakdown",
    description: "Where to focus next across energy, timing, and environment",
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
  return ["consistency-score"];
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
