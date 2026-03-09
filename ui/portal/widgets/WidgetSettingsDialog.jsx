"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Plus, Check, Sparkles, X, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { WIDGET_REGISTRY } from "./widgetRegistry";
import { renderWidgetContent } from "./WidgetContent";

const CATEGORY_LABELS = {
  progress: "Progresso",
  habits: "Hábitos",
  tasks: "Tarefas",
  coach: "Coach",
};

function groupWidgetsByCategory() {
  const groups = {};
  WIDGET_REGISTRY.forEach((widget) => {
    const cat = widget.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(widget);
  });
  return groups;
}

export function WidgetSettingsDialog({
  open = false,
  onOpenChange,
  activeWidgetIds = [],
  onToggleWidget,
  suggestedWidgetId,
  onDismissSuggestion,
}) {
  const grouped = groupWidgetsByCategory();
  const [selectedWidgetId, setSelectedWidgetId] = useState(WIDGET_REGISTRY[0]?.id);

  // If a suggested widget is provided, select it by default
  useEffect(() => {
    if (open && suggestedWidgetId) {
      setSelectedWidgetId(suggestedWidgetId);
    }
  }, [open, suggestedWidgetId]);

  const selectedWidget = WIDGET_REGISTRY.find((w) => w.id === selectedWidgetId);
  const isActive = activeWidgetIds.includes(selectedWidgetId);

  const handleAddRemove = () => {
    onToggleWidget({ widgetId: selectedWidgetId });
    if (!isActive) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-4xl border-cardStroke bg-navBackground text-title",
          "p-0 gap-0 overflow-hidden flex flex-row h-[600px]"
        )}
      >
        {/* Left Sidebar */}
        <div className="w-1/3 border-r border-cardStroke flex flex-col h-full bg-navBackground">
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0 text-left">
            <DialogTitle className="text-base font-primaryCondensed font-bold tracking-widest uppercase text-title">
              Widgets de progresso
            </DialogTitle>
            <DialogDescription className="text-xs text-subtitle">
              Escolha quais cartões entram no dashboard central.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-3 pb-5 scrollbar-thin space-y-6">
            {suggestedWidgetId && !activeWidgetIds.includes(suggestedWidgetId) && (
              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-hAccent">
                    <Sparkles size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Sugestão
                    </span>
                  </div>
                  <button
                    onClick={onDismissSuggestion}
                    className="p-0.5 rounded hover:bg-cardBackgroundHover text-icons hover:text-title transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <WidgetRow
                  widget={WIDGET_REGISTRY.find(w => w.id === suggestedWidgetId)}
                  isSelected={selectedWidgetId === suggestedWidgetId}
                  isActive={false}
                  onClick={() => setSelectedWidgetId(suggestedWidgetId)}
                />
              </div>
            )}

            {Object.entries(grouped).map(([category, widgets]) => (
              <div key={category} className="px-2">
                <h3 className="text-xs font-semibold text-subtitle uppercase tracking-wider mb-2 pl-2">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="space-y-1">
                  {widgets.map((widget) => (
                    <WidgetRow
                      key={widget.id}
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      isActive={activeWidgetIds.includes(widget.id)}
                      onClick={() => setSelectedWidgetId(widget.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-2/3 flex flex-col h-full bg-secondaryCardBackground">
          {selectedWidget ? (
            <>
              {/* Preview Area */}
              <div className="p-8 flex items-center justify-center bg-navBackground border-b border-cardStroke h-[340px] shrink-0 overflow-hidden">
                <div 
                  style={{
                    width: selectedWidget.defaultSize.width * Math.min(1, 276 / selectedWidget.defaultSize.height, 533 / selectedWidget.defaultSize.width),
                    height: selectedWidget.defaultSize.height * Math.min(1, 276 / selectedWidget.defaultSize.height, 533 / selectedWidget.defaultSize.width),
                  }}
                  className="relative flex items-center justify-center"
                >
                  <div 
                    className="bg-secondaryCardBackground border border-cardStroke rounded-xl overflow-hidden shadow-sm absolute origin-center"
                    style={{
                      width: selectedWidget.defaultSize.width,
                      height: selectedWidget.defaultSize.height,
                      transform: `scale(${Math.min(1, 276 / selectedWidget.defaultSize.height, 533 / selectedWidget.defaultSize.width)})`
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      {renderWidgetContent({ id: selectedWidget.id })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondaryCardStroke/30 flex items-center justify-center shrink-0">
                    <selectedWidget.icon size={20} className={selectedWidget.previewColor} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-title leading-tight">{selectedWidget.name}</h3>
                    <p className="text-sm text-subtitle">{selectedWidget.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-title mb-4">
                    <Settings2 size={16} className="text-icons" />
                    Detalhes
                  </div>
                  
                  {/* Placeholder for widget specific settings */}
                  <div className="p-4 rounded-lg border border-cardStroke bg-navBackground text-sm text-subtitle text-center">
                    Este widget ainda não possui ajustes extras.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-cardStroke bg-navBackground flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-title hover:bg-cardBackgroundHover transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={handleAddRemove}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isActive
                      ? "bg-salmon/10 text-salmon hover:bg-salmon/20"
                      : "bg-hAccent text-white-black hover:bg-hAccent/90"
                  )}
                >
                  {isActive ? (
                    <>
                      <X size={16} />
                      Remover widget
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Adicionar widget
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-subtitle">
              Escolha um widget para visualizar
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WidgetRow({ widget, isSelected, isActive, onClick }) {
  const Icon = widget.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-md text-left transition-all group",
        isSelected
          ? "bg-hAccent/10 text-title"
          : "hover:bg-cardBackgroundHover text-subtitle hover:text-title"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded flex items-center justify-center shrink-0",
          isSelected ? "bg-hAccent/20" : "bg-secondaryCardStroke/30 group-hover:bg-secondaryCardStroke/50"
        )}
      >
        <Icon size={16} className={widget.previewColor} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{widget.name}</div>
      </div>

      {isActive && (
        <div className="w-5 h-5 rounded-full bg-hAccent/20 flex items-center justify-center shrink-0">
          <Check size={12} className="text-hAccent" />
        </div>
      )}
    </button>
  );
}
