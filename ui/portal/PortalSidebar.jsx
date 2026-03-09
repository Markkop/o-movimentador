"use client";

import { useState } from "react";
import {
  ChevronsUpDown,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  User,
  Users,
  LogOut,
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
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  const [conversationsOpen] = useState(true);

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

      <SidebarSeparator className="!bg-cardStroke" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-subtitle">
            <div className="flex w-full items-center gap-2">
              <span>Conversas</span>
              <button
                onClick={() => onNewConversation?.()}
                title="Nova conversa"
                className="ml-auto flex size-5 items-center justify-center rounded-md text-icons transition-colors hover:bg-cardBackgroundHover hover:text-hAccent"
              >
                <Plus className="size-4" />
              </button>
            </div>
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
                          "!h-auto items-start gap-2 py-2 text-bodyPrimary hover:bg-cardBackgroundHover hover:text-title",
                          conversation.id === activeConversationId &&
                            "bg-cardBackgroundHover text-title"
                        )}
                      >
                        <MessageSquareText className="mt-0.5 size-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {conversation.title}
                            </span>
                            <span className="shrink-0 text-2xs text-subtitle">
                              {conversation.updatedLabel}
                            </span>
                          </div>
                          <p className="truncate text-2xs text-subtitle">
                            {conversation.preview}
                          </p>
                        </div>
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

      <SidebarRail />
    </Sidebar>
  );
}
