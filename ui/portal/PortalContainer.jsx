"use client";

import { useEffect, useRef, useState } from "react";
import { ChatbotUI } from "./ChatbotUI";
import { CatalogPanel } from "./CatalogPanel";
import { DashboardCanva } from "./DashboardCanva";
import { WidgetSettingsDialog } from "./widgets/WidgetSettingsDialog";
import { PortalSidebar } from "./PortalSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { computeWidgetPositions, getDefaultWidgets } from "./widgets/widgetRegistry";
import { cn } from "../lib/utils";
import { LayoutGrid, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import {
  MOCK_CONVERSATIONS,
  MOCK_HABITS,
  MOCK_MESSAGES_BY_CONVERSATION,
  MOCK_TASKS,
  MOCK_TEAMS,
  MOCK_UPCOMING_ACTIVITIES,
} from "./mockPortalData";

function buildCoachReply(content, context = {}) {
  const lower = content.toLowerCase();
  const topHabit = context.teamHabits?.[0];
  const topTask = context.teamTasks?.[0];
  const activityCount = context.teamActivities?.length ?? 0;

  if (lower.includes("visão geral") || lower.includes("visao geral")) {
    return {
      content: `Hoje seu quadro está assim:\n\n- **${context.teamHabits?.length ?? 0} hábitos ativos**\n- **${context.teamTasks?.length ?? 0} tarefas abertas**\n- **${activityCount} próximas atividades**\n\nSeu foco principal agora é **${topHabit?.name ?? "movimento diário leve"}** (${topHabit?.progressLabel ?? "em progresso"}) e a tarefa mais relevante é **${topTask?.title ?? "definir o próximo passo"}**.`,
      suggestedActions: [
        {
          label: "Abrir foco principal",
          message: `Quero focar em ${topHabit?.name ?? "meu hábito principal"} agora.`,
        },
        {
          label: "Revisar tarefa mais importante",
          message: `Quero revisar a tarefa ${topTask?.title ?? "mais importante"} agora.`,
        },
      ],
    };
  }

  if (lower.includes("desafiar")) {
    return {
      content: `Se a ideia é subir um degrau sem quebrar a constância, eu faria um ajuste pequeno:\n\n- **${topHabit?.name ?? "Hábito principal"}** pode subir de ${topHabit?.targetLabel ?? "10 min"} para **${context.challengeTarget ?? "15 min"}** em só um ou dois dias da semana.\n- **${topTask?.title ?? "Sua tarefa atual"}** pode ganhar um passo extra, mas ainda curto.\n\nA lógica é ficar só um pouco mais difícil, não virar outra vida.`,
      suggestedActions: [
        {
          label: "Aplicar desafio leve",
          message: "Aplica um desafio leve no meu plano atual.",
        },
        {
          label: "Ajustar só um hábito",
          message: `Quero ajustar só o hábito ${topHabit?.name ?? "principal"}.`,
        },
      ],
    };
  }

  if (lower.includes("pouco tempo") || lower.includes("corrido")) {
    return {
      content:
        "Se hoje está corrido, a melhor jogada é proteger um bloco pequeno.\n\nEu faria assim:\n1. Escolha **6 minutos**.\n2. Prenda esse bloco a algo fixo do dia.\n3. Deixe pronta uma versão de resgate de **2 minutos**.\n\nQuer que eu crie isso como tarefa de hoje?",
      suggestedActions: [
        {
          label: "Criar tarefa de hoje",
          message: "Cria uma tarefa leve para hoje.",
        },
        {
          label: "Versão de resgate",
          message: "Cria uma versão de resgate de 2 minutos.",
        },
      ],
    };
  }

  if (lower.includes("semana")) {
    return {
      content:
        "Boa. Para sua semana, eu manteria só três âncoras: um bloco curto na manhã, uma caminhada leve em um dia útil e um bloco semanal um pouco maior.\n\nTudo medido em minutos, sem inventar moda.",
      suggestedActions: [
        {
          label: "Fechar plano da semana",
          message: "Fecha um plano de semana leve para mim.",
        },
      ],
    };
  }

  if (lower.includes("parado") || lower.includes("sedent")) {
    return {
      content:
        "Se a sensação é de estar muito parado, o primeiro objetivo não é intensidade. É só começar a se mover com frequência suficiente para o corpo e a rotina pararem de resistir.\n\nEu começaria com **um hábito diário de 8 a 12 minutos** e um **plano B de 2 a 3 minutos**.",
      suggestedActions: [
        {
          label: "Criar hábito diário",
          message: "Cria um hábito diário leve de movimento para mim.",
        },
      ],
    };
  }

  if (lower.includes("passo")) {
    return {
      content:
        "Passos são uma boa métrica de base porque deixam o progresso visível sem te prender a treino formal.\n\nHoje eu usaria isso de forma simples: bater uma meta leve, repetir por alguns dias e só depois subir.",
      suggestedActions: [
        {
          label: "Ajustar meta de passos",
          message: "Me ajuda a ajustar uma meta leve de passos.",
        },
      ],
    };
  }

  return {
    content:
      "Faz sentido. Vamos destravar isso sem pressa e sem depender de motivação alta.\n\nMe diga se o problema maior hoje é **tempo**, **energia**, **dor de começar** ou **falta de rotina**.",
  };
}

function createFollowUpItem({ message, teamId, linkedConversationId }) {
  const lower = message.toLowerCase();
  const now = Date.now();

  if (lower.includes("tarefa")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Bloco leve de movimento",
        description: "Reservar 6 minutos ainda hoje para não perder o ritmo.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Bloco leve de movimento",
        description: "Um bloco curto já resolve o próximo passo de hoje.",
        meta: "6 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (lower.includes("resgate")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Plano B de resgate",
        cadence: "Diário",
        targetLabel: "2 min",
        progress: 0,
        progressLabel: "0 de 2 min",
        statusLabel: "Pronto para usar em dia difícil",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Plano B de resgate",
        description: "Deixar um movimento de 2 minutos pronto protege a constância.",
        meta: "2 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (lower.includes("plano de semana")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Revisar semana leve",
        description: "Fechar três blocos possíveis e um plano B simples.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "insight",
        title: "Semana leve pronta para revisão",
        description: "A IA organizou um plano inicial com metas em minutos.",
        meta: "Novo insight",
        whenLabel: "Agora",
        linkedConversationId,
      },
    };
  }

  if (lower.includes("hábito diário")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Movimento diário leve",
        cadence: "Diário",
        targetLabel: "10 min",
        progress: 0,
        progressLabel: "0 de 10 min",
        statusLabel: "Começa hoje",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Movimento diário leve",
        description: "Primeiro hábito criado com meta enxuta em minutos.",
        meta: "10 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (lower.includes("desafio leve") || lower.includes("ajustar só o hábito")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Testar versão um pouco mais forte",
        description: "Subir só 3 minutos no hábito principal em um dia da semana.",
        whenLabel: "Esta semana",
        status: "Novo",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "insight",
        title: "Desafio leve sugerido",
        description: "A IA propôs aumentar o hábito principal de forma controlada.",
        meta: "+3 min",
        whenLabel: "Agora",
        linkedConversationId,
      },
    };
  }

  return null;
}

export function PortalContainer() {
  const { theme, toggleTheme } = useTheme();

  const [activeTeamId, setActiveTeamId] = useState(MOCK_TEAMS[0].id);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] = useState(MOCK_MESSAGES_BY_CONVERSATION);
  const [habits, setHabits] = useState(MOCK_HABITS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [upcomingActivities, setUpcomingActivities] = useState(MOCK_UPCOMING_ACTIVITIES);
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id);

  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(360);
  const [dashboardMode, setDashboardMode] = useState("horizontal");
  const [dashHeight, setDashHeight] = useState(180);
  const [dashWidth, setDashWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);

  const [activeWidgetIds, setActiveWidgetIds] = useState(getDefaultWidgets());
  const [widgetCards, setWidgetCards] = useState(() =>
    computeWidgetPositions({ widgetIds: getDefaultWidgets() })
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isResizingRef = useRef(false);

  const visibleConversations = conversations.filter(
    (conversation) => conversation.teamId === activeTeamId
  );

  useEffect(() => {
    if (!visibleConversations.some((conversation) => conversation.id === activeConversationId)) {
      setActiveConversationId(visibleConversations[0]?.id ?? null);
    }
  }, [activeConversationId, visibleConversations]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    visibleConversations[0] ??
    null;
  const activeTeam =
    MOCK_TEAMS.find((team) => team.id === activeTeamId) ?? MOCK_TEAMS[0];
  const messages = activeConversation
    ? messagesByConversation[activeConversation.id] ?? []
    : [];
  const teamHabits = habits.filter((habit) => habit.teamId === activeTeamId);
  const teamTasks = tasks.filter((task) => task.teamId === activeTeamId);
  const teamActivities = upcomingActivities.filter((activity) => activity.teamId === activeTeamId);

  const handleToggleWidget = ({ widgetId }) => {
    setActiveWidgetIds((previous) => {
      const isActive = previous.includes(widgetId);
      const next = isActive
        ? previous.filter((id) => id !== widgetId)
        : [...previous, widgetId];
      setWidgetCards(computeWidgetPositions({ widgetIds: next }));
      return next;
    });
  };

  const handleRemoveWidget = (widgetId) => {
    setActiveWidgetIds((previous) => {
      const next = previous.filter((id) => id !== widgetId);
      setWidgetCards(computeWidgetPositions({ widgetIds: next }));
      return next;
    });
  };

  const handleUpdateCard = (id, newProps) => {
    setWidgetCards((previous) =>
      previous.map((card) => (card.id === id ? { ...card, ...newProps } : card))
    );
  };

  const updateConversationPreview = (conversationId, preview) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, preview, updatedLabel: "Agora", unread: 0 }
          : conversation
      )
    );
  };

  const handleSendMessage = (content) => {
    if (!activeConversation) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content,
    };

    setMessagesByConversation((previous) => ({
      ...previous,
      [activeConversation.id]: [...(previous[activeConversation.id] ?? []), userMessage],
    }));
    updateConversationPreview(activeConversation.id, content);

    setTimeout(() => {
      const reply = buildCoachReply(content, {
        teamHabits,
        teamTasks,
        teamActivities,
        challengeTarget: "15 min",
      });
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: reply.content,
        ...(reply.suggestedActions ? { suggestedActions: reply.suggestedActions } : {}),
      };

      setMessagesByConversation((previous) => ({
        ...previous,
        [activeConversation.id]: [...(previous[activeConversation.id] ?? []), assistantMessage],
      }));
      updateConversationPreview(activeConversation.id, reply.content.replace(/\n/g, " "));

      const followUp = createFollowUpItem({
        message: content,
        teamId: activeTeamId,
        linkedConversationId: activeConversation.id,
      });

      if (followUp?.habit) {
        setHabits((previous) => [followUp.habit, ...previous]);
      }
      if (followUp?.task) {
        setTasks((previous) => [followUp.task, ...previous]);
      }
      if (followUp?.activity) {
        setUpcomingActivities((previous) => [followUp.activity, ...previous]);
      }
    }, 700);
  };

  const handleActivityClick = (activity) => {
    const conversationId = activity.linkedConversationId ?? activeConversationId;
    if (conversationId) {
      setActiveConversationId(conversationId);
    }

    const detailMessage =
      activity.type === "insight"
        ? `Abri o insight **${activity.title}**.\n\n${activity.description}`
        : `Vamos agir em **${activity.title}**.\n\n${activity.description}`;

    setMessagesByConversation((previous) => ({
      ...previous,
      [conversationId]: [
        ...(previous[conversationId] ?? []),
        {
          id: Date.now(),
          role: "assistant",
          content: detailMessage,
        },
      ],
    }));
    updateConversationPreview(conversationId, detailMessage.replace(/\n/g, " "));
  };

  const handleNewConversation = () => {
    const id = `conv-${Date.now()}`;
    const newConversation = {
      id,
      teamId: activeTeamId,
      title: "Nova conversa",
      preview: "Conte como está sua rotina hoje.",
      updatedLabel: "Agora",
      unread: 0,
    };

    setConversations((previous) => [newConversation, ...previous]);
    setMessagesByConversation((previous) => ({
      ...previous,
      [id]: [
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content:
            "Me conta como está seu dia e eu monto o próximo passo sem te encher de perguntas.",
        },
      ],
    }));
    setActiveConversationId(id);
  };

  const startResizing = (event, target) => {
    event.preventDefault();
    isResizingRef.current = target;
    setIsResizing(target);
    const startPos = target === "horizontal" ? event.clientY : event.clientX;
    const startSize =
      target === "horizontal" ? dashHeight : target === "vertical" ? dashWidth : rightWidth;

    const onMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const currentPos = target === "horizontal" ? moveEvent.clientY : moveEvent.clientX;

      if (target === "horizontal") {
        const delta = currentPos - startPos;
        setDashHeight(Math.max(120, startSize + delta));
      } else if (target === "vertical") {
        const delta = currentPos - startPos;
        setDashWidth(Math.max(240, startSize + delta));
      } else {
        const delta = startPos - currentPos;
        const nextSize = Math.max(72, startSize + delta);
        if (nextSize < 160) {
          setIsRightCollapsed(true);
          setRightWidth(72);
        } else {
          setIsRightCollapsed(false);
          setRightWidth(nextSize);
        }
      }
    };

    const onMouseUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = target === "horizontal" ? "row-resize" : "col-resize";
  };

  const toggleRightCollapse = () => {
    setIsRightCollapsed((previous) => {
      if (!previous) {
        setRightWidth(72);
        return true;
      }
      setRightWidth(360);
      return false;
    });
  };

  const showDashboard = dashboardMode !== "hidden";
  const dashboardLayout = showDashboard ? dashboardMode : "horizontal";

  const handleToggleDashboard = () => {
    if (showDashboard && dashboardLayout === "horizontal") {
      setDashboardMode("vertical");
    } else if (showDashboard && dashboardLayout === "vertical") {
      setDashboardMode("hidden");
    } else {
      setDashboardMode("horizontal");
    }
  };

  return (
    <SidebarProvider
      defaultOpen={true}
      className="!min-h-0 h-full"
      style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "3rem" }}
    >
      <div className="flex h-full w-full font-secondary text-bodyPrimary">
        <PortalSidebar
          teams={MOCK_TEAMS}
          activeTeamId={activeTeamId}
          onTeamChange={setActiveTeamId}
          conversations={visibleConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={handleNewConversation}
        />

        <div className="relative flex min-w-[300px] flex-1 flex-col bg-navBackground">
          <div className="z-20 flex flex-shrink-0 items-center justify-end gap-2 bg-navBackground p-3">
            <button
              onClick={toggleTheme}
              className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
              title={theme === "dark" ? "Trocar para tema claro" : "Trocar para tema escuro"}
            >
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
              title="Widgets do dashboard"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleToggleDashboard}
              className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
              title="Alternar layout do dashboard"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <div
            className={cn(
              "relative flex-shrink-0 overflow-hidden bg-navBackground",
              isResizing === "horizontal" ? "" : "transition-all duration-500 ease-in-out",
              showDashboard && dashboardLayout === "horizontal"
                ? "border-b border-cardStroke opacity-100"
                : "border-transparent opacity-0"
            )}
            style={{ height: showDashboard && dashboardLayout === "horizontal" ? dashHeight : 0 }}
          >
            <div className="absolute inset-x-0 top-0" style={{ height: dashHeight }}>
              <DashboardCanva
                layout="horizontal"
                cards={widgetCards}
                onUpdateCard={handleUpdateCard}
                onRemoveWidget={handleRemoveWidget}
              />
            </div>

            {showDashboard && dashboardLayout === "horizontal" && (
              <div
                onMouseDown={(event) => startResizing(event, "horizontal")}
                className={cn(
                  "absolute bottom-0 left-0 z-20 h-2 w-full cursor-row-resize bg-gradient-to-r from-transparent via-secondaryCardStroke/50 to-transparent transition-opacity duration-300",
                  isResizing === "horizontal" ? "opacity-100" : "opacity-0 hover:opacity-100"
                )}
                style={{ bottom: -4 }}
              />
            )}
          </div>

          <div className="relative flex min-h-0 flex-1">
            <div
              className={cn(
                "relative flex-shrink-0 overflow-hidden bg-navBackground",
                isResizing === "vertical" ? "" : "transition-all duration-500 ease-in-out",
                showDashboard && dashboardLayout === "vertical"
                  ? "border-r border-cardStroke opacity-100"
                  : "border-transparent opacity-0"
              )}
              style={{ width: showDashboard && dashboardLayout === "vertical" ? dashWidth : 0 }}
            >
              <div className="absolute inset-y-0 left-0" style={{ width: dashWidth }}>
                <DashboardCanva
                  layout="vertical"
                  cards={widgetCards}
                  onUpdateCard={handleUpdateCard}
                  onRemoveWidget={handleRemoveWidget}
                />
              </div>

              {showDashboard && dashboardLayout === "vertical" && (
                <div
                  onMouseDown={(event) => startResizing(event, "vertical")}
                  className={cn(
                    "absolute right-0 top-0 z-20 h-full w-2 cursor-col-resize bg-gradient-to-b from-transparent via-secondaryCardStroke/50 to-transparent transition-opacity duration-300",
                    isResizing === "vertical" ? "opacity-100" : "opacity-0 hover:opacity-100"
                  )}
                  style={{ right: -4 }}
                />
              )}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <ChatbotUI
                conversationTitle={activeConversation?.title ?? "Conversa"}
                teamName={activeTeam.name}
                messages={messages}
                onSendMessage={handleSendMessage}
                isCentered={messages.length === 0}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative flex flex-shrink-0 flex-col overflow-hidden bg-navBackground border-l border-cardStroke",
            isResizing === "right" ? "" : "transition-all duration-500 ease-in-out"
          )}
          style={{ width: rightWidth }}
        >
          <div
            onMouseDown={(event) => startResizing(event, "right")}
            className={cn(
              "absolute left-0 top-0 z-20 h-full w-2 cursor-col-resize bg-gradient-to-b from-transparent via-secondaryCardStroke/50 to-transparent transition-opacity duration-300",
              isResizing === "right" ? "opacity-100" : "opacity-0 hover:opacity-100"
            )}
            style={{ left: -4 }}
          />

          <CatalogPanel
            activities={teamActivities}
            habits={teamHabits}
            tasks={teamTasks}
            isCollapsed={isRightCollapsed}
            onToggleCollapse={toggleRightCollapse}
            onActivityClick={handleActivityClick}
          />
        </div>

        <WidgetSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          activeWidgetIds={activeWidgetIds}
          onToggleWidget={handleToggleWidget}
          suggestedWidgetId={null}
          onDismissSuggestion={() => {}}
        />
      </div>
    </SidebarProvider>
  );
}
