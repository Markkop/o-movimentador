"use client";

import { cn } from "../lib/utils";

export function PortalShell({ as: Component = "div", className, ...props }) {
  return <Component className={cn("flex h-full w-full font-secondary text-bodyPrimary", className)} {...props} />;
}

export function PortalPanel({ as: Component = "div", className, ...props }) {
  return (
    <Component
      className={cn("relative flex min-h-0 flex-col overflow-hidden bg-navBackground", className)}
      {...props}
    />
  );
}

export function PortalPanelHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-cardStroke px-4 py-3",
        className
      )}
      {...props}
    />
  );
}

export function PortalPanelHeaderLead({ className, ...props }) {
  return <div className={cn("min-w-0 flex-1", className)} {...props} />;
}

export function PortalPanelBody({ className, padded = false, ...props }) {
  return (
    <div
      className={cn("min-h-0 flex-1", padded && "px-4 py-4", className)}
      {...props}
    />
  );
}

export function PortalResizeHandle({
  active = false,
  className,
  orientation = "vertical",
  variant = "overlay",
  ...props
}) {
  if (variant === "edge") {
    return (
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-4 cursor-col-resize transition-all duration-200 ease-linear",
          "after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-cardStroke",
          "hover:after:bg-hAccent",
          active && "after:bg-hAccent",
          className
        )}
        {...props}
      />
    );
  }

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "absolute z-20 transition-opacity duration-300",
        isHorizontal
          ? "bottom-0 left-0 h-2 w-full cursor-row-resize bg-gradient-to-r from-transparent via-secondaryCardStroke/50 to-transparent"
          : "right-0 top-0 h-full w-2 cursor-col-resize bg-gradient-to-b from-transparent via-secondaryCardStroke/50 to-transparent",
        active ? "opacity-100" : "opacity-0 hover:opacity-100",
        className
      )}
      style={isHorizontal ? { bottom: -4 } : { right: -4 }}
      {...props}
    />
  );
}
