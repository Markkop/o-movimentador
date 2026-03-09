"use client";

import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";
import { renderWidgetContent } from "./widgets/WidgetContent";

const GRID_SIZE = 20;

export function DashboardCanva({ cards = [], onUpdateCard, onRemoveWidget, layout = "horizontal" }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full bg-navBackground relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--subtitle) 1px, transparent 0)",
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />

      <div className="flex-1 w-full h-full relative overflow-auto overflow-x-hidden">
        <div className="w-full h-full relative min-h-[800px]">
          {cards.map((card) => (
            <Rnd
              key={card.id}
              size={{ width: card.width, height: card.height }}
              position={{ x: card.x, y: card.y }}
              onDragStop={(e, d) => {
                onUpdateCard?.(card.id, { x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                onUpdateCard?.(card.id, {
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                  ...position,
                });
              }}
              bounds="parent"
              dragGrid={[GRID_SIZE, GRID_SIZE]}
              resizeGrid={[GRID_SIZE, GRID_SIZE]}
              minWidth={120}
              minHeight={120}
              dragHandleClassName="drag-handle"
              cancel=".cancel-drag"
              className="rounded-xl border border-cardStroke bg-secondaryCardBackground shadow-sm flex flex-col group overflow-hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => onRemoveWidget?.(card.id)}
                  className="cancel-drag absolute top-2 right-2 z-10 p-1 rounded-md bg-navBackground/80 border border-cardStroke opacity-0 group-hover:opacity-100 hover:bg-cardBackgroundHover hover:border-salmon/50 text-icons hover:text-salmon transition-all"
                  title="Remove widget"
                >
                  <X size={12} />
                </button>
                {renderWidgetContent({ id: card.id })}
              </div>
            </Rnd>
          ))}

          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-subtitle">
                Nenhum widget adicionado. Abra as configurações para fixar alguns cartões de progresso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
