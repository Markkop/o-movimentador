"use client";

import { useState, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  Scan, ClipboardCheck, Briefcase, Shield, Activity,
  PanelRightClose, PanelRightOpen, CheckCircle2, Loader2,
  FileCode, FileText, Server, ScrollText, Network, AppWindow,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

const ASSET_TYPE_ICON_MAP = {
  Caminhada: FileCode,
  Rotina: AppWindow,
  "Agenda semanal": Network,
  "Guia alimentar": ScrollText,
  "Checklist": FileText,
  Ambiente: Server,
  "Plano de sono": Shield,
  Diário: FileText,
  Jornada: FileText,
};

const CATALOG_MODULES = [
  {
    id: "activation-plan",
    name: "Plano da semana",
    icon: Scan,
    color: "text-salmon",
    assetTypes: ["Caminhada", "Rotina", "Agenda semanal"],
    stages: ["Lendo seu ponto de partida", "Escolhendo o menor primeiro passo", "Montando a semana 1", "Pronto"],
  },
  {
    id: "consistency-check",
    name: "Checagem de constância",
    icon: ClipboardCheck,
    color: "text-lightBlue",
    assetTypes: ["Guia alimentar", "Checklist", "Diário"],
    stages: ["Revisando sua rotina", "Encontrando atritos", "Simplificando o plano", "Pronto"],
  },
  {
    id: "coach-review",
    name: "Revisão do coach",
    icon: Briefcase,
    color: "text-hAccent",
    assetTypes: ["Jornada"],
    stages: ["Abrindo a revisão", "Checando vitórias", "Destacando atritos", "Pronto"],
  },
  {
    id: "sleep-reset",
    name: "Reset do sono",
    icon: Shield,
    color: "text-black-green",
    assetTypes: ["Plano de sono"],
    stages: ["Revisando sua noite", "Reduzindo atrito", "Criando gatilhos de desligamento", "Pronto"],
  },
  {
    id: "momentum-check",
    name: "Ajuste de atrito",
    icon: Activity,
    color: "text-black-lightBlue",
    assetTypes: ["Ambiente", "Caminhada", "Rotina", "Diário"],
    stages: ["Revisando o andamento", "Encontrando o padrão", "Sugerindo próximos passos", "Pronto"],
  },
];

function getMatchingModules({ assets }) {
  const assetTypesPresent = new Set(assets.map((a) => a.type).filter(Boolean));
  return CATALOG_MODULES.filter((module) =>
    module.assetTypes?.some((t) => assetTypesPresent.has(t))
  );
}

function getMatchingAssets({ assets, module }) {
  return assets.filter((a) => module.assetTypes?.includes(a.type));
}

function AssetPickerItem({ asset, onSelect }) {
  const Icon = ASSET_TYPE_ICON_MAP[asset.type] ?? FileText;
  return (
    <button
      onClick={() => onSelect(asset)}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-cardBackgroundHover transition-colors text-left group"
    >
      <div className="text-subtitle group-hover:text-hAccent transition-colors flex-shrink-0">
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-title truncate">{asset.name}</p>
        <p className="text-2xs text-subtitle truncate">{asset.type}</p>
      </div>
    </button>
  );
}

function TaskCard({ task, onClick }) {
  const catalogModule = CATALOG_MODULES.find((m) => m.id === task.moduleId);
  const AssetIcon = ASSET_TYPE_ICON_MAP[task.asset?.type] ?? FileText;
  const isDone = task.status === "concluída";
  const totalStages = task.stages.length;
  const progressPercent = isDone ? 100 : Math.round((task.currentStage / (totalStages - 1)) * 100);

  return (
    <button 
      onClick={() => onClick?.(task)}
      className="w-full text-left p-3 rounded-lg border border-cardStroke bg-secondaryCardBackground hover:bg-cardBackgroundHover hover:border-hAccent20 transition-all cursor-pointer block"
    >
      <div className="flex items-center gap-1.5">
        <div className={cn("flex-shrink-0", isDone ? "text-black-green" : task.color)}>
          {isDone ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
        </div>
        <p className="text-sm text-title truncate">{task.moduleName}</p>
      </div>
      {task.asset && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <AssetIcon size={10} className="text-subtitle flex-shrink-0" />
          <p className="text-2xs text-subtitle truncate">{task.asset.name}</p>
        </div>
      )}
      <p className={cn("text-2xs truncate mt-0.5", isDone ? "text-black-green" : "text-subtitle")}>
        {task.stages[task.currentStage]}
      </p>
      <div className="mt-1.5 h-1 w-full rounded-full bg-cardStroke overflow-hidden">
        <div
          className="h-full rounded-full bg-hAccent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </button>
  );
}

function TaskDetailsDialog({ task, onClose }) {
  if (!task) return null;

  const isDone = task.status === "concluída";
  const totalStages = task.stages.length;
  const progressPercent = isDone ? 100 : Math.round((task.currentStage / (totalStages - 1)) * 100);
  const TaskIcon = CATALOG_MODULES.find((m) => m.id === task.moduleId)?.icon ?? Scan;
  const AssetIcon = ASSET_TYPE_ICON_MAP[task.asset?.type] ?? FileText;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-secondaryCardBackground border-cardStroke p-0 overflow-hidden gap-0">
        <DialogHeader className="p-5 border-b border-cardStroke bg-cardBackground">
          <DialogTitle className="flex items-center gap-3 text-title text-left">
            <div className={cn("p-2.5 rounded-lg bg-secondaryCardBackground border border-cardStroke flex-shrink-0", task.color)}>
              <TaskIcon size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">{task.moduleName}</div>
              {task.asset && (
                <div className="text-sm text-subtitle flex items-center gap-1.5 mt-1 font-normal">
                  <AssetIcon size={14} className="flex-shrink-0" />
                  {task.asset.name}
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Detalhes da atividade e progresso</DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-6">
          {/* Progress Section */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-end text-sm">
              <span className="text-subtitle font-medium">Progresso geral</span>
              <span className={cn("font-bold text-lg leading-none", isDone ? "text-black-green" : "text-hAccent")}>
                {progressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-cardBackground border border-cardStroke overflow-hidden">
              <div
                className="h-full rounded-full bg-hAccent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stages */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-title uppercase tracking-wider mb-3 px-1">Etapas guiadas</h4>
            <div className="bg-cardBackground rounded-xl border border-cardStroke overflow-hidden">
              {task.stages.map((stage, idx) => {
                const isCompleted = isDone || idx < task.currentStage;
                const isCurrent = !isDone && idx === task.currentStage;
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex items-center gap-3 text-sm p-3 border-b border-cardStroke last:border-b-0 transition-colors", 
                      isCompleted ? "text-title bg-cardBackgroundHover/30" : isCurrent ? "text-title font-medium bg-cardBackgroundHover/10" : "text-subtitle opacity-60"
                    )}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-black-green" />
                      ) : isCurrent ? (
                        <Loader2 size={18} className={cn("animate-spin", task.color)} />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-cardStroke" />
                      )}
                    </div>
                    <span>{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional details */}
          <div className="text-xs text-subtitle flex justify-between bg-cardBackground p-3 rounded-lg border border-cardStroke">
            <span className="flex flex-col gap-1">
              <span className="uppercase text-[10px] font-bold opacity-70">ID</span>
              <span className="font-mono text-title">{task.id.split('-').pop()}</span>
            </span>
            <span className="flex flex-col gap-1 text-right">
              <span className="uppercase text-[10px] font-bold opacity-70">Status</span>
              <span className={cn("capitalize font-medium text-title", isDone ? "text-black-green" : "text-hAccent")}>
                {task.status}
              </span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModuleButton({ module, assets, onSpawnTask, variant = "expanded" }) {
  const [open, setOpen] = useState(false);
  const matching = getMatchingAssets({ assets, module });
  const Icon = module.icon;

  const handleClick = () => {
    if (matching.length === 0) return;
    if (matching.length === 1) {
      onSpawnTask({ module, asset: matching[0] });
      return;
    }
    setOpen(true);
  };

  const handleSelectAsset = (asset) => {
    onSpawnTask({ module, asset });
    setOpen(false);
  };

  if (variant === "collapsed") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                onClick={matching.length === 1 ? handleClick : undefined}
                className={cn(
                  "p-2 rounded-md hover:bg-cardBackgroundHover transition-colors",
                  module.color
                )}
              >
                <Icon size={18} />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          {!open && (
            <TooltipContent side="left">
              {module.name} ({matching.length} hábito{matching.length !== 1 ? "s" : ""})
            </TooltipContent>
          )}
        </Tooltip>
        {matching.length > 1 && (
          <PopoverContent side="left" align="start" className="w-56 p-2">
            <p className="text-xs font-semibold text-title px-2.5 pb-1.5 mb-1 border-b border-cardStroke">
              Escolha um hábito para {module.name}
            </p>
            <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
              {matching.map((asset) => (
                <AssetPickerItem key={asset.id} asset={asset} onSelect={handleSelectAsset} />
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={matching.length === 1 ? handleClick : undefined}
          className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl border border-cardStroke bg-secondaryCardBackground hover:bg-cardBackgroundHover hover:border-hAccent20 transition-all text-center group relative"
        >
          <div className={cn("group-hover:opacity-100 opacity-80 transition-opacity", module.color)}>
            <Icon size={18} />
          </div>
          <span className="text-xs font-medium text-subtitle">{module.name}</span>
        </button>
      </PopoverTrigger>
      {matching.length > 1 && (
        <PopoverContent side="left" align="start" className="w-56 p-2">
          <p className="text-xs font-semibold text-title px-2.5 pb-1.5 mb-1 border-b border-cardStroke">
            Escolha um hábito para {module.name}
          </p>
          <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
            {matching.map((asset) => (
              <AssetPickerItem key={asset.id} asset={asset} onSelect={handleSelectAsset} />
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export const CatalogPanel = forwardRef(function CatalogPanel({ assets = [], isCollapsed = false, onToggleCollapse }, ref) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const timersRef = useRef([]);
  const matchingModules = getMatchingModules({ assets });

  const spawnTask = useCallback(({ module, asset }) => {
    const taskId = `${module.id}-${asset.id}-${Date.now()}`;
    const newTask = {
      id: taskId,
      moduleId: module.id,
      moduleName: module.name,
      color: module.color,
      asset: { id: asset.id, name: asset.name, type: asset.type },
      stages: module.stages,
      currentStage: 0,
      status: "em andamento",
    };

    setTasks((prev) => [newTask, ...prev]);

    const lastStageIndex = module.stages.length - 1;
    let stage = 0;

    const interval = setInterval(() => {
      stage += 1;
      if (stage >= lastStageIndex) {
        clearInterval(interval);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, currentStage: lastStageIndex, status: "concluída" } : t
          )
        );
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, currentStage: stage } : t
          )
        );
      }
    }, 2000);

    timersRef.current.push(interval);
  }, []);

  const spawnTaskByToolId = useCallback(({ toolId, asset }) => {
    const module = CATALOG_MODULES.find((m) => m.id === toolId);
    if (!module || !asset) return;
    spawnTask({ module, asset });
  }, [spawnTask]);

  useImperativeHandle(ref, () => ({
    spawnTaskByToolId,
  }), [spawnTaskByToolId]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="w-full h-full relative">
        {/* Collapsed View */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center py-4 gap-3 transition-opacity duration-300",
            isCollapsed ? "opacity-100 z-10 delay-150" : "opacity-0 pointer-events-none z-0"
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleCollapse}
                className="p-2 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
              >
                <PanelRightOpen size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Expandir próximas atividades</TooltipContent>
          </Tooltip>

          <div className="w-6 border-t border-cardStroke my-1 flex-shrink-0" />

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 scrollbar-thin w-full">
            {matchingModules.map((module) => (
              <ModuleButton
                key={module.id}
                module={module}
                assets={assets}
                onSpawnTask={spawnTask}
                variant="collapsed"
              />
            ))}

            {tasks.length > 0 && (
              <>
                <div className="w-6 border-t border-cardStroke my-1 flex-shrink-0" />
                {tasks.map((task) => {
                  const TaskIcon = CATALOG_MODULES.find((m) => m.id === task.moduleId)?.icon ?? Scan;
                  const isDone = task.status === "concluída";
                  return (
                    <Tooltip key={task.id}>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => setSelectedTask(task)}
                          className={cn(
                            "p-2 rounded-md hover:bg-cardBackgroundHover transition-colors",
                            isDone ? "text-black-green" : task.color
                          )}
                        >
                          {isDone
                            ? <CheckCircle2 size={18} />
                            : <TaskIcon size={18} className="animate-pulse" />
                          }
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {task.moduleName} — {task.asset?.name}: {task.stages[task.currentStage]}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Expanded View */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-full flex flex-col transition-opacity duration-300 bg-navBackground",
            isCollapsed ? "opacity-0 pointer-events-none z-0" : "opacity-100 z-10 delay-150"
          )}
        >
          <div className="p-4 border-b border-cardStroke sticky top-0 bg-navBackground z-10 flex items-center justify-between">
            <h2 className="font-primaryCondensed font-bold text-lg text-title tracking-widest uppercase">Próximas atividades</h2>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
              title="Recolher próximas atividades"
            >
              <PanelRightClose size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
            {/* Modules Grid */}
            <div>
              {matchingModules.length === 0 ? (
                <p className="text-sm text-subtitle text-center py-6">
                  Nenhuma ação guiada disponível para os tipos de hábito atuais.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {matchingModules.map((module) => (
                    <ModuleButton
                      key={module.id}
                      module={module}
                      assets={assets}
                      onSpawnTask={spawnTask}
                      variant="expanded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            {tasks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-title mb-3 uppercase tracking-wider opacity-80">Atividades ativas</h3>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Details Dialog */}
        <TaskDetailsDialog 
          task={tasks.find(t => t.id === selectedTask?.id) || selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      </div>
    </TooltipProvider>
  );
});
