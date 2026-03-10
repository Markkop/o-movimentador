"use client";

import {
  BellRing,
  CheckSquare,
  ChevronRight,
  Footprints,
  Lightbulb,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  PortalPanel,
  PortalPanelBody,
  PortalPanelHeader,
  PortalPanelHeaderLead,
} from "./PortalLayout";

const TYPE_ICON_MAP = {
  habit: Footprints,
  task: CheckSquare,
  insight: Lightbulb,
};

const TYPE_STYLES = {
  habit: "text-hAccent bg-hAccent/10",
  task: "text-lightBlue bg-lightBlue/15",
  insight: "text-salmon bg-salmon/10",
};

function ActivityCard({ activity, onClick }) {
  const Icon = TYPE_ICON_MAP[activity.type] ?? BellRing;
  const styleClass = TYPE_STYLES[activity.type] ?? "text-icons bg-cardBackgroundHover";

  return (
    <button
      onClick={() => onClick?.(activity)}
      className="w-full rounded-xl border border-cardStroke bg-secondaryCardBackground p-3 text-left transition-all hover:border-hAccent/40 hover:bg-cardBackgroundHover"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            styleClass
          )}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-title">{activity.title}</p>
            <span className="rounded-full bg-cardBackground px-2 py-0.5 text-2xs text-subtitle">
              {activity.whenLabel}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-subtitle">{activity.description}</p>
          <p className="mt-2 text-2xs font-medium uppercase tracking-wider text-hAccent">
            {activity.meta}
          </p>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0 text-icons" />
      </div>
    </button>
  );
}

function CompactHabitCard({ habit }) {
  return (
    <div className="rounded-lg border border-cardStroke bg-cardBackground p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-title">{habit.name}</p>
        <span className="text-2xs text-subtitle">{habit.cadence}</span>
      </div>
      <p className="mt-1 text-2xs text-subtitle">{habit.progressLabel}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondaryCardStroke">
        <div
          className="h-full rounded-full bg-hAccent transition-all"
          style={{ width: `${habit.progress}%` }}
        />
      </div>
    </div>
  );
}

function CompactTaskRow({ task, onClick }) {
  return (
    <button
      onClick={() => onClick?.(task)}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-cardBackgroundHover"
    >
      <CheckSquare size={16} className="mt-0.5 shrink-0 text-lightBlue" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-title">{task.title}</p>
        <p className="truncate text-2xs text-subtitle">{task.whenLabel}</p>
      </div>
    </button>
  );
}

export function CatalogPanel({
  activities = [],
  habits = [],
  tasks = [],
  isCollapsed = false,
  onToggleCollapse,
  onActivityClick,
}) {
  const stats = [
    { label: "Hábitos hoje", value: `${habits.length}` },
    { label: "Tarefas", value: `${tasks.length}` },
    { label: "Insights", value: `${activities.filter((item) => item.type === "insight").length}` },
  ];

  return (
    <PortalPanel as="aside">
      <PortalPanelHeader>
        {!isCollapsed && (
          <PortalPanelHeaderLead>
            <h3 className="text-sm font-semibold text-title">Próximas Atividades</h3>
            <p className="text-xs text-subtitle">Hábitos, tarefas e insights para agir agora.</p>
          </PortalPanelHeaderLead>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
          title={isCollapsed ? "Expandir painel" : "Recolher painel"}
        >
          {isCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
        </button>
      </PortalPanelHeader>

      {isCollapsed ? (
        <PortalPanelBody className="flex flex-col items-center gap-3 px-2 py-4">
          {activities.slice(0, 4).map((activity) => {
            const Icon = TYPE_ICON_MAP[activity.type] ?? BellRing;
            const styleClass = TYPE_STYLES[activity.type] ?? "text-icons bg-cardBackgroundHover";
            return (
              <button
                key={activity.id}
                onClick={() => onActivityClick?.(activity)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-cardBackgroundHover",
                  styleClass
                )}
                title={activity.title}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </PortalPanelBody>
      ) : (
        <PortalPanelBody className="space-y-5 overflow-y-auto px-4 py-4 scrollbar-thin">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-cardStroke bg-cardBackground p-3">
                <p className="text-2xs uppercase tracking-wider text-subtitle">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold text-title">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-subtitle">
                Na fila
              </h4>
              <span className="text-2xs text-subtitle">{activities.length} itens</span>
            </div>
            <div className="space-y-2">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={onActivityClick}
                />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtitle">
              Hábitos em foco
            </h4>
            <div className="space-y-2">
              {habits.slice(0, 3).map((habit) => (
                <CompactHabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtitle">
              Tarefas abertas
            </h4>
            <div className="rounded-xl border border-cardStroke bg-secondaryCardBackground py-1">
              {tasks.slice(0, 4).map((task) => (
                <CompactTaskRow
                  key={task.id}
                  task={task}
                  onClick={() =>
                    onActivityClick?.({
                      id: task.id,
                      type: "task",
                      title: task.title,
                      description: task.description,
                      whenLabel: task.whenLabel,
                      meta: task.status,
                      linkedConversationId: task.linkedConversationId,
                    })
                  }
                />
              ))}
            </div>
          </section>
        </PortalPanelBody>
      )}
    </PortalPanel>
  );
}
