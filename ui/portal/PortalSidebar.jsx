"use client";

import { useRef, useState } from "react";
import {
  ChevronsUpDown,
  MessageSquareText,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  Wrench,
  Users,
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
  useSidebar,
} from "../components/ui/sidebar";
import { MOCK_USER } from "./mockPortalData";

function TeamSwitcher({ teams, activeTeamId, onTeamChange }) {
  const { isMobile } = useSidebar();
  const activeTeam = teams.find((team) => team.id === activeTeamId) ?? teams[0];

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-cardBackgroundHover">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-hAccent text-white-black">
                <Users className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-title">{activeTeam.name}</span>
                <span className="truncate text-xs text-subtitle">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto text-icons" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-cardStroke bg-cardBackground"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-subtitle">Times</DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => onTeamChange?.(team.id)}
                className={cn(
                  "gap-2 p-2 cursor-pointer",
                  team.id === activeTeam.id && "bg-cardBackgroundHover"
                )}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-cardStroke bg-secondaryCardBackground">
                  <Users className="size-4 shrink-0 text-icons" />
                </div>
                <span className="text-title">{team.name}</span>
                <span className="ml-auto text-xs text-subtitle">{team.plan}</span>
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
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-cardBackgroundHover">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-hAccent text-xs font-semibold text-white-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-title">{MOCK_USER.name}</span>
                <span className="truncate text-xs text-subtitle">{MOCK_USER.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-icons" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-cardStroke bg-cardBackground"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-hAccent text-xs font-semibold text-white-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-title">{MOCK_USER.name}</span>
                  <span className="truncate text-xs text-subtitle">{MOCK_USER.email}</span>
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
      className="rounded-md p-1.5 text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
      title={open ? "Recolher menu" : "Expandir menu"}
    >
      {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
    </button>
  );
}

export function PortalSidebar({
  teams = [],
  activeTeamId,
  onTeamChange,
  equipmentItems = [],
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onToggleCollapse,
  onResizeStart,
}) {
  const [conversationsOpen] = useState(true);
  const suppressRailClickRef = useRef(false);

  const handleRailMouseDown = (event) => {
    suppressRailClickRef.current = false;

    const initialX = event.clientX;
    const initialY = event.clientY;

    const handlePointerMove = (moveEvent) => {
      if (
        Math.abs(moveEvent.clientX - initialX) > 3 ||
        Math.abs(moveEvent.clientY - initialY) > 3
      ) {
        suppressRailClickRef.current = true;
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    onResizeStart?.(event);
  };

  const handleRailClick = (event) => {
    if (suppressRailClickRef.current) {
      event.preventDefault();
      suppressRailClickRef.current = false;
      return;
    }

    onToggleCollapse?.();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!relative !inset-auto !h-full !border-r-cardStroke [&_[data-sidebar=sidebar]]:bg-navBackground"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <TeamSwitcher
              teams={teams}
              activeTeamId={activeTeamId}
              onTeamChange={onTeamChange}
            />
          </div>
          <SidebarToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {equipmentItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-subtitle">
              Equipamentos
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {equipmentItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className="!h-auto gap-2 py-1.5 text-bodyPrimary hover:bg-cardBackgroundHover hover:text-title"
                    >
                      <Wrench className="size-4 shrink-0" />
                      <span className="truncate text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-subtitle">
            Conversas
          </SidebarGroupLabel>

          {conversationsOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.length === 0 ? (
                  <li className="px-2 py-4 text-center text-xs text-icons">
                    Nenhuma conversa neste time ainda.
                  </li>
                ) : (
                  conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        tooltip={conversation.title}
                        onClick={() => onSelectConversation?.(conversation.id)}
                        className={cn(
                          "!h-auto gap-2 py-2 text-bodyPrimary hover:bg-cardBackgroundHover hover:text-title",
                          conversation.id === activeConversationId &&
                            "bg-cardBackgroundHover text-title"
                        )}
                      >
                        <MessageSquareText className="size-4 shrink-0" />
                        <span className="truncate text-sm font-medium">{conversation.title}</span>
                      </SidebarMenuButton>
                      {conversation.unread > 0 && (
                        <SidebarMenuBadge className="text-2xs text-hAccent">
                          {conversation.unread}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserFooter />
      </SidebarFooter>

      <SidebarRail onMouseDown={handleRailMouseDown} onClick={handleRailClick} />
    </Sidebar>
  );
}
