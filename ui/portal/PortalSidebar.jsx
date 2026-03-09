"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import {
  Building2,
  ChevronsUpDown,
  Plus,
  FileCode,
  FileText,
  Shield,
  Server,
  ClipboardList,
  ScrollText,
  Network,
  AppWindow,
  LogOut,
  Settings,
  User,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "../components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { MOCK_ORGANIZATIONS, MOCK_USER, MOCK_ACTIVITIES } from "./mockPortalData";

const ASSET_TYPE_ICON_MAP = {
  Caminhada: FileCode,
  Rotina: AppWindow,
  "Agenda semanal": Network,
  "Guia alimentar": ScrollText,
  Checklist: ClipboardList,
  Ambiente: Server,
  "Plano de sono": Shield,
  Diário: FileText,
  Jornada: FileText,
};

const ACTIVITY_STATUS_COLORS = {
  "Em andamento": "bg-blue-500",
  Concluída: "bg-green-500",
  Reajustando: "bg-salmon",
  Planejada: "bg-icons",
};

function getAssetIcon({ type, size = 16 }) {
  const Icon = ASSET_TYPE_ICON_MAP[type] ?? FileText;
  return <Icon size={size} />;
}

function getTotalFindings({ findingsBySeverity = {} }) {
  return Object.values(findingsBySeverity).reduce((sum, count) => sum + count, 0);
}

const DraggableAssetItem = forwardRef(
  ({ asset, children, className, as: Component = "div", ...props }, forwardedRef) => {
    const localRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const setRefs = (node) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") {
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
        className={cn(className, isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab")}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

DraggableAssetItem.displayName = "DraggableAssetItem";

function OrgSwitcher() {
  const [activeOrg, setActiveOrg] = useState(MOCK_ORGANIZATIONS[0]);
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-cardBackgroundHover"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-hAccent text-white-black">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-title">
                  {activeOrg.name}
                </span>
                <span className="truncate text-xs text-subtitle">
                  {activeOrg.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto text-icons" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-cardBackground border-cardStroke"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-subtitle">
              Espaços do coach
            </DropdownMenuLabel>
            {MOCK_ORGANIZATIONS.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setActiveOrg(org)}
                className={cn(
                  "gap-2 p-2 cursor-pointer",
                  activeOrg.id === org.id && "bg-cardBackgroundHover"
                )}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-cardStroke bg-secondaryCardBackground">
                  <Building2 className="size-4 shrink-0 text-icons" />
                </div>
                <span className="text-title">{org.name}</span>
                <span className="ml-auto text-xs text-subtitle">{org.plan}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserFooter() {
  const { isMobile } = useSidebar();

  const initials = MOCK_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-cardBackgroundHover"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-hAccent text-white-black text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-title">
                  {MOCK_USER.name}
                </span>
                <span className="truncate text-xs text-subtitle">
                  {MOCK_USER.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-icons" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-cardBackground border-cardStroke"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-hAccent text-white-black text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-title">
                    {MOCK_USER.name}
                  </span>
                  <span className="truncate text-xs text-subtitle">
                    {MOCK_USER.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cardStroke" />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="size-4 text-icons" />
              <span className="text-title">Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="size-4 text-icons" />
              <span className="text-title">Preferências</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cardStroke" />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <LogOut className="size-4 text-icons" />
              <span className="text-title">Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarToggle() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-1.5 hover:bg-cardBackgroundHover rounded-md text-icons hover:text-hAccent transition-colors"
      title={open ? "Recolher menu" : "Expandir menu"}
    >
      {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
    </button>
  );
}

export function PortalSidebar({ assets = [], onAddAsset, onActivityClick }) {
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [activitiesOpen, setActivitiesOpen] = useState(true);

  return (
    <Sidebar
      collapsible="icon"
      className="!relative !h-full !inset-auto !border-r-cardStroke [&_[data-sidebar=sidebar]]:bg-navBackground"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <OrgSwitcher />
          </div>
          <SidebarToggle />
        </div>
      </SidebarHeader>

      <SidebarSeparator className="!bg-cardStroke" />

      <SidebarContent>
        {/* Habits section */}
        <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="text-subtitle uppercase text-xs tracking-wider font-semibold">
              <CollapsibleTrigger>
                Hábitos
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAsset?.();
                  }}
                  title="Adicionar hábito"
                  className="ml-auto flex size-5 items-center justify-center rounded-md hover:bg-cardBackgroundHover text-icons hover:text-hAccent transition-colors"
                >
                  <Plus className="size-4" />
                </button>
                <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {assets.length === 0 ? (
                    <li className="px-2 py-4 text-xs text-icons text-center">
                      Nenhum hábito conectado ainda.
                    </li>
                  ) : (
                    assets.map((asset) => (
                      <SidebarMenuItem key={asset.id}>
                        <DraggableAssetItem asset={asset} as="div">
                          <SidebarMenuButton tooltip={asset.name} className="text-bodyPrimary hover:text-title hover:bg-cardBackgroundHover !h-auto py-1.5">
                            {getAssetIcon({ type: asset.type })}
                            <div className="flex flex-col min-w-0 leading-tight">
                              <span className="truncate text-sm">{asset.name}</span>
                              <span className="truncate text-2xs text-subtitle">{asset.type}</span>
                            </div>
                          </SidebarMenuButton>
                        </DraggableAssetItem>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarSeparator className="!bg-cardStroke" />

        {/* Journeys section */}
        <Collapsible open={activitiesOpen} onOpenChange={setActivitiesOpen} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="text-subtitle uppercase text-xs tracking-wider font-semibold">
              <CollapsibleTrigger>
                Jornadas
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MOCK_ACTIVITIES.map((activity) => (
                    <SidebarMenuItem key={activity.id}>
                      <SidebarMenuButton
                        tooltip={activity.name}
                        className="text-bodyPrimary hover:text-title hover:bg-cardBackgroundHover"
                        onClick={() => onActivityClick?.(activity)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "size-2 rounded-full shrink-0",
                              ACTIVITY_STATUS_COLORS[activity.status] ?? "bg-icons"
                            )}
                          />
                          <span className="truncate">{activity.name}</span>
                        </div>
                      </SidebarMenuButton>
                      <SidebarMenuBadge className="text-2xs text-subtitle">
                        {getTotalFindings({ findingsBySeverity: activity.findingsBySeverity })}
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <UserFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
