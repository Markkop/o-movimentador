"use client";

import {
  Plus, FileCode, PanelLeftClose, PanelLeftOpen,
  FileText, Shield, Server, ClipboardList, ScrollText, Network, AppWindow,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { useEffect, useRef, useState, forwardRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const ASSET_TYPE_ICON_MAP = {
  'Workout Plan': FileCode,
  'Routine': AppWindow,
  'Weekly Schedule': Network,
  'Meal Guide': ScrollText,
  'Checklist': ClipboardList,
  'Environment': Server,
  'Sleep Plan': Shield,
  'Progress Log': FileText,
  'Activity': FileText,
};

function getAssetIcon({ type, size = 18 }) {
  const Icon = ASSET_TYPE_ICON_MAP[type] ?? FileText;
  return <Icon size={size} />;
}

const DraggableAssetItem = forwardRef(({ asset, children, className, as: Component = "div", ...props }, forwardedRef) => {
  const localRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ asset }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [asset]);

  return (
    <Component 
      ref={setRefs} 
      className={cn(className, isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab')} 
      {...props}
    >
      {children}
    </Component>
  );
});

DraggableAssetItem.displayName = 'DraggableAssetItem';

export function AssetPanel({ assets, onAddAsset, isCollapsed = false, onToggleCollapse }) {
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
                <PanelLeftOpen size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Resources</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAddAsset}
                className="p-2 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
              >
                <Plus size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Resource</TooltipContent>
          </Tooltip>

          <div className="w-6 border-t border-cardStroke my-1 flex-shrink-0" />

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 scrollbar-thin w-full">
            {assets.map((asset) => (
              <Tooltip key={asset.id}>
                <TooltipTrigger asChild>
                  <DraggableAssetItem as="button" asset={asset} className="p-2 rounded-md hover:bg-cardBackgroundHover text-subtitle hover:text-title transition-colors">
                    {getAssetIcon({ type: asset.type })}
                  </DraggableAssetItem>
                </TooltipTrigger>
                <TooltipContent side="right">{asset.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Expanded View */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-full flex flex-col transition-opacity duration-300 bg-navBackground",
            isCollapsed ? "opacity-0 pointer-events-none z-0" : "opacity-100 z-10 delay-150"
          )}
        >
          <div className="p-4 border-b border-cardStroke flex items-center justify-between sticky top-0 bg-navBackground z-10">
            <h2 className="font-primaryCondensed font-bold text-lg text-title tracking-widest uppercase">Resources</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={onAddAsset}
                className="p-1.5 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
                title="Add Resource"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
                title="Collapse Resources"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
            {assets.length === 0 ? (
              <p className="text-sm text-icons text-center mt-10">No resources connected yet.</p>
            ) : (
              assets.map((asset) => (
                <DraggableAssetItem 
                  key={asset.id} 
                  asset={asset}
                  className="flex items-start gap-3 p-3 rounded-lg border border-cardStroke bg-secondaryCardBackground hover:border-hAccent20 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-title truncate">{asset.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-subtitle opacity-80">
                      {getAssetIcon({ type: asset.type, size: 12 })}
                      <span className="truncate">{asset.type}</span>
                    </div>
                  </div>
                </DraggableAssetItem>
              ))
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
