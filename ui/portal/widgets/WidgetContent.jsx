"use client";

import { cn } from "../../lib/utils";
import {
  Activity,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Eye,
  Shield,
} from "lucide-react";

function WidgetHeader({ title, icon: Icon }) {
  return (
    <div className="drag-handle cursor-move flex items-center justify-between p-4 pb-2 shrink-0 group-hover:bg-secondaryCardBackgroundHover transition-colors rounded-t-xl">
      <div className="flex items-center gap-2 text-subtitle">
        {Icon && <Icon size={16} />}
        <h3 className="text-xs font-medium">{title}</h3>
      </div>
      <div className="text-icons opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    </div>
  );
}

function ConsistencyScoreWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Consistency Score" icon={ShieldAlert} />
      <div className="flex-1 px-4 pb-4 pt-2 flex items-center cancel-drag">
        <div className="flex items-end gap-2">
          <span className="font-bold text-title text-4xl">84</span>
          <span className="text-sm text-green-500 mb-1 flex items-center">
            <TrendingUp size={14} className="mr-1" /> +6
          </span>
        </div>
      </div>
    </div>
  );
}

function TodayPlanWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Today's Plan" icon={Activity} />
      <div className="flex-1 px-4 pb-4 pt-2 flex items-center cancel-drag">
        <div className="flex items-end gap-2">
          <span className="font-bold text-title text-4xl">3</span>
          <span className="text-sm text-subtitle mb-1">small wins queued</span>
        </div>
      </div>
    </div>
  );
}

function ActivityWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Current Activity Phase" icon={CheckCircle2} />
      <div className="flex-1 px-4 pb-4 pt-2 flex flex-col justify-center cancel-drag">
        <div className="relative pt-1 w-full">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondaryCardStroke">
            <div
              style={{ width: "65%" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-hAccent"
            />
          </div>
          <div className="flex justify-between text-xs text-subtitle font-medium">
            <span>Start</span>
            <span className="text-title">Repeat (65%)</span>
            <span>Identity</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ALERT_DATA = [
  { id: 1, title: "Shoes are still hidden in the closet", severity: "Blocked", color: "text-red-600" },
  { id: 2, title: "Lunch break walk happened twice this week", severity: "Win", color: "text-black-green" },
  { id: 3, title: "Rainy-day backup plan is missing", severity: "High", color: "text-salmon" },
  { id: 4, title: "Phone use is delaying the morning routine", severity: "High", color: "text-salmon" },
  { id: 5, title: "Stretch mat placement is improving follow-through", severity: "Note", color: "text-lightBlue" },
];

function WinsWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Wins & Friction" icon={AlertTriangle} />
      <div className="flex-1 px-4 pb-4 pt-2 overflow-y-auto cancel-drag">
        <div className="space-y-3">
          {ALERT_DATA.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-lg border border-cardStroke bg-navBackground"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AlertTriangle size={16} className={cn("shrink-0", alert.color)} />
                <span className="text-sm text-title font-medium truncate">{alert.title}</span>
              </div>
              <span className={cn("text-xs font-bold shrink-0 ml-2", alert.color)}>
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HabitBalanceWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Habit Balance" icon={ClipboardCheck} />
      <div className="flex-1 px-4 pb-4 pt-2 cancel-drag">
        <div className="space-y-3">
          {[
            { label: "Movement", pct: 72, color: "bg-hAccent" },
            { label: "Sleep", pct: 68, color: "bg-lightBlue" },
            { label: "Meals", pct: 81, color: "bg-black-green" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-subtitle mb-1">
                <span>{item.label}</span>
                <span className="text-title font-medium">{item.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondaryCardStroke overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", item.color)}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StreakTrendWidget() {
  const data = [2, 3, 4, 3, 5, 6, 6];
  const max = Math.max(...data);

  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Streak Trend" icon={BarChart3} />
      <div className="flex-1 px-4 pb-4 pt-2 cancel-drag flex items-end gap-1">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-full rounded-t",
                i === data.length - 1 ? "bg-hAccent" : "bg-secondaryCardStroke"
              )}
              style={{ height: `${(val / max) * 80}%`, minHeight: 4 }}
            />
            <span className="text-3xs text-subtitle">{`W${i + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutineCoverageWidget() {
  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Routine Coverage" icon={Eye} />
      <div className="flex-1 px-4 pb-4 pt-2 flex items-center justify-center cancel-drag">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-secondaryCardStroke" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              className="stroke-hAccent"
              strokeWidth="3"
              strokeDasharray="75, 100"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-title">75%</span>
            <span className="text-3xs text-subtitle">anchored</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusBreakdownWidget() {
  const categories = [
    { label: "Energy", score: 78, color: "bg-lightBlue" },
    { label: "Timing", score: 91, color: "bg-hAccent" },
    { label: "Environment", score: 66, color: "bg-salmon" },
    { label: "Recovery", score: 84, color: "bg-black-green" },
  ];

  return (
    <div className="flex flex-col h-full">
      <WidgetHeader title="Focus Breakdown" icon={Shield} />
      <div className="flex-1 px-4 pb-4 pt-2 cancel-drag">
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-xs text-subtitle w-28 truncate">{cat.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondaryCardStroke overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", cat.color)}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <span className="text-xs text-title font-medium w-8 text-right">{cat.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const WIDGET_CONTENT_MAP = {
  "consistency-score": ConsistencyScoreWidget,
  "today-plan": TodayPlanWidget,
  activity: ActivityWidget,
  wins: WinsWidget,
  "habit-balance": HabitBalanceWidget,
  "streak-trend": StreakTrendWidget,
  "routine-coverage": RoutineCoverageWidget,
  "focus-breakdown": FocusBreakdownWidget,
};

export function renderWidgetContent({ id }) {
  const Component = WIDGET_CONTENT_MAP[id];
  if (!Component) return null;
  return <Component />;
}

export function WidgetPreview({ widgetDef }) {
  const Icon = widgetDef.icon;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-2">
      <Icon size={20} className={widgetDef.previewColor} />
      <span className="text-3xs text-subtitle text-center leading-tight">{widgetDef.name}</span>
    </div>
  );
}
