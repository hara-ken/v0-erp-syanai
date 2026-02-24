"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

const ships = [
  "第一志成丸",
  "第二志成丸",
  "第三志成丸",
  "MHI-2398",
  "MHI-2401",
  "MHI-2405",
]

const employees = [
  "山田 太郎",
  "佐藤 一郎",
  "鈴木 健二",
  "田中 正志",
  "高橋 雄一",
  "伊藤 大輔",
  "渡辺 修",
  "中村 浩二",
]

interface EmployeeRow {
  id: number
  name: string
}

interface DailyReport {
  id: number
  date: string
  ship: string
  department: string
  workers: string[]
  startTime: string
  endTime: string
  breakHours: number
  regularHours: number
  overtimeHours: number
}

const initialReports: DailyReport[] = [
  {
    id: 1,
    date: "2026-02-24",
    ship: "MHI-2401",
    department: "機関",
    workers: ["山田 太郎", "佐藤 一郎", "鈴木 健二", "田中 正志"],
    startTime: "08:00",
    endTime: "19:00",
    breakHours: 1,
    regularHours: 8,
    overtimeHours: 2,
  },
  {
    id: 2,
    date: "2026-02-24",
    ship: "第三志成丸",
    department: "甲板",
    workers: ["高橋 雄一", "伊藤 大輔", "渡辺 修"],
    startTime: "08:00",
    endTime: "17:00",
    breakHours: 1,
    regularHours: 8,
    overtimeHours: 0,
  },
  {
    id: 3,
    date: "2026-02-23",
    ship: "MHI-2398",
    department: "機関",
    workers: ["山田 太郎", "中村 浩二"],
    startTime: "08:00",
    endTime: "20:00",
    breakHours: 1,
    regularHours: 8,
    overtimeHours: 3,
  },
  {
    id: 4,
    date: "2026-02-23",
    ship: "第一志成丸",
    department: "甲板",
    workers: ["佐藤 一郎", "鈴木 健二", "高橋 雄一"],
    startTime: "08:00",
    endTime: "17:00",
    breakHours: 1,
    regularHours: 8,
    overtimeHours: 0,
  },
  {
    id: 5,
    date: "2026-02-22",
    ship: "第二志成丸",
    department: "機関",
    workers: ["田中 正志", "渡辺 修"],
    startTime: "08:00",
    endTime: "18:30",
    breakHours: 1,
    regularHours: 8,
    overtimeHours: 1.5,
  },
]

function calculateHours(
  startTime: string,
  endTime: string,
  breakHours: number
) {
  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM)
  const workMinutes = totalMinutes - breakHours * 60

  const regularEnd = 17 * 60
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  const regularMinutes = Math.min(endMinutes, regularEnd) - startMinutes - breakHours * 60
  const regular = Math.max(0, Math.min(regularMinutes / 60, 8))
  const overtime = Math.max(0, workMinutes / 60 - regular)

  return { regular: Math.round(regular * 10) / 10, overtime: Math.round(overtime * 10) / 10 }
}

export function DailyReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>(initialReports)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [ship, setShip] = useState("")
  const [department, setDepartment] = useState("機関")
  const [employeeRows, setEmployeeRows] = useState<EmployeeRow[]>([
    { id: 1, name: "" },
  ])
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("17:00")
  const [breakHours, setBreakHours] = useState(1)

  const { regular, overtime } = useMemo(
    () => calculateHours(startTime, endTime, breakHours),
    [startTime, endTime, breakHours]
  )

  function addEmployeeRow() {
    if (employeeRows.length >= 5) return
    setEmployeeRows((prev) => [
      ...prev,
      { id: Date.now(), name: "" },
    ])
  }

  function removeEmployeeRow(id: number) {
    setEmployeeRows((prev) => prev.filter((r) => r.id !== id))
  }

  function updateEmployeeName(id: number, name: string) {
    setEmployeeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name } : r))
    )
  }

  function resetForm() {
    setDate(new Date().toISOString().split("T")[0])
    setShip("")
    setDepartment("機関")
    setEmployeeRows([{ id: 1, name: "" }])
    setStartTime("08:00")
    setEndTime("17:00")
    setBreakHours(1)
  }

  function handleSubmit() {
    const workers = employeeRows.filter((r) => r.name).map((r) => r.name)
    if (!ship || workers.length === 0) return

    const newReport: DailyReport = {
      id: Date.now(),
      date,
      ship,
      department,
      workers,
      startTime,
      endTime,
      breakHours,
      regularHours: regular,
      overtimeHours: overtime,
    }

    setReports((prev) => [newReport, ...prev])
    setIsModalOpen(false)
    resetForm()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">日報入力</h1>
          <p className="text-sm text-muted-foreground">
            作業員の労働時間を船舶ごとに管理
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="size-4" />
          日報を追加
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">最近の日報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">日付</TableHead>
                  <TableHead className="text-foreground">船舶名</TableHead>
                  <TableHead className="text-foreground">部門</TableHead>
                  <TableHead className="text-foreground">作業員</TableHead>
                  <TableHead className="text-foreground">時間帯</TableHead>
                  <TableHead className="text-right text-foreground">通常(h)</TableHead>
                  <TableHead className="text-right text-foreground">残業(h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm text-foreground">
                      {report.date}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {report.ship}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          report.department === "機関"
                            ? "border-sky-300 bg-sky-50 text-sky-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                        }
                      >
                        {report.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex flex-wrap gap-1">
                        {report.workers.map((w, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            {w}
                            {i < report.workers.length - 1 && "、"}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {report.startTime} - {report.endTime}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-foreground">
                      {report.regularHours}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <span
                        className={
                          report.overtimeHours > 0
                            ? "font-semibold text-amber-600"
                            : "text-foreground"
                        }
                      >
                        {report.overtimeHours}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">新規日報を追加</DialogTitle>
            <DialogDescription>
              日付・船舶・作業員・時間帯を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-foreground">日付</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ship" className="text-foreground">船舶名</Label>
                <Select value={ship} onValueChange={setShip}>
                  <SelectTrigger id="ship" className="w-full">
                    <SelectValue placeholder="船舶を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {ships.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">部門</Label>
              <RadioGroup
                value={department}
                onValueChange={setDepartment}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="機関" id="dept-engine" />
                  <Label htmlFor="dept-engine" className="text-foreground">機関</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="甲板" id="dept-deck" />
                  <Label htmlFor="dept-deck" className="text-foreground">甲板</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">作業員（最大5名）</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEmployeeRow}
                  disabled={employeeRows.length >= 5}
                  className="gap-1"
                >
                  <Plus className="size-3" />
                  追加
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {employeeRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <Select
                      value={row.name}
                      onValueChange={(v) => updateEmployeeName(row.id, v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="作業員を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp} value={emp}>
                            {emp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {employeeRows.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmployeeRow(row.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="start-time" className="text-foreground">開始時刻</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="end-time" className="text-foreground">終了時刻</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="break-time" className="text-foreground">休憩時間(h)</Label>
                <Input
                  id="break-time"
                  type="number"
                  min={0}
                  max={4}
                  step={0.5}
                  value={breakHours}
                  onChange={(e) => setBreakHours(Number(e.target.value))}
                />
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">通常時間</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {regular}h
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">残業時間</span>
                    <span
                      className={`text-lg font-bold font-mono ${
                        overtime > 0 ? "text-amber-600" : "text-foreground"
                      }`}
                    >
                      {overtime}h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
