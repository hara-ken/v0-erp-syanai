"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Ship,
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

const stats = [
  {
    title: "進行中の案件",
    value: "12",
    change: "+2 今月",
    icon: Ship,
  },
  {
    title: "本日の作業員",
    value: "24",
    change: "3班稼働中",
    icon: Users,
  },
  {
    title: "未提出日報",
    value: "3",
    change: "要確認",
    icon: FileText,
  },
  {
    title: "今月の稼働時間",
    value: "1,248h",
    change: "+12% 前月比",
    icon: Clock,
  },
]

const recentReports = [
  { ship: "第三志成丸", workers: 4, hours: 32, date: "2026-02-24", dept: "機関" },
  { ship: "MHI-2401", workers: 6, hours: 48, date: "2026-02-24", dept: "甲板" },
  { ship: "第一志成丸", workers: 3, hours: 24, date: "2026-02-23", dept: "機関" },
  { ship: "MHI-2398", workers: 5, hours: 40, date: "2026-02-23", dept: "甲板" },
  { ship: "第二志成丸", workers: 2, hours: 16, date: "2026-02-22", dept: "機関" },
]

const activeProjects = [
  { ship: "MHI-2401", status: "作業中", billing: 1440000, progress: 65 },
  { ship: "第三志成丸", status: "照合中", billing: 960000, progress: 90 },
  { ship: "MHI-2398", status: "内示待ち", billing: 0, progress: 10 },
  { ship: "第一志成丸", status: "請求済", billing: 2160000, progress: 100 },
]

function getStatusColor(status: string) {
  switch (status) {
    case "内示待ち":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "作業中":
      return "bg-sky-100 text-sky-800 border-sky-200"
    case "照合中":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "請求済":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    default:
      return ""
  }
}

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
        <p className="text-sm text-muted-foreground">業務状況の概要</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.title === "未提出日報" ? (
                  <AlertCircle className="size-3 text-destructive" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">最近の日報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentReports.map((report, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {report.ship}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {report.dept}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {report.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {report.workers}名
                      </span>
                      <span className="text-xs text-muted-foreground">作業員</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {report.hours}h
                      </span>
                      <span className="text-xs text-muted-foreground">合計</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">案件一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {activeProjects.map((project, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {project.ship}
                    </span>
                    <Badge className={`${getStatusColor(project.status)} text-xs`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium font-mono text-foreground">
                      {project.billing > 0
                        ? `${(project.billing / 10000).toLocaleString()}万円`
                        : "—"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
