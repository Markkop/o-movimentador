"use client";

import { cn } from "../../lib/utils";
import {
  Activity,
  BarChart3,
  CheckSquare,
  Clock3,
  Footprints,
  Lightbulb,
  Target,
} from "lucide-react";
import { MOVEMENT_WIDGET_SUMMARY } from "../mockPortalData";

function WidgetHeader({ title, icon: Icon }) {
  return (
    <div className="drag-handle flex shrink-0 cursor-move items-center justify-between rounded-t-xl p-4 pb-2 transition-colors group-hover:bg-secondaryCardBackgroundHover">
      <div className="flex items-center gap-2 text-subtitle">
        {Icon && <Icon size={16} />}
        <h3 className="text-xs font-medium">{title}</h3>
      </div>
      <div className="text-icons opacity-0 transition-opacity group-hover:opacity-100">
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

function WeeklyMinutesWidget() {
  const completion = Math.round(
    (MOVEMENT_WIDGET_SUMMARY.weeklyMinutes.completed /
      MOVEMENT_WIDGET_SUMMARY.weeklyMinutes.target) *
      100
  );

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Minutos na semana" icon={Clock3} />
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-2 cancel-drag">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-title">
            {MOVEMENT_WIDGET_SUMMARY.weeklyMinutes.completed}
          </span>
          <span className="pb-1 text-sm text-subtitle">
            / {MOVEMENT_WIDGET_SUMMARY.weeklyMinutes.target} min
          </span>
        </div>
        <div>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondaryCardStroke">
            <div
              className="h-full rounded-full bg-hAccent transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-subtitle">
            {completion}% da meta semanal. Variação:{" "}
            <span className="font-semibold text-black-green">
              {MOVEMENT_WIDGET_SUMMARY.weeklyMinutes.delta}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function TodayRhythmWidget() {
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Ritmo de hoje" icon={Activity} />
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-2 cancel-drag">
        {MOVEMENT_WIDGET_SUMMARY.todayRhythm.map((slot) => (
          <div
            key={slot.label}
            className="flex items-center justify-between rounded-lg border border-cardStroke bg-navBackground px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-title">{slot.label}</p>
              <p className="text-2xs text-subtitle">{slot.detail}</p>
            </div>
            <span className="text-sm font-semibold text-hAccent">{slot.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitFocusWidget() {
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Hábitos em foco" icon={Footprints} />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 pt-2 cancel-drag">
        {MOVEMENT_WIDGET_SUMMARY.habits.map((habit) => (
          <div key={habit.name} className="rounded-lg border border-cardStroke bg-navBackground p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-title">{habit.name}</p>
              <span className="text-2xs text-subtitle">{habit.label}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondaryCardStroke">
              <div
                className="h-full rounded-full bg-hAccent transition-all"
                style={{ width: `${habit.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenTasksWidget() {
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Tarefas abertas" icon={CheckSquare} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4 pt-2 cancel-drag">
        {MOVEMENT_WIDGET_SUMMARY.tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center justify-between rounded-lg border border-cardStroke bg-navBackground px-3 py-2"
          >
            <p className="truncate text-sm text-title">{task.title}</p>
            <span className="text-2xs font-semibold uppercase tracking-wider text-lightBlue">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepsTrendWidget() {
  const values = MOVEMENT_WIDGET_SUMMARY.stepsTrend;
  const maxValue = Math.max(...values);

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Passos" icon={BarChart3} />
      <div className="flex flex-1 items-end gap-2 px-4 pb-4 pt-2 cancel-drag">
        {values.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                "w-full rounded-t-md",
                index === values.length - 1 ? "bg-black-green" : "bg-secondaryCardStroke"
              )}
              style={{ height: `${(value / maxValue) * 88}%`, minHeight: 6 }}
            />
            <span className="text-3xs text-subtitle">{`D${index + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MovementBalanceWidget() {
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Equilíbrio" icon={Target} />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 pb-4 pt-2 cancel-drag">
        {MOVEMENT_WIDGET_SUMMARY.balance.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-subtitle">
              <span>{item.label}</span>
              <span className="font-medium text-title">{item.score}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondaryCardStroke">
              <div
                className={cn("h-full rounded-full transition-all", item.color)}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachNotesWidget() {
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Notas do coach" icon={Lightbulb} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4 pt-2 cancel-drag">
        {MOVEMENT_WIDGET_SUMMARY.coachNotes.map((note) => (
          <div key={note} className="rounded-lg border border-cardStroke bg-navBackground p-3">
            <p className="text-sm leading-relaxed text-title">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const WIDGET_CONTENT_MAP = {
  "weekly-minutes": WeeklyMinutesWidget,
  "today-rhythm": TodayRhythmWidget,
  "habit-focus": HabitFocusWidget,
  "open-tasks": OpenTasksWidget,
  "steps-trend": StepsTrendWidget,
  "movement-balance": MovementBalanceWidget,
  "coach-notes": CoachNotesWidget,
};

export function renderWidgetContent({ id }) {
  const Component = WIDGET_CONTENT_MAP[id];
  if (!Component) return null;
  return <Component />;
}

export function WidgetPreview({ widgetDef }) {
  const Icon = widgetDef.icon;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2">
      <Icon size={20} className={widgetDef.previewColor} />
      <span className="text-center text-3xs leading-tight text-subtitle">{widgetDef.name}</span>
    </div>
  );
}
