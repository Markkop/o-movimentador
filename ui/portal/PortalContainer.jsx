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
  { name: "10-Minute Walk Plan", type: "Workout Plan", description: "A simple starter plan built around short daily walks" },
  { name: "After-Lunch Routine", type: "Routine", description: "A repeatable afternoon cue for getting out of the chair" },
  { name: "Simple Meal Prep Guide", type: "Meal Guide", description: "Easy meals that support steady energy for movement" },
  { name: "Evening Wind-Down", type: "Sleep Plan", description: "A low-friction shutdown routine to improve recovery" },
  { name: "Shoes by the Door", type: "Environment", description: "A tiny environment change that removes morning friction" },
  { name: "Water Bottle on Desk", type: "Environment", description: "A visible cue that supports movement breaks and hydration" },
  { name: "Mobility Reset", type: "Workout Plan", description: "A short mobility sequence for stiff afternoons" },
  { name: "Morning Starter", type: "Routine", description: "A wake-up flow that replaces screen time with movement" },
  { name: "Hydration Checklist", type: "Checklist", description: "A simple list to support energy and consistency" },
  { name: "Weekly Calendar Snapshot", type: "Weekly Schedule", description: "A realistic view of where movement blocks can fit" },
  { name: "Sunday Reflection Notes", type: "Progress Log", description: "A quick weekly review of wins, misses, and momentum" },
  { name: "Week 1 Coach Review", type: "Activity", description: "A previous coaching review with wins and friction points" },
];

const ASSET_TYPE_ACTIONS = {
  "Workout Plan": [
    { label: "Build Week 1 Plan", message: "Yes, build my Week 1 movement plan", toolId: "activation-plan" },
    { label: "Shrink the Starting Step", message: "Help me shrink the starting step", toolId: "momentum-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Routine": [
    { label: "Build a Repeatable Routine", message: "Yes, build a repeatable routine from this", toolId: "activation-plan" },
    { label: "Find My Friction", message: "Find the friction points in this routine", toolId: "momentum-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Meal Guide": [
    { label: "Check Energy Support", message: "Yes, check if this supports my energy and movement", toolId: "consistency-check" },
    { label: "Simplify the Meals", message: "Help me simplify these meals for consistency", toolId: "consistency-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Sleep Plan": [
    { label: "Build a Sleep Reset", message: "Yes, build a sleep reset from this", toolId: "sleep-reset" },
    { label: "Reduce Night Friction", message: "Show me where the night routine is too hard", toolId: "sleep-reset" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Environment": [
    { label: "Check My Setup", message: "Yes, check whether this setup supports movement", toolId: "momentum-check" },
    { label: "Suggest Easy Changes", message: "Suggest easy environment changes for consistency", toolId: "momentum-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Weekly Schedule": [
    { label: "Find Movement Windows", message: "Yes, find movement windows in this schedule", toolId: "activation-plan" },
    { label: "Protect My Best Time", message: "Help me protect my best time to move", toolId: "momentum-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Checklist": [
    { label: "Tighten the Checklist", message: "Yes, tighten this checklist into a daily cue", toolId: "consistency-check" },
    { label: "Remove Extra Steps", message: "Help me remove extra steps from this checklist", toolId: "consistency-check" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Progress Log": [
    { label: "Review My Week", message: "Yes, review my week and show the pattern", toolId: "coach-review" },
    { label: "Find Small Wins", message: "Show me the small wins in this progress log", toolId: "coach-review" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
  "Activity": [
    { label: "Review the Check-In", message: "Yes, review the previous coaching check-in", toolId: "coach-review" },
    { label: "Plan the Next Phase", message: "Plan the next phase from this activity", toolId: "coach-review" },
    { label: "Not now", message: "No thanks, not right now" },
  ],
};

const ASSET_TYPE_PROMPTS = {
  "Workout Plan": "Would you like me to turn this into a **simple first-week movement plan**?",
  "Routine": "Would you like me to **simplify this routine** so it is easier to repeat?",
  "Meal Guide": "Would you like me to **check whether these meals support your energy and movement**?",
  "Sleep Plan": "Would you like me to **build a calmer evening reset** from this?",
  "Environment": "Would you like me to **suggest easy setup changes** that make movement easier to start?",
  "Weekly Schedule": "Would you like me to **find the best time blocks for movement** in this schedule?",
  "Checklist": "Would you like me to **trim this checklist into a low-friction daily cue**?",
  "Progress Log": "Would you like me to **review your week and pull out the pattern**?",
  "Activity": "Would you like me to **review the wins and friction** from this activity?",
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
  const [dashboardMode, setDashboardMode] = useState("hidden");
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
    const messageContent = content.trim() || `Attached ${attachedAssets.length} resource(s)`;

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: messageContent,
      attachedAssets,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      let aiResponseContent = "I received your message. Let's build a path from inactive to active.";
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

        aiResponseContent = `Starting **${matchedAction.label}** for **${asset.name}**. You can track the progress in the Guides panel.`;
      } else if (matchedRecommendationAction) {
        aiResponseContent = `Got it. I'll **${matchedRecommendationAction.label.toLowerCase()}** for you. This is being queued now, and you'll see the progress in the Guides panel shortly.`;
      } else if (content === "No thanks, not right now" || content === "Thanks, I'll handle this manually" || content === "I've noted this advisory, thanks" || content === "I'll add the backup plan later" || content === "Skip for Now") {
        lastActionContextRef.current = null;
        aiResponseContent = "No problem. When you're ready, we can make the next step smaller and easier.";
      } else if (
        contentLower.includes("inactive to active") ||
        contentLower.includes("routine") ||
        contentLower.includes("low-energy")
      ) {
        aiResponseContent = "Great. Let's start with what your real day looks like.\n\nPlease drag and drop resources below to continue.";
      } else if (contentLower.includes("resource") && contentLower.includes("added")) {
        aiResponseContent = "Perfect. Ask me what pattern you want to build from here.";
      } else if (attachedAssets.length > 0) {
        const lastAsset = attachedAssets[attachedAssets.length - 1];
        const assetNames = attachedAssets.map((a) => `**${a.name}**`).join(", ");
        const prompt = ASSET_TYPE_PROMPTS[lastAsset?.type] ?? "What would you like to build from this?";
        const actions = ASSET_TYPE_ACTIONS[lastAsset?.type] ?? [
          { label: "Yes", message: "Yes, go ahead" },
          { label: "No", message: "No thanks, not right now" },
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
        aiResponseContent = `Got it. I've received ${assetNames}.\n\n${prompt}`;
        aiSuggestedActions = actions;
      } else if (content.toLowerCase().includes("add resource") || content.toLowerCase().includes("here is a resource")) {
        const newAsset = getNextAsset();
        setAssets((prev) => [...prev, newAsset]);
        aiResponseContent = `I've added **${newAsset.name}** (${newAsset.type}) to your resources. We now have ${assets.length + 1} resource(s) connected.\n\n*${newAsset.description}*`;
      } else if (assets.length === 0) {
        aiResponseContent = "Could you share a resource first? You can type 'add resource' to simulate one, or drag and drop a routine, note, checklist, or plan right here into the chat.";
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
      content: `Resource **${newAsset.name}** added!`,
      attachedAssets: [],
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const prompt = ASSET_TYPE_PROMPTS[newAsset.type] ?? "What would you like to do with this resource?";
      const actions = ASSET_TYPE_ACTIONS[newAsset.type] ?? [
        { label: "Yes", message: "Yes, go ahead" },
        { label: "No", message: "No thanks, not right now" },
      ];

      lastActionContextRef.current = { asset: newAsset };

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Great, **${newAsset.name}** is connected.\n\n${prompt}`,
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
  const showCatalog = assets.length >= 3 || toolTaskSpawned;
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
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
            title="Progress Widgets"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleToggleDashboard}
            className="p-1.5 rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
            title="Toggle Board Layout"
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
