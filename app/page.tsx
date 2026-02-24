"use client"

import { useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardPage } from "@/components/dashboard-page"
import { DailyReportsPage } from "@/components/daily-reports-page"
import { ProjectsPage } from "@/components/projects-page"
import { PayrollPage } from "@/components/payroll-page"
import { SettingsPage } from "@/components/settings-page"

const pageTitles: Record<string, string> = {
  dashboard: "ダッシュボード",
  "daily-reports": "日報入力",
  projects: "案件・請求管理",
  payroll: "給与計算",
  settings: "設定",
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <h2 className="text-sm font-semibold text-foreground">
            {pageTitles[activeTab]}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "daily-reports" && <DailyReportsPage />}
          {activeTab === "projects" && <ProjectsPage />}
          {activeTab === "payroll" && <PayrollPage />}
          {activeTab === "settings" && <SettingsPage />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
