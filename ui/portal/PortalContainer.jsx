"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CatalogPanel } from "./CatalogPanel";
import { DashboardCanva } from "./DashboardCanva";
import {
  PortalPanel,
  PortalPanelHeader,
  PortalResizeHandle,
  PortalShell,
} from "./PortalLayout";
import { PortalChatSession } from "./PortalChatSession";
import { WidgetSettingsDialog } from "./widgets/WidgetSettingsDialog";
import { PortalSidebar } from "./PortalSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { computeWidgetPositions, getDefaultWidgets } from "./widgets/widgetRegistry";
import { cn } from "../lib/utils";
import { LayoutGrid, Moon, Palette, PanelRightOpen, Settings, Sun } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  convertLegacyMessage,
  createAssistantMessage,
  getCoachTurnDataFromMessage,
  getMessagesSignature,
  getPreviewText,
} from "@/lib/ai/message-utils";
import {
  MOCK_CONVERSATIONS,
  MOCK_EQUIPMENT_BY_TEAM,
  MOCK_HABITS,
  MOCK_MESSAGES_BY_CONVERSATION,
  MOCK_TASKS,
  MOCK_TEAMS,
  MOCK_UPCOMING_ACTIVITIES,
} from "./mockPortalData";

const ONBOARDING_CONVERSATION = {
  id: "conv-onboarding",
  teamId: MOCK_TEAMS[0].id,
  title: "Começar agora",
  preview: "Escolha um atalho para começar.",
  updatedLabel: "Agora",
  unread: 0,
};

const LEFT_PANEL_DEFAULT_WIDTH = 264;
const LEFT_PANEL_MIN_WIDTH = 232;
const LEFT_PANEL_MAX_WIDTH = 360;
const LEFT_PANEL_COLLAPSED_WIDTH = 56;
const LEFT_PANEL_COLLAPSE_THRESHOLD = 180;

const RIGHT_PANEL_DEFAULT_WIDTH = 360;
const RIGHT_PANEL_MIN_WIDTH = 240;
const RIGHT_PANEL_MAX_WIDTH = 520;
const RIGHT_PANEL_COLLAPSED_WIDTH = 72;
const RIGHT_PANEL_COLLAPSE_THRESHOLD = 160;
const AI_MODE_STORAGE_KEY = "movimentador-ai-mode";

function getDefaultAiMode() {
  return process.env.NEXT_PUBLIC_AI_MODE_DEFAULT === "live" ? "live" : "mock";
}

function buildInitialMessagesByConversation() {
  return {
    [ONBOARDING_CONVERSATION.id]: [],
    ...Object.fromEntries(
      Object.entries(MOCK_MESSAGES_BY_CONVERSATION).map(([conversationId, messages]) => [
        conversationId,
        messages.map(convertLegacyMessage),
      ])
    ),
  };
}

const EQUIPMENT_LIBRARY = [
  { id: "treadmill", label: "Esteira", terms: ["esteira"] },
  {
    id: "standing-desk",
    label: "Mesa com altura regulável",
    terms: ["mesa com altura regulavel", "mesa regulavel", "standing desk"],
  },
  {
    id: "gym-membership",
    label: "Assinatura de academia",
    terms: ["assinatura de academia", "plano de academia"],
  },
  { id: "hand-grip", label: "Hand Grip", terms: ["hand grip", "handgrip"] },
  {
    id: "stress-ball",
    label: "Bolinha de apertar",
    terms: ["bolinha de apertar", "bolinha anti stress", "bolinha antiestresse"],
  },
];

function normalizeMessage(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildConversationTitle(message) {
  const normalized = normalizeMessage(message);

  if (normalized === "fiquei sentado o dia todo hoje") {
    return "Muito tempo sentado";
  }

  if (normalized === "sinto dores na lombar") {
    return "Lombar pedindo atenção";
  }

  if (normalized === "quero meditar") {
    return "Começar a meditar";
  }

  return message.length > 34 ? `${message.slice(0, 31)}...` : message;
}

function extractMentionedEquipment(message) {
  const normalized = normalizeMessage(message);

  return EQUIPMENT_LIBRARY.filter((item) =>
    item.terms.some((term) => normalized.includes(term))
  ).map(({ id, label }) => ({ id, label }));
}

function mergeEquipment(existingItems = [], incomingItems = []) {
  const seenIds = new Set(existingItems.map((item) => item.id));
  const nextItems = [...existingItems];

  incomingItems.forEach((item) => {
    if (seenIds.has(item.id)) return;
    seenIds.add(item.id);
    nextItems.push(item);
  });

  return nextItems;
}

function appendEquipmentNote(reply, equipmentItems = []) {
  if (equipmentItems.length === 0) {
    return reply;
  }

  const equipmentList = equipmentItems.map((item) => item.label).join(", ");

  return {
    ...reply,
    content: `${reply.content}\n\nTambém registrei em **Equipamentos**: ${equipmentList}.`,
  };
}

function buildCoachReply(content, context = {}) {
  const normalized = normalizeMessage(content);
  const topHabit = context.teamHabits?.[0];
  const topTask = context.teamTasks?.[0];
  const activityCount = context.teamActivities?.length ?? 0;

  if (normalized === "fiquei sentado o dia todo hoje") {
    return {
      content:
        "Eu começaria com um **reset de 8 minutos**: 5 minutos de caminhada leve e 3 minutos de mobilidade simples para quadril e lombar.\n\n**Por quê:** depois de muito tempo sentado, o ganho mais rápido vem de trocar de posição e reacender circulação antes de pensar em intensidade.",
      followUpQuestions: [
        "Tenho só 5 minutos agora",
        "Prefiro fazer isso em casa",
        "Quero algo sem impacto",
      ],
      suggestedActions: [
        {
          label: "Criar hábito de pausa pós-trabalho",
          message: "Criar hábito de pausa pós-trabalho.",
        },
        {
          label: "Criar tarefa de mobilidade para hoje",
          message: "Criar tarefa de mobilidade para hoje.",
        },
      ],
    };
  }

  if (normalized === "sinto dores na lombar") {
    return {
      content:
        "Eu evitaria começar com algo agressivo. Melhor testar um **bloco curto de mobilidade suave com caminhada leve** e observar se o corpo solta.\n\n**Por quê:** quando a lombar reclama, consistência leve costuma responder melhor do que um esforço grande logo de cara.\n\nSe a dor estiver forte, irradiando ou com formigamento, isso já pede avaliação profissional.",
      followUpQuestions: [
        "A dor piora quando fico sentado",
        "Quero uma versão em pé",
        "Tenho medo de forçar demais",
      ],
      suggestedActions: [
        {
          label: "Criar rotina leve para a lombar",
          message: "Criar rotina leve para a lombar.",
        },
        {
          label: "Criar check-in de mobilidade para hoje",
          message: "Criar check-in de mobilidade para hoje.",
        },
      ],
    };
  }

  if (normalized === "quero meditar") {
    return {
      content:
        "Eu começaria com **5 minutos por dia**, preso a um gatilho fixo como depois do café ou antes de dormir.\n\n**Por quê:** meditação entra melhor quando o horário já existe e a meta é pequena o suficiente para caber até em dia ruim.",
      followUpQuestions: [
        "Quero meditar de manhã",
        "Prefiro meditar à noite",
        "Quero algo guiado",
      ],
      suggestedActions: [
        {
          label: "Criar hábito de meditação",
          message: "Criar hábito de meditação de 5 minutos.",
        },
        {
          label: "Criar sessão de meditação para hoje",
          message: "Criar tarefa de meditação para hoje.",
        },
      ],
    };
  }

  if (normalized.includes("5 minutos agora")) {
    return {
      content:
        "Então eu reduziria o plano para **3 minutos andando + 2 minutos de mobilidade**. É curto o bastante para caber agora e já quebra o ciclo de ficar parado.",
      suggestedActions: [
        {
          label: "Criar tarefa de 5 minutos",
          message: "Criar tarefa de 5 minutos para hoje.",
        },
      ],
    };
  }

  if (normalized.includes("fazer isso em casa")) {
    return {
      content:
        "Em casa eu faria uma sequência sem equipamento: marcha parada, rotação leve de tronco e alongamento de quadril.\n\nO objetivo é aliviar rigidez sem depender de sair.",
      suggestedActions: [
        {
          label: "Criar rotina em casa",
          message: "Criar rotina de mobilidade em casa.",
        },
      ],
    };
  }

  if (normalized.includes("sem impacto")) {
    return {
      content:
        "Sem impacto, eu manteria tudo em pé e controlado: caminhada leve no lugar, mobilidade de quadril e respiração profunda.\n\nIsso já reduz a sensação de travamento sem sacudir a lombar.",
      suggestedActions: [
        {
          label: "Criar versão sem impacto",
          message: "Criar versão sem impacto para hoje.",
        },
      ],
    };
  }

  if (normalized.includes("piora quando fico sentado")) {
    return {
      content:
        "Nesse caso eu trataria a posição sentada como gatilho. A melhor aposta é uma **pausa curta e frequente**, não uma sessão longa isolada.\n\nAlgo como 2 minutos de levantar, andar e alongar já tende a ajudar mais.",
      suggestedActions: [
        {
          label: "Criar hábito de pausa curta",
          message: "Criar hábito de pausa curta para a lombar.",
        },
      ],
    };
  }

  if (normalized.includes("versao em pe")) {
    return {
      content:
        "Em pé, eu manteria uma sequência simples: inclinação pélvica suave, rotação de ombros e caminhada leve de 2 a 3 minutos.\n\nA ideia é soltar sem pedir amplitude demais.",
      suggestedActions: [
        {
          label: "Criar rotina em pé",
          message: "Criar rotina em pé para a lombar.",
        },
      ],
    };
  }

  if (normalized.includes("forcar demais")) {
    return {
      content:
        "Então a regra é esta: terminar melhor do que começou. Se o bloco for leve o suficiente para te deixar mais solto, ele está no ponto certo.",
      suggestedActions: [
        {
          label: "Criar check-in leve",
          message: "Criar check-in leve para a lombar.",
        },
      ],
    };
  }

  if (normalized.includes("meditar de manha")) {
    return {
      content:
        "De manhã eu prenderia isso ao café ou ao primeiro copo d'água. O melhor cenário é não abrir o dia negociando demais.",
      suggestedActions: [
        {
          label: "Criar hábito matinal",
          message: "Criar hábito matinal de meditação.",
        },
      ],
    };
  }

  if (normalized.includes("meditar a noite")) {
    return {
      content:
        "À noite eu faria o contrário: 5 minutos antes de deitar, com luz baixa e sem tela no meio. Isso ajuda a rotina a puxar o hábito.",
      suggestedActions: [
        {
          label: "Criar hábito noturno",
          message: "Criar hábito noturno de meditação.",
        },
      ],
    };
  }

  if (normalized.includes("guiado")) {
    return {
      content:
        "Guiado é uma boa porta de entrada porque reduz a fricção de decidir o que fazer. Eu começaria com uma sessão curta, sempre do mesmo tipo.",
      suggestedActions: [
        {
          label: "Criar sessão guiada",
          message: "Criar sessão guiada de meditação para hoje.",
        },
      ],
    };
  }

  if (normalized.includes("pausa pos-trabalho")) {
    return {
      content:
        "Fechado. Criei um **hábito curto de pausa pós-trabalho** para transformar o fim do dia em gatilho de movimento.\n\nA ideia é deixar a consistência mais fácil do que depender de vontade.",
    };
  }

  if (normalized.includes("mobilidade para hoje")) {
    return {
      content:
        "Perfeito. Organizei uma **tarefa de mobilidade para hoje** com um bloco curto e objetivo.\n\nEla já aparece como próximo passo para você executar sem pensar muito.",
    };
  }

  if (normalized.includes("rotina leve para a lombar")) {
    return {
      content:
        "Fechado. Criei uma **rotina leve para a lombar** com foco em consistência e movimento suave.\n\nO objetivo é te deixar melhor no final do bloco, não mais cansado.",
    };
  }

  if (normalized.includes("check-in de mobilidade") || normalized.includes("check-in leve")) {
    return {
      content:
        "Pronto. Montei um **check-in curto de mobilidade** para hoje.\n\nEle serve mais para medir resposta do corpo do que para puxar performance.",
    };
  }

  if (
    normalized.includes("meditacao de 5 minutos") ||
    normalized.includes("habito matinal de meditacao") ||
    normalized.includes("habito noturno de meditacao")
  ) {
    return {
      content:
        "Fechado. Criei um **hábito diário de meditação de 5 minutos**.\n\nCurto o bastante para caber na rotina e estável o bastante para virar base.",
    };
  }

  if (
    normalized.includes("meditacao para hoje") ||
    normalized.includes("sessao guiada de meditacao") ||
    normalized.includes("sessao guiada")
  ) {
    return {
      content:
        "Perfeito. Deixei uma **sessão curta de meditação para hoje** pronta como próximo passo.\n\nA ideia é começar simples e sem abrir espaço para negociação.",
    };
  }

  if (normalized.includes("rotina de mobilidade em casa")) {
    return {
      content:
        "Fechado. Criei uma **rotina de mobilidade em casa** para você usar sem depender de sair.\n\nIsso reduz atrito e aumenta a chance de repetir amanhã também.",
    };
  }

  if (normalized.includes("versao sem impacto")) {
    return {
      content:
        "Pronto. Organizei uma **versão sem impacto para hoje**.\n\nEla mantém o corpo em movimento sem adicionar carga desnecessária.",
    };
  }

  if (normalized.includes("habito de pausa curta")) {
    return {
      content:
        "Fechado. Criei um **hábito de pausa curta** para quebrar o tempo sentado ao longo do dia.\n\nNesse caso, frequência ganha de duração.",
    };
  }

  if (normalized.includes("rotina em pe para a lombar")) {
    return {
      content:
        "Perfeito. Criei uma **rotina em pé para a lombar** com movimentos controlados e curtos.\n\nÉ uma forma mais segura de ganhar mobilidade sem exagerar na amplitude.",
    };
  }

  if (normalized.includes("tarefa de 5 minutos para hoje")) {
    return {
      content:
        "Pronto. Deixei um **reset de 5 minutos para hoje** como próximo passo.\n\nÉ o menor bloco útil para interromper o ciclo de ficar parado.",
    };
  }

  if (normalized.includes("visao geral")) {
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

  if (normalized.includes("desafiar")) {
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

  if (normalized.includes("pouco tempo") || normalized.includes("corrido")) {
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

  if (normalized.includes("semana")) {
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

  if (normalized.includes("parado") || normalized.includes("sedent")) {
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

  if (normalized.includes("passo")) {
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
  const normalized = normalizeMessage(message);
  const now = Date.now();

  if (normalized.includes("tarefa") && !normalized.includes("meditacao") && !normalized.includes("mobilidade")) {
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

  if (normalized.includes("pausa pos-trabalho")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Pausa pós-trabalho",
        cadence: "Diário",
        targetLabel: "8 min",
        progress: 0,
        progressLabel: "0 de 8 min",
        statusLabel: "Começa hoje",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Pausa pós-trabalho",
        description: "Um reset curto para destravar o corpo depois de ficar sentado.",
        meta: "8 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("mobilidade para hoje")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Mobilidade para destravar hoje",
        description: "Fazer um bloco curto de caminhada leve e mobilidade antes do fim do dia.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Mobilidade para destravar hoje",
        description: "Um bloco curto já ajuda a sair do excesso de tempo sentado.",
        meta: "8 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("rotina leve para a lombar")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Rotina leve para a lombar",
        cadence: "Diário",
        targetLabel: "6 min",
        progress: 0,
        progressLabel: "0 de 6 min",
        statusLabel: "Movimento suave",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Rotina leve para a lombar",
        description: "Uma sequência curta para aliviar rigidez sem exagerar.",
        meta: "6 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (
    normalized.includes("check-in de mobilidade") ||
    normalized.includes("check-in leve")
  ) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Check-in de mobilidade",
        description: "Testar um bloco leve e observar se a lombar termina melhor do que começou.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Check-in de mobilidade",
        description: "Um check-in curto para avaliar como a lombar responde ao movimento leve.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (
    normalized.includes("meditacao de 5 minutos") ||
    normalized.includes("habito matinal de meditacao") ||
    normalized.includes("habito noturno de meditacao")
  ) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Meditação diária",
        cadence: "Diário",
        targetLabel: "5 min",
        progress: 0,
        progressLabel: "0 de 5 min",
        statusLabel: "Começa hoje",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Meditação diária",
        description: "Uma sessão curta e fixa para ganhar consistência sem pesar.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (
    normalized.includes("meditacao para hoje") ||
    normalized.includes("sessao guiada de meditacao") ||
    normalized.includes("sessao guiada")
  ) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Sessão curta de meditação",
        description: "Separar alguns minutos ainda hoje para respirar e desacelerar.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Sessão curta de meditação",
        description: "Uma sessão curta para começar hoje sem complicar.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("rotina de mobilidade em casa")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Mobilidade em casa",
        cadence: "Diário",
        targetLabel: "6 min",
        progress: 0,
        progressLabel: "0 de 6 min",
        statusLabel: "Pronta para hoje",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Mobilidade em casa",
        description: "Sequência simples para destravar o corpo sem sair.",
        meta: "6 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("versao sem impacto")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Versão sem impacto",
        description: "Executar uma sequência leve em pé, sem saltos e sem pressa.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Versão sem impacto",
        description: "Plano curto para sair da rigidez sem impacto.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("habito de pausa curta")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Pausa curta para a lombar",
        cadence: "Diário",
        targetLabel: "2 min",
        progress: 0,
        progressLabel: "0 de 2 min",
        statusLabel: "Repetir ao longo do dia",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Pausa curta para a lombar",
        description: "Uma pausa curta e frequente tende a ajudar mais do que esperar demais.",
        meta: "2 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("rotina em pe para a lombar")) {
    return {
      habit: {
        id: `habit-${now}`,
        teamId,
        name: "Rotina em pé para a lombar",
        cadence: "Diário",
        targetLabel: "5 min",
        progress: 0,
        progressLabel: "0 de 5 min",
        statusLabel: "Movimento controlado",
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "habit",
        title: "Rotina em pé para a lombar",
        description: "Sequência curta em pé para soltar sem exagerar.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("tarefa de 5 minutos para hoje")) {
    return {
      task: {
        id: `task-${now}`,
        teamId,
        title: "Reset de 5 minutos",
        description: "Fazer 3 minutos andando e 2 minutos de mobilidade ainda hoje.",
        whenLabel: "Hoje",
        status: "Hoje",
        linkedConversationId,
      },
      activity: {
        id: `next-${now}`,
        teamId,
        type: "task",
        title: "Reset de 5 minutos",
        description: "Bloco mínimo para quebrar o excesso de tempo sentado.",
        meta: "5 min",
        whenLabel: "Hoje",
        linkedConversationId,
      },
    };
  }

  if (normalized.includes("resgate")) {
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

  if (normalized.includes("plano de semana")) {
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

  if (normalized.includes("habito diario")) {
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

  if (normalized.includes("desafio leve") || normalized.includes("ajustar so o habito")) {
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

function DashboardDock({ active, axis, children, onResizeStart, size, visible }) {
  const isHorizontal = axis === "horizontal";

  return (
    <PortalPanel
      className={cn(
        "flex-shrink-0",
        active ? "" : "transition-all duration-500 ease-in-out",
        visible
          ? isHorizontal
            ? "border-b border-cardStroke opacity-100"
            : "border-r border-cardStroke opacity-100"
          : "border-transparent opacity-0"
      )}
      style={isHorizontal ? { height: visible ? size : 0 } : { width: visible ? size : 0 }}
    >
      <div
        className={cn("absolute", isHorizontal ? "inset-x-0 top-0" : "inset-y-0 left-0")}
        style={isHorizontal ? { height: size } : { width: size }}
      >
        {children}
      </div>

      {visible && (
        <PortalResizeHandle
          active={active}
          orientation={axis}
          onMouseDown={onResizeStart}
        />
      )}
    </PortalPanel>
  );
}

export function PortalContainer() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  const [activeTeamId, setActiveTeamId] = useState(MOCK_TEAMS[0].id);
  const [conversations, setConversations] = useState(() => [
    ONBOARDING_CONVERSATION,
    ...MOCK_CONVERSATIONS,
  ]);
  const [draftConversation, setDraftConversation] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState(buildInitialMessagesByConversation);
  const [equipmentByTeam, setEquipmentByTeam] = useState(MOCK_EQUIPMENT_BY_TEAM);
  const [habits, setHabits] = useState(MOCK_HABITS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [upcomingActivities, setUpcomingActivities] = useState(MOCK_UPCOMING_ACTIVITIES);
  const [activeConversationId, setActiveConversationId] = useState(ONBOARDING_CONVERSATION.id);
  const [hasCreatedFirstItem, setHasCreatedFirstItem] = useState(false);
  const [aiMode, setAiMode] = useState(getDefaultAiMode);

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(LEFT_PANEL_DEFAULT_WIDTH);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(RIGHT_PANEL_DEFAULT_WIDTH);
  const [dashboardMode, setDashboardMode] = useState("hidden");
  const [dashHeight, setDashHeight] = useState(180);
  const [dashWidth, setDashWidth] = useState(RIGHT_PANEL_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileRightPanelOpen, setIsMobileRightPanelOpen] = useState(false);

  const [activeWidgetIds, setActiveWidgetIds] = useState(getDefaultWidgets());
  const [widgetCards, setWidgetCards] = useState(() =>
    computeWidgetPositions({ widgetIds: getDefaultWidgets() })
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isResizingRef = useRef(false);
  const leftExpandedWidthRef = useRef(LEFT_PANEL_DEFAULT_WIDTH);
  const rightExpandedWidthRef = useRef(RIGHT_PANEL_DEFAULT_WIDTH);

  const visibleConversations = conversations.filter(
    (conversation) => conversation.teamId === activeTeamId
  );
  const activeDraftConversation =
    draftConversation?.teamId === activeTeamId ? draftConversation : null;

  useEffect(() => {
    if (activeConversationId === activeDraftConversation?.id) {
      return;
    }

    if (!visibleConversations.some((conversation) => conversation.id === activeConversationId)) {
      setActiveConversationId(visibleConversations[0]?.id ?? null);
    }
  }, [activeConversationId, activeDraftConversation, visibleConversations]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(AI_MODE_STORAGE_KEY);
    if (storedMode === "mock" || storedMode === "live") {
      setAiMode(storedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AI_MODE_STORAGE_KEY, aiMode);
  }, [aiMode]);

  const activeConversation =
    (activeDraftConversation?.id === activeConversationId ? activeDraftConversation : null) ??
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    visibleConversations[0] ??
    null;
  const messages = activeConversation
    ? messagesByConversation[activeConversation.id] ?? []
    : [];
  const teamEquipment = equipmentByTeam[activeTeamId] ?? [];
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

  const updateConversationFromUserMessage = useCallback((conversationId, content) => {
    const isDraftConversation = draftConversation?.id === conversationId;
    const nextTitle = buildConversationTitle(content);

    if (isDraftConversation) {
      const persistedConversation = {
        ...draftConversation,
        title: nextTitle,
        preview: content,
        updatedLabel: "Agora",
        unread: 0,
      };

      setConversations((previous) => [persistedConversation, ...previous]);
      setDraftConversation(null);
      return;
    }

    const shouldRenameConversation =
      conversationId === ONBOARDING_CONVERSATION.id || activeConversation?.title === "Nova conversa";

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title: shouldRenameConversation
                ? nextTitle
                : conversation.title,
              preview: content,
              updatedLabel: "Agora",
              unread: 0,
            }
          : conversation
      )
    );
  }, [activeConversation?.title, draftConversation]);

  const updateConversationPreview = useCallback((conversationId, preview) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, preview, updatedLabel: "Agora", unread: 0 }
          : conversation
      )
    );
  }, []);

  const createConversation = useCallback(({
    title = "Nova conversa",
    preview = "Conte como está sua rotina hoje.",
  } = {}) => {
    const id = `conv-${Date.now()}`;
    const newConversation = {
      id,
      teamId: activeTeamId,
      title,
      preview,
      updatedLabel: "Agora",
      unread: 0,
    };

    setDraftConversation(newConversation);
    setMessagesByConversation((previous) => ({
      ...previous,
      [id]: [],
    }));
    setActiveConversationId(id);
  }, [activeTeamId]);

  const syncConversationMessages = useCallback((conversationId, nextMessages) => {
    setMessagesByConversation((previous) => {
      const currentMessages = previous[conversationId] ?? [];
      if (getMessagesSignature(currentMessages) === getMessagesSignature(nextMessages)) {
        return previous;
      }

      return {
        ...previous,
        [conversationId]: nextMessages,
      };
    });
  }, []);

  const applyCoachOperations = useCallback((operations = []) => {
    let createdPrimaryItem = false;

    operations.forEach((operation) => {
      if (operation.type === "create_habit") {
        createdPrimaryItem = true;
        setHabits((previous) => [operation.habit, ...previous]);
        if (operation.activity) {
          setUpcomingActivities((previous) => [operation.activity, ...previous]);
        }
      }

      if (operation.type === "create_task") {
        createdPrimaryItem = true;
        setTasks((previous) => [operation.task, ...previous]);
        if (operation.activity) {
          setUpcomingActivities((previous) => [operation.activity, ...previous]);
        }
      }

      if (operation.type === "create_activity") {
        setUpcomingActivities((previous) => [operation.activity, ...previous]);
      }

      if (operation.type === "add_equipment") {
        setEquipmentByTeam((previous) => ({
          ...previous,
          [activeTeamId]: mergeEquipment(previous[activeTeamId] ?? [], operation.equipmentItems),
        }));
      }
    });

    if (createdPrimaryItem) {
      setHasCreatedFirstItem(true);
      setIsRightCollapsed(false);
      setRightWidth(rightExpandedWidthRef.current);
    }
  }, [activeTeamId]);

  const handleUserMessage = useCallback(({ conversationId, text }) => {
    updateConversationFromUserMessage(conversationId, text);
  }, [updateConversationFromUserMessage]);

  const handleAssistantTurn = useCallback(({ conversationId, message }) => {
    updateConversationPreview(conversationId, getPreviewText(message));
    const coachTurn = getCoachTurnDataFromMessage(message);
    applyCoachOperations(coachTurn.operations);
  }, [applyCoachOperations, updateConversationPreview]);

  const toggleAiMode = useCallback(() => {
    setAiMode((previous) => (previous === "mock" ? "live" : "mock"));
  }, []);

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
        createAssistantMessage({
          text: detailMessage,
          id: `detail-${Date.now()}`,
        }),
      ],
    }));
    updateConversationPreview(conversationId, detailMessage.replace(/\n/g, " "));
  };

  const handleSelectConversation = useCallback((conversationId) => {
    setDraftConversation((previous) =>
      previous?.id === activeConversationId ? null : previous
    );
    setActiveConversationId(conversationId);
  }, [activeConversationId]);

  const handleNewConversation = () => {
    createConversation();
  };

  const startResizing = (event, target) => {
    event.preventDefault();
    isResizingRef.current = target;
    setIsResizing(target);
    const startPos = target === "horizontal" ? event.clientY : event.clientX;
    const startSize =
      target === "horizontal"
        ? dashHeight
        : target === "vertical"
          ? dashWidth
          : target === "left"
            ? leftWidth
            : rightWidth;

    const onMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const currentPos = target === "horizontal" ? moveEvent.clientY : moveEvent.clientX;

      if (target === "horizontal") {
        const delta = currentPos - startPos;
        setDashHeight(Math.max(120, startSize + delta));
      } else if (target === "vertical") {
        const delta = currentPos - startPos;
        setDashWidth(Math.max(240, startSize + delta));
      } else if (target === "left") {
        const delta = currentPos - startPos;
        const rawNextSize = Math.min(
          LEFT_PANEL_MAX_WIDTH,
          Math.max(LEFT_PANEL_COLLAPSED_WIDTH, startSize + delta)
        );

        if (rawNextSize <= LEFT_PANEL_COLLAPSE_THRESHOLD) {
          setIsLeftCollapsed(true);
          setLeftWidth(LEFT_PANEL_COLLAPSED_WIDTH);
        } else {
          const expandedSize = Math.max(LEFT_PANEL_MIN_WIDTH, rawNextSize);
          leftExpandedWidthRef.current = expandedSize;
          setIsLeftCollapsed(false);
          setLeftWidth(expandedSize);
        }
      } else {
        const delta = startPos - currentPos;
        const rawNextSize = Math.min(
          RIGHT_PANEL_MAX_WIDTH,
          Math.max(RIGHT_PANEL_COLLAPSED_WIDTH, startSize + delta)
        );

        if (rawNextSize <= RIGHT_PANEL_COLLAPSE_THRESHOLD) {
          setIsRightCollapsed(true);
          setRightWidth(RIGHT_PANEL_COLLAPSED_WIDTH);
        } else {
          const expandedSize = Math.max(RIGHT_PANEL_MIN_WIDTH, rawNextSize);
          rightExpandedWidthRef.current = expandedSize;
          setIsRightCollapsed(false);
          setRightWidth(expandedSize);
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

  const toggleLeftCollapse = () => {
    setIsLeftCollapsed((previous) => {
      if (!previous) {
        setLeftWidth(LEFT_PANEL_COLLAPSED_WIDTH);
        return true;
      }

      setLeftWidth(leftExpandedWidthRef.current);
      return false;
    });
  };

  const toggleRightCollapse = () => {
    setIsRightCollapsed((previous) => {
      if (!previous) {
        setRightWidth(RIGHT_PANEL_COLLAPSED_WIDTH);
        return true;
      }

      setRightWidth(rightExpandedWidthRef.current);
      return false;
    });
  };

  const showConversationSidebar = true;
  const showRightPanel = hasCreatedFirstItem;
  const showDashboard = showConversationSidebar && dashboardMode !== "hidden";
  const dashboardLayout = showDashboard
    ? isMobile && dashboardMode === "vertical"
      ? "horizontal"
      : dashboardMode
    : "horizontal";

  const handleToggleDashboard = () => {
    if (isMobile) {
      setDashboardMode((previous) => (previous === "hidden" ? "horizontal" : "hidden"));
      return;
    }

    if (showDashboard && dashboardLayout === "horizontal") {
      setDashboardMode("vertical");
    } else if (showDashboard && dashboardLayout === "vertical") {
      setDashboardMode("hidden");
    } else {
      setDashboardMode("horizontal");
    }
  };

  useEffect(() => {
    if (!showRightPanel || !isMobile) {
      setIsMobileRightPanelOpen(false);
    }
  }, [isMobile, showRightPanel]);

  const utilityButtons = (
    <>
      <button
        onClick={toggleAiMode}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          aiMode === "mock"
            ? "bg-hAccent/15 text-hAccent hover:bg-hAccent/20"
            : "text-icons hover:bg-cardBackgroundHover hover:text-title"
        )}
        title={aiMode === "mock" ? "Modo mock ativo" : "Ativar modo mock"}
      >
        <Palette size={18} />
      </button>
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
    </>
  );

  return (
    <SidebarProvider
      open={!isLeftCollapsed}
      onOpenChange={(open) => {
        setIsLeftCollapsed(!open);
        setLeftWidth(open ? leftExpandedWidthRef.current : LEFT_PANEL_COLLAPSED_WIDTH);
      }}
      className="!min-h-0 h-full"
      style={{
        "--sidebar-width": `${leftWidth}px`,
        "--sidebar-width-icon": `${LEFT_PANEL_COLLAPSED_WIDTH}px`,
      }}
    >
      <PortalShell>
        {showConversationSidebar && (
          <PortalSidebar
            teams={MOCK_TEAMS}
            activeTeamId={activeTeamId}
            onTeamChange={setActiveTeamId}
            equipmentItems={teamEquipment}
            conversations={visibleConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onToggleCollapse={toggleLeftCollapse}
            onResizeStart={(event) => startResizing(event, "left")}
          />
        )}

        <PortalPanel className="min-w-[300px] flex-1">
          {showConversationSidebar && (
            <PortalPanelHeader
              className={cn(
                "z-20 p-3",
                isMobile ? "flex-col items-stretch border-b border-cardStroke" : "justify-end border-b-0"
              )}
            >
              {isMobile ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <SidebarTrigger className="rounded-md text-icons hover:bg-cardBackgroundHover hover:text-hAccent" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-title">Movimentador</p>
                        <p className="truncate text-2xs text-subtitle">
                          {activeConversation?.title ?? "Nova conversa"}
                        </p>
                      </div>
                    </div>
                    {showRightPanel && (
                      <button
                        onClick={() => setIsMobileRightPanelOpen(true)}
                        className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
                        title="Abrir próximas atividades"
                      >
                        <PanelRightOpen size={18} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {utilityButtons}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {utilityButtons}
                </div>
              )}
            </PortalPanelHeader>
          )}

          <DashboardDock
            active={isResizing === "horizontal"}
            axis="horizontal"
            visible={showDashboard && dashboardLayout === "horizontal"}
            size={dashHeight}
            onResizeStart={(event) => startResizing(event, "horizontal")}
          >
            <DashboardCanva
              layout="horizontal"
              cards={widgetCards}
              onUpdateCard={handleUpdateCard}
              onRemoveWidget={handleRemoveWidget}
            />
          </DashboardDock>

          <div className="relative flex min-h-0 flex-1">
            <DashboardDock
              active={isResizing === "vertical"}
              axis="vertical"
              visible={showDashboard && dashboardLayout === "vertical"}
              size={dashWidth}
              onResizeStart={(event) => startResizing(event, "vertical")}
            >
              <DashboardCanva
                layout="vertical"
                cards={widgetCards}
                onUpdateCard={handleUpdateCard}
                onRemoveWidget={handleRemoveWidget}
              />
            </DashboardDock>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <PortalChatSession
                key={activeConversation?.id ?? "empty"}
                conversationId={activeConversation?.id ?? "empty"}
                initialMessages={messages}
                mode={aiMode}
                teamId={activeTeamId}
                context={{
                  habits: teamHabits,
                  tasks: teamTasks,
                  upcomingActivities: teamActivities,
                  equipmentItems: teamEquipment,
                  activeConversationTitle: activeConversation?.title ?? "Nova conversa",
                }}
                isCentered={!showConversationSidebar || messages.length === 0}
                onUserMessage={handleUserMessage}
                onMessagesSync={syncConversationMessages}
                onAssistantTurn={handleAssistantTurn}
              />
            </div>
          </div>
        </PortalPanel>

        {showRightPanel && !isMobile && (
          <PortalPanel
            className={cn(
              "flex-shrink-0 border-l border-cardStroke",
              isResizing === "right" ? "" : "transition-all duration-500 ease-in-out"
            )}
            style={{ width: rightWidth }}
          >
            <PortalResizeHandle
              onMouseDown={(event) => startResizing(event, "right")}
              active={isResizing === "right"}
              variant="edge"
            />

            <CatalogPanel
              activities={teamActivities}
              habits={teamHabits}
              tasks={teamTasks}
              isCollapsed={isRightCollapsed}
              onToggleCollapse={toggleRightCollapse}
              onActivityClick={handleActivityClick}
            />
          </PortalPanel>
        )}

        {showRightPanel && isMobile && (
          <Sheet open={isMobileRightPanelOpen} onOpenChange={setIsMobileRightPanelOpen}>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[66vw] max-w-none border-l border-cardStroke bg-navBackground p-0 text-bodyPrimary sm:max-w-none"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Próximas atividades</SheetTitle>
                <SheetDescription>Abre o painel lateral com hábitos, tarefas e insights.</SheetDescription>
              </SheetHeader>
              <CatalogPanel
                activities={teamActivities}
                habits={teamHabits}
                tasks={teamTasks}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileRightPanelOpen(false)}
                onActivityClick={(activity) => {
                  setIsMobileRightPanelOpen(false);
                  handleActivityClick(activity);
                }}
              />
            </SheetContent>
          </Sheet>
        )}

        <WidgetSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          activeWidgetIds={activeWidgetIds}
          onToggleWidget={handleToggleWidget}
          suggestedWidgetId={null}
          onDismissSuggestion={() => {}}
        />
      </PortalShell>
    </SidebarProvider>
  );
}
