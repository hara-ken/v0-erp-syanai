"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Upload,
  Eye,
  ChevronLeft,
  Ship,
  Clock,
  Receipt,
} from "lucide-react"

type ProjectStatus = "内示待ち" | "作業中" | "照合中" | "請求済"

interface LinkedReport {
  date: string
  workers: number
  regularHours: number
  overtimeHours: number
}

interface Project {
  id: number
  ship: string
  client: string
  status: ProjectStatus
  naikiReceived: boolean
  totalHours: number
  unitPrice: number
  linkedReports: LinkedReport[]
  createdAt: string
}

const projects: Project[] = [
  {
    id: 1,
    ship: "MHI-2401",
    client: "三菱重工 下関",
    status: "作業中",
    naikiReceived: true,
    totalHours: 480,
    unitPrice: 3000,
    linkedReports: [
      { date: "2026-02-24", workers: 6, regularHours: 48, overtimeHours: 12 },
      { date: "2026-02-23", workers: 6, regularHours: 48, overtimeHours: 6 },
      { date: "2026-02-22", workers: 5, regularHours: 40, overtimeHours: 10 },
      { date: "2026-02-21", workers: 6, regularHours: 48, overtimeHours: 8 },
    ],
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    ship: "第三志成丸",
    client: "三菱重工 下関",
    status: "照合中",
    naikiReceived: true,
    totalHours: 320,
    unitPrice: 3000,
    linkedReports: [
      { date: "2026-02-20", workers: 4, regularHours: 32, overtimeHours: 4 },
      { date: "2026-02-19", workers: 4, regularHours: 32, overtimeHours: 8 },
      { date: "2026-02-18", workers: 3, regularHours: 24, overtimeHours: 3 },
    ],
    createdAt: "2026-01-20",
  },
  {
    id: 3,
    ship: "MHI-2398",
    client: "三菱重工 下関",
    status: "内示待ち",
    naikiReceived: false,
    totalHours: 0,
    unitPrice: 3000,
    linkedReports: [],
    createdAt: "2026-02-10",
  },
  {
    id: 4,
    ship: "第一志成丸",
    client: "三菱重工 下関",
    status: "請求済",
    naikiReceived: true,
    totalHours: 720,
    unitPrice: 3000,
    linkedReports: [
      { date: "2026-02-15", workers: 5, regularHours: 40, overtimeHours: 10 },
      { date: "2026-02-14", workers: 5, regularHours: 40, overtimeHours: 5 },
      { date: "2026-02-13", workers: 4, regularHours: 32, overtimeHours: 8 },
    ],
    createdAt: "2025-12-01",
  },
  {
    id: 5,
    ship: "第二志成丸",
    client: "三菱重工 下関",
    status: "作業中",
    naikiReceived: true,
    totalHours: 160,
    unitPrice: 3000,
    linkedReports: [
      { date: "2026-02-22", workers: 2, regularHours: 16, overtimeHours: 3 },
      { date: "2026-02-21", workers: 3, regularHours: 24, overtimeHours: 6 },
    ],
    createdAt: "2026-02-05",
  },
  {
    id: 6,
    ship: "MHI-2405",
    client: "三菱重工 下関",
    status: "内示待ち",
    naikiReceived: false,
    totalHours: 0,
    unitPrice: 3000,
    linkedReports: [],
    createdAt: "2026-02-20",
  },
]

const statusConfig: Record<
  ProjectStatus,
  { color: string; bgColor: string; borderColor: string }
> = {
  "内示待ち": {
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
  },
  "作業中": {
    color: "text-sky-800",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-200",
  },
  "照合中": {
    color: "text-orange-800",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  "請求済": {
    color: "text-emerald-800",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status]
  return (
    <Badge
      className={`${config.bgColor} ${config.color} ${config.borderColor} text-xs`}
    >
      {status}
    </Badge>
  )
}

export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban")

  const groupedProjects = {
    "内示待ち": projects.filter((p) => p.status === "内示待ち"),
    "作業中": projects.filter((p) => p.status === "作業中"),
    "照合中": projects.filter((p) => p.status === "照合中"),
    "請求済": projects.filter((p) => p.status === "請求済"),
  }

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">案件・請求管理</h1>
          <p className="text-sm text-muted-foreground">
            MHI下関向け請求ワークフロー管理
          </p>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "kanban")}>
          <TabsList>
            <TabsTrigger value="kanban">カンバン</TabsTrigger>
            <TabsTrigger value="list">リスト</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(Object.entries(groupedProjects) as [ProjectStatus, Project[]][]).map(
            ([status, items]) => (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {items.length}件
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Ship className="size-4 text-primary" />
                            <span className="font-medium text-foreground">
                              {project.ship}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {project.client}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="size-3" />
                              {project.totalHours}h
                            </div>
                            <span className="font-mono font-medium text-foreground">
                              {project.totalHours > 0
                                ? `${((project.totalHours * project.unitPrice) / 10000).toLocaleString()}万円`
                                : "—"}
                            </span>
                          </div>
                          {project.naikiReceived && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                              <FileText className="size-3" />
                              内示書受領済
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      案件なし
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">船舶名</TableHead>
                    <TableHead className="text-foreground">顧客</TableHead>
                    <TableHead className="text-foreground">ステータス</TableHead>
                    <TableHead className="text-foreground">内示書</TableHead>
                    <TableHead className="text-right text-foreground">合計時間</TableHead>
                    <TableHead className="text-right text-foreground">請求額</TableHead>
                    <TableHead className="text-foreground">作成日</TableHead>
                    <TableHead className="text-foreground"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Ship className="size-4 text-primary" />
                          {project.ship}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{project.client}</TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>
                        {project.naikiReceived ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-300 bg-emerald-50 text-emerald-700 text-xs"
                          >
                            受領済
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            未受領
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        {project.totalHours}h
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-foreground">
                        {project.totalHours > 0
                          ? `${(project.totalHours * project.unitPrice).toLocaleString()}円`
                          : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground">
                        {project.createdAt}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ProjectDetail({
  project,
  onBack,
}: {
  project: Project
  onBack: () => void
}) {
  const totalBilling = project.totalHours * project.unitPrice

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{project.ship}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-muted-foreground">{project.client}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">合計時間</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {project.totalHours}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">請求額</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {totalBilling > 0
                  ? `${totalBilling.toLocaleString()}円`
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">単価</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {project.unitPrice.toLocaleString()}円/h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base text-foreground">
              内示書
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="size-3" />
                アップロード
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.naikiReceived ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <FileText className="size-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    内示書_{project.ship}.pdf
                  </span>
                  <span className="text-xs text-muted-foreground">
                    受領日: {project.createdAt}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Upload className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  内示書をアップロードしてください
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              請求サマリ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">合計時間</span>
                <span className="font-mono font-medium text-foreground">
                  {project.totalHours}h
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">単価</span>
                <span className="font-mono font-medium text-foreground">
                  {project.unitPrice.toLocaleString()}円/h
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-foreground">合計請求額</span>
                <span className="text-lg font-bold font-mono text-primary">
                  {totalBilling > 0
                    ? `${totalBilling.toLocaleString()}円`
                    : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">関連日報</CardTitle>
        </CardHeader>
        <CardContent>
          {project.linkedReports.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">日付</TableHead>
                    <TableHead className="text-right text-foreground">作業員数</TableHead>
                    <TableHead className="text-right text-foreground">通常時間(h)</TableHead>
                    <TableHead className="text-right text-foreground">残業時間(h)</TableHead>
                    <TableHead className="text-right text-foreground">小計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.linkedReports.map((report, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm text-foreground">
                        {report.date}
                      </TableCell>
                      <TableCell className="text-right text-foreground">{report.workers}名</TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        {report.regularHours}
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        <span
                          className={
                            report.overtimeHours > 0
                              ? "font-semibold text-amber-600"
                              : ""
                          }
                        >
                          {report.overtimeHours}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-foreground">
                        {(
                          (report.regularHours + report.overtimeHours) *
                          project.unitPrice
                        ).toLocaleString()}
                        円
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              関連する日報はまだありません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
