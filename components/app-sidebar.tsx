"use client"

import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Calculator,
  Settings,
  Ship,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "ダッシュボード",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    title: "日報入力",
    icon: FileText,
    id: "daily-reports",
  },
  {
    title: "案件・請求管理",
    icon: FolderKanban,
    id: "projects",
  },
  {
    title: "給与計算",
    icon: Calculator,
    id: "payroll",
  },
  {
    title: "設定",
    icon: Settings,
    id: "settings",
  },
]

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Ship className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-wide text-sidebar-foreground">
              SHISEI
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              船舶修繕管理
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="px-2 py-3">
          <p className="text-xs text-sidebar-foreground/40">
            {"v1.0.0"}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
