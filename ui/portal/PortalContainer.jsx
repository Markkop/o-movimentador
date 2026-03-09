"use client";

import { useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChatbotUI } from "./ChatbotUI";
import { CatalogPanel } from "./CatalogPanel";
import { DashboardCanva } from "./DashboardCanva";
import { WidgetSettingsDialog } from "./widgets/WidgetSettingsDialog";
import { PortalSidebar } from "./PortalSidebar";
import { ActivityDetailDialog } from "./ActivityDetailDialog";
import { SidebarProvider } from "../components/ui/sidebar";
import {
  getDefaultWidgets,
  computeWidgetPositions,
  getSuggestedWidgetForTool,
} from "./widgets/widgetRegistry";
import { getActiveRecommendations, RECOMMENDATIONS } from "./recommendations";
import { cn } from "../lib/utils";
import { Settings, LayoutGrid, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";

const SAMPLE_ASSETS = [
  { name: "Caminhada de 10 minutos", type: "Caminhada", description: "Um primeiro hábito simples baseado em caminhadas curtas todos os dias." },
  { name: "Pós-almoço em movimento", type: "Rotina", description: "Um gatilho leve para sair da cadeira depois do almoço." },
  { name: "Guia alimentar simples", type: "Guia alimentar", description: "Refeições fáceis que sustentam energia para se movimentar." },
  { name: "Desligamento da noite", type: "Plano de sono", description: "Uma rotina curta para recuperar melhor e facilitar o dia seguinte." },
  { name: "Tênis perto da porta", type: "Ambiente", description: "Uma mudança pequena no ambiente que reduz atrito para começar." },
  { name: "Garrafa visível na mesa", type: "Ambiente", description: "Um lembrete visual que ajuda pausas de movimento e hidratação." },
  { name: "Reset de mobilidade", type: "Caminhada", description: "Uma sequência curta para tardes travadas ou de pouca energia." },
  { name: "Começo leve da manhã", type: "Rotina", description: "Um começo de dia que troca tela por movimento simples." },
  { name: "Checklist de hidratação", type: "Checklist", description: "Uma lista enxuta para sustentar energia e constância." },
  { name: "Agenda real da semana", type: "Agenda semanal", description: "Uma visão prática de onde os blocos de movimento cabem." },
  { name: "Notas da semana", type: "Diário", description: "Uma revisão rápida das vitórias, travas e do ritmo da semana." },
  { name: "Revisão do coach - Semana 1", type: "Jornada", description: "Uma revisão anterior com padrões, vitórias e pontos de atrito." },
];

const ASSET_TYPE_ACTIONS = {
  Caminhada: [
    { label: "Montar semana 1", message: "Sim, monta minha semana 1 de movimento", toolId: "activation-plan" },
    { label: "Diminuir o primeiro passo", message: "Me ajuda a diminuir o primeiro passo", toolId: "momentum-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  Rotina: [
    { label: "Criar rotina repetível", message: "Sim, cria uma rotina repetível a partir disso", toolId: "activation-plan" },
    { label: "Encontrar meus atritos", message: "Encontra os pontos de atrito dessa rotina", toolId: "momentum-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  "Guia alimentar": [
    { label: "Checar energia", message: "Sim, vê se isso sustenta minha energia e meu movimento", toolId: "consistency-check" },
    { label: "Simplificar refeições", message: "Me ajuda a simplificar essas refeições para manter constância", toolId: "consistency-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  "Plano de sono": [
    { label: "Montar reset de sono", message: "Sim, monta um reset de sono a partir disso", toolId: "sleep-reset" },
    { label: "Reduzir atrito noturno", message: "Me mostra onde a rotina da noite está difícil demais", toolId: "sleep-reset" },
    { label: "Agora não", message: "Agora não" },
  ],
  Ambiente: [
    { label: "Checar meu setup", message: "Sim, checa se esse setup favorece o movimento", toolId: "momentum-check" },
    { label: "Sugerir mudanças fáceis", message: "Sugere mudanças simples no ambiente para manter constância", toolId: "momentum-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  "Agenda semanal": [
    { label: "Encontrar janelas", message: "Sim, encontra janelas de movimento nessa agenda", toolId: "activation-plan" },
    { label: "Proteger meu melhor horário", message: "Me ajuda a proteger meu melhor horário para me mover", toolId: "momentum-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  Checklist: [
    { label: "Enxugar checklist", message: "Sim, enxuga esse checklist até virar um gatilho diário", toolId: "consistency-check" },
    { label: "Remover etapas extras", message: "Me ajuda a remover etapas extras desse checklist", toolId: "consistency-check" },
    { label: "Agora não", message: "Agora não" },
  ],
  Diário: [
    { label: "Revisar minha semana", message: "Sim, revisa minha semana e me mostra o padrão", toolId: "coach-review" },
    { label: "Achar pequenas vitórias", message: "Me mostra as pequenas vitórias nesse diário", toolId: "coach-review" },
    { label: "Agora não", message: "Agora não" },
  ],
  Jornada: [
    { label: "Revisar check-in", message: "Sim, revisa o check-in anterior do coach", toolId: "coach-review" },
    { label: "Planejar próxima fase", message: "Planeja a próxima fase a partir dessa jornada", toolId: "coach-review" },
    { label: "Agora não", message: "Agora não" },
  ],
};

const ASSET_TYPE_PROMPTS = {
  Caminhada: "Quer que eu transforme isso em um **plano simples para a primeira semana**?",
  Rotina: "Quer que eu **simplifique essa rotina** para ela ficar mais repetível?",
  "Guia alimentar": "Quer que eu **veja se isso sustenta sua energia e seu movimento**?",
  "Plano de sono": "Quer que eu **monte um reset noturno mais leve** a partir disso?",
  Ambiente: "Quer que eu **sugira mudanças fáceis no ambiente** para começar a se mover com menos atrito?",
  "Agenda semanal": "Quer que eu **encontre os melhores blocos de tempo para movimento** nessa agenda?",
  Checklist: "Quer que eu **enxugue esse checklist até virar um gatilho diário leve**?",
  Diário: "Quer que eu **revise sua semana e puxe o padrão principal**?",
  Jornada: "Quer que eu **revise as vitórias e os atritos** dessa jornada?",
};

export function PortalContainer() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const recommendationParam = searchParams.get("recommendation");
  const activeRecommendations = getActiveRecommendations({ recommendationParam });
  const [dismissedRecommendations, setDismissedRecommendations] = useState([]);

  const [assets, setAssets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(350);
  const [dashboardMode, setDashboardMode] = useState("horizontal");
  const [dashHeight, setDashHeight] = useState(150);
  const [dashWidth, setDashWidth] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [toolTaskSpawned, setToolTaskSpawned] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  // Widget state
  const [activeWidgetIds, setActiveWidgetIds] = useState(getDefaultWidgets());
  const [widgetCards, setWidgetCards] = useState(() =>
    computeWidgetPositions({ widgetIds: getDefaultWidgets() })
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [suggestedWidgetId, setSuggestedWidgetId] = useState(null);

  const assetIndexRef = useRef(0);
  const isResizingRef = useRef(false);
  const catalogRef = useRef(null);
  const lastActionContextRef = useRef(null);

  const getNextAsset = () => {
    const sample = SAMPLE_ASSETS[assetIndexRef.current % SAMPLE_ASSETS.length];
    assetIndexRef.current += 1;
    return { id: Date.now(), ...sample, checked: true };
  };

  // Widget management
  const handleToggleWidget = useCallback(({ widgetId }) => {
    setActiveWidgetIds((prev) => {
      const isActive = prev.includes(widgetId);
      const next = isActive ? prev.filter((id) => id !== widgetId) : [...prev, widgetId];
      setWidgetCards(computeWidgetPositions({ widgetIds: next }));
      return next;
    });
    if (widgetId === suggestedWidgetId) {
      setSuggestedWidgetId(null);
    }
  }, [suggestedWidgetId]);

  const handleRemoveWidget = useCallback((widgetId) => {
    setActiveWidgetIds((prev) => {
      const next = prev.filter((id) => id !== widgetId);
      setWidgetCards(computeWidgetPositions({ widgetIds: next }));
      return next;
    });
  }, []);

  const handleUpdateCard = useCallback((id, newProps) => {
    setWidgetCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...newProps } : card))
    );
  }, []);

  const handleDismissSuggestion = useCallback(() => {
    setSuggestedWidgetId(null);
  }, []);

  const handleToolTriggered = useCallback(({ toolId }) => {
    const suggested = getSuggestedWidgetForTool({ toolId });
    if (suggested && !activeWidgetIds.includes(suggested.id)) {
      setSuggestedWidgetId(suggested.id);
    }
  }, [activeWidgetIds]);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setActivityDialogOpen(true);
  };

  const startResizing = (e, target) => {
    e.preventDefault();
    isResizingRef.current = target;
    setIsResizing(target);
    const startPos = target === "horizontal" ? e.clientY : e.clientX;

    let startSize;
    if (target === "horizontal") startSize = dashHeight;
    else if (target === "vertical") startSize = dashWidth;
    else if (target === "right") startSize = rightWidth;

    const onMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const currentPos = target === "horizontal" ? moveEvent.clientY : moveEvent.clientX;

      if (target === "horizontal") {
        const delta = currentPos - startPos;
        setDashHeight(Math.max(100, startSize + delta));
      } else if (target === "vertical") {
        const delta = currentPos - startPos;
        setDashWidth(Math.max(100, startSize + delta));
      } else if (target === "right") {
        const delta = startPos - currentPos;
        const newSize = Math.max(56, startSize + delta);
        if (newSize < 150) {
          if (!isRightCollapsed) setIsRightCollapsed(true);
          setRightWidth(56);
        } else {
          if (isRightCollapsed) setIsRightCollapsed(false);
          setRightWidth(newSize);
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

  const visibleRecommendations = activeRecommendations.filter(
    (r) => !dismissedRecommendations.includes(r.id)
  );

  const handleRecommendationClick = ({ recommendationId }) => {
    const rec = RECOMMENDATIONS[recommendationId];
    if (!rec) return;

    setDismissedRecommendations((prev) => [...prev, recommendationId]);

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: rec.userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `${rec.summary}\n\n${rec.detail}`,
          suggestedActions: rec.actions,
        },
      ]);
    }, 800);
  };

  const handleSendMessage = (content, attachedAssets = []) => {
    const messageContent = content.trim() || `Anexei ${attachedAssets.length} hábito(s)`;

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: messageContent,
      attachedAssets,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      let aiResponseContent = "Recebi sua mensagem. Vamos transformar movimento em algo leve, viável e repetível.";
      let aiSuggestedActions = null;

      const contentLower = content.toLowerCase();

      // Check if this matches a recommendation action
      const matchedRecommendationAction = Object.values(RECOMMENDATIONS)
        .flatMap((rec) => rec.actions)
        .find((a) => a.message === content);

      const actionContext = lastActionContextRef.current;
      const matchedAction = actionContext
        ? Object.values(ASSET_TYPE_ACTIONS)
            .flat()
            .find((a) => a.message === content && a.toolId)
        : null;

      if (matchedAction && actionContext) {
        const { toolId } = matchedAction;
        const { asset } = actionContext;
        lastActionContextRef.current = null;

        setToolTaskSpawned(true);
        setIsRightCollapsed(false);
        setRightWidth(350);

        setTimeout(() => {
          catalogRef.current?.spawnTaskByToolId({ toolId, asset });
        }, 100);

        handleToolTriggered({ toolId });

        aiResponseContent = `Comecei **${matchedAction.label}** para **${asset.name}**. Você pode acompanhar no painel de **Próximas atividades**.`;
      } else if (matchedRecommendationAction) {
        aiResponseContent = `Perfeito. Vou **${matchedRecommendationAction.label.toLowerCase()}** para você agora, e o progresso vai aparecer no painel de **Próximas atividades**.`;
      } else if (content === "Agora não" || content === "Valeu, eu resolvo isso manualmente" || content === "Anotado, obrigado" || content === "Depois eu adiciono esse plano B" || content === "Pular por enquanto") {
        lastActionContextRef.current = null;
        aiResponseContent = "Sem problema. Quando você quiser, a gente deixa o próximo passo ainda menor e mais fácil.";
      } else if (
        contentLower.includes("sedent") ||
        contentLower.includes("rotina") ||
        contentLower.includes("baixa energia")
      ) {
        aiResponseContent = "Boa. Vamos começar pelo que seu dia real permite.\n\nArraste hábitos e materiais aqui embaixo para continuar.";
      } else if (contentLower.includes("hábito") && contentLower.includes("adicionado")) {
        aiResponseContent = "Perfeito. Agora me diga qual padrão você quer construir primeiro.";
      } else if (attachedAssets.length > 0) {
        const lastAsset = attachedAssets[attachedAssets.length - 1];
        const assetNames = attachedAssets.map((a) => `**${a.name}**`).join(", ");
        const prompt = ASSET_TYPE_PROMPTS[lastAsset?.type] ?? "O que você quer construir a partir disso?";
        const actions = ASSET_TYPE_ACTIONS[lastAsset?.type] ?? [
          { label: "Sim", message: "Sim, pode seguir" },
          { label: "Agora não", message: "Agora não" },
        ];

        attachedAssets.forEach((asset) => {
          if (!asset.checked) {
            setAssets((prev) => {
              if (prev.some((a) => a.id === asset.id)) return prev;
              return [...prev, { ...asset, checked: true }];
            });
          }
        });

        lastActionContextRef.current = { asset: lastAsset };
        aiResponseContent = `Recebido. Já tenho ${assetNames} comigo.\n\n${prompt}`;
        aiSuggestedActions = actions;
      } else if (content.toLowerCase().includes("adicionar hábito") || content.toLowerCase().includes("aqui está um hábito")) {
        const newAsset = getNextAsset();
        setAssets((prev) => [...prev, newAsset]);
        aiResponseContent = `Adicionei **${newAsset.name}** (${newAsset.type}) aos seus hábitos. Agora temos ${assets.length + 1} hábito(s) conectados.\n\n*${newAsset.description}*`;
      } else if (assets.length === 0) {
        aiResponseContent = "Você pode me mostrar um hábito ou material primeiro? Digite `adicionar hábito` para simular um, ou arraste uma rotina, checklist, plano ou diário aqui no chat.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: aiResponseContent,
          ...(aiSuggestedActions ? { suggestedActions: aiSuggestedActions } : {}),
        },
      ]);
    }, 1000);
  };

  const handleAddAssetDemo = () => {
    const newAsset = getNextAsset();
    setAssets((prev) => [...prev, newAsset]);

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: `Hábito **${newAsset.name}** adicionado!`,
      attachedAssets: [],
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const prompt = ASSET_TYPE_PROMPTS[newAsset.type] ?? "O que você quer fazer com esse hábito?";
      const actions = ASSET_TYPE_ACTIONS[newAsset.type] ?? [
        { label: "Sim", message: "Sim, pode seguir" },
        { label: "Agora não", message: "Agora não" },
      ];

      lastActionContextRef.current = { asset: newAsset };

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Boa. **${newAsset.name}** já está conectado.\n\n${prompt}`,
          suggestedActions: actions,
        },
      ]);
    }, 1000);
  };

  const toggleRightCollapse = () => {
    setIsRightCollapsed((prev) => {
      if (!prev) {
        setRightWidth(56);
        return true;
      }
      setRightWidth(350);
      return false;
    });
  };

  const hasAssets = assets.length > 0;
  const showCatalog = assets.length > 0 || toolTaskSpawned;
  const showDashboard = dashboardMode !== "hidden";
  const dashboardLayout = dashboardMode === "hidden" ? "horizontal" : dashboardMode;

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
        {/* Left Panel: Sidebar */}
        <PortalSidebar
          assets={assets}
          onAddAsset={handleAddAssetDemo}
          onActivityClick={handleActivityClick}
        />

        {/* Center Area */}
        <div className="flex-1 flex flex-col min-w-[300px] relative bg-navBackground">
        {/* Top Controls Header */}
        <div className="flex items-center justify-end gap-2 p-3 z-20 bg-navBackground flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
            title={theme === "dark" ? "Trocar para tema claro" : "Trocar para tema escuro"}
          >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
            title="Widgets de progresso"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleToggleDashboard}
            className="p-1.5 rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
            title="Alternar layout do painel"
          >
            <LayoutGrid size={18} />
          </button>
        </div>

        {/* Horizontal Dashboard (Top) */}
        <div
          className={cn(
            "bg-navBackground overflow-hidden flex-shrink-0 relative",
            isResizing === "horizontal" ? "" : "transition-all duration-500 ease-in-out",
            showDashboard && dashboardLayout === "horizontal"
              ? "border-b border-cardStroke opacity-100"
              : "border-transparent opacity-0"
          )}
          style={{
            height: showDashboard && dashboardLayout === "horizontal" ? dashHeight : 0,
          }}
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
              onMouseDown={(e) => startResizing(e, "horizontal")}
              className={cn(
                "z-20 absolute transition-opacity duration-300",
                isResizing === "horizontal" ? "opacity-100" : "opacity-0 hover:opacity-100",
                "h-2 w-full cursor-row-resize left-0 bottom-0 bg-gradient-to-r from-transparent via-secondaryCardStroke/50 to-transparent"
              )}
              style={{ bottom: -4 }}
            />
          )}
        </div>

        {/* Bottom Area: Vertical Dashboard + Chatbot */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Vertical Dashboard (Left) */}
          <div
            className={cn(
              "bg-navBackground overflow-hidden flex-shrink-0 relative",
              isResizing === "vertical" ? "" : "transition-all duration-500 ease-in-out",
              showDashboard && dashboardLayout === "vertical"
                ? "border-r border-cardStroke opacity-100"
                : "border-transparent opacity-0"
            )}
            style={{
              width: showDashboard && dashboardLayout === "vertical" ? dashWidth : 0,
            }}
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
                onMouseDown={(e) => startResizing(e, "vertical")}
                className={cn(
                  "z-20 absolute transition-opacity duration-300",
                  isResizing === "vertical" ? "opacity-100" : "opacity-0 hover:opacity-100",
                  "w-2 h-full cursor-col-resize top-0 right-0 bg-gradient-to-b from-transparent via-secondaryCardStroke/50 to-transparent"
                )}
                style={{ right: -4 }}
              />
            )}
          </div>

          {/* Main: Chatbot UI */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <ChatbotUI
              messages={messages}
              onSendMessage={handleSendMessage}
              onAddAsset={handleAddAssetDemo}
              isCentered={!hasAssets}
              recommendations={visibleRecommendations}
              onRecommendationClick={handleRecommendationClick}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Tools */}
      <div
        className={cn(
          "bg-navBackground flex-shrink-0 flex flex-col relative overflow-hidden",
          isResizing === "right" ? "" : "transition-all duration-500 ease-in-out",
          showCatalog
            ? "border-l border-cardStroke opacity-100"
            : "w-0 border-transparent opacity-0"
        )}
        style={{ width: showCatalog ? rightWidth : 0 }}
      >
        {showCatalog && (
          <div
            onMouseDown={(e) => startResizing(e, "right")}
            className={cn(
              "z-20 absolute transition-opacity duration-300",
              isResizing === "right" ? "opacity-100" : "opacity-0 hover:opacity-100",
              "w-2 h-full cursor-col-resize top-0 left-0 bg-gradient-to-b from-transparent via-secondaryCardStroke/50 to-transparent"
            )}
            style={{ left: -4 }}
          />
        )}

        <CatalogPanel
          ref={catalogRef}
          assets={assets}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={toggleRightCollapse}
        />
      </div>

        {/* Widget Settings Dialog */}
        <WidgetSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          activeWidgetIds={activeWidgetIds}
          onToggleWidget={handleToggleWidget}
          suggestedWidgetId={suggestedWidgetId}
          onDismissSuggestion={handleDismissSuggestion}
        />

        {/* Activity Detail Dialog */}
        <ActivityDetailDialog
          activity={selectedActivity}
          open={activityDialogOpen}
          onOpenChange={setActivityDialogOpen}
        />
      </div>
    </SidebarProvider>
  );
}
