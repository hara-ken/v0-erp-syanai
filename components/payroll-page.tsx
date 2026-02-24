"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, Calculator, Users } from "lucide-react"

interface PayrollEntry {
  id: number
  name: string
  regularHours: number
  overtimeHours: number
  hourlyWage: number
  overtimeMultiplier: number
}

const initialPayrollData: PayrollEntry[] = [
  {
    id: 1,
    name: "山田 太郎",
    regularHours: 168,
    overtimeHours: 24,
    hourlyWage: 1800,
    overtimeMultiplier: 1.25,
  },
  {
    id: 2,
    name: "佐藤 一郎",
    regularHours: 160,
    overtimeHours: 16,
    hourlyWage: 1600,
    overtimeMultiplier: 1.25,
  },
  {
    id: 3,
    name: "鈴木 健二",
    regularHours: 168,
    overtimeHours: 32,
    hourlyWage: 2000,
    overtimeMultiplier: 1.25,
  },
  {
    id: 4,
    name: "田中 正志",
    regularHours: 152,
    overtimeHours: 12,
    hourlyWage: 1700,
    overtimeMultiplier: 1.25,
  },
  {
    id: 5,
    name: "高橋 雄一",
    regularHours: 168,
    overtimeHours: 20,
    hourlyWage: 1900,
    overtimeMultiplier: 1.25,
  },
  {
    id: 6,
    name: "伊藤 大輔",
    regularHours: 144,
    overtimeHours: 8,
    hourlyWage: 1500,
    overtimeMultiplier: 1.25,
  },
  {
    id: 7,
    name: "渡辺 修",
    regularHours: 160,
    overtimeHours: 28,
    hourlyWage: 1800,
    overtimeMultiplier: 1.25,
  },
  {
    id: 8,
    name: "中村 浩二",
    regularHours: 136,
    overtimeHours: 4,
    hourlyWage: 1400,
    overtimeMultiplier: 1.25,
  },
]

function generateMonthOptions() {
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    months.push(`${y}-${m}`)
  }
  return months
}

export function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-02")
  const [payrollData, setPayrollData] =
    useState<PayrollEntry[]>(initialPayrollData)

  const months = useMemo(() => generateMonthOptions(), [])

  function updateWage(id: number, wage: number) {
    setPayrollData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hourlyWage: wage } : p))
    )
  }

  function calculateTotal(entry: PayrollEntry) {
    const regularPay = entry.regularHours * entry.hourlyWage
    const overtimePay =
      entry.overtimeHours * entry.hourlyWage * entry.overtimeMultiplier
    return regularPay + overtimePay
  }

  const grandTotal = payrollData.reduce(
    (sum, entry) => sum + calculateTotal(entry),
    0
  )
  const totalRegularHours = payrollData.reduce(
    (sum, e) => sum + e.regularHours,
    0
  )
  const totalOvertimeHours = payrollData.reduce(
    (sum, e) => sum + e.overtimeHours,
    0
  )

  function exportCSV() {
    const headers = [
      "従業員名",
      "通常時間(h)",
      "残業時間(h)",
      "時給(円)",
      "残業倍率",
      "支給額(円)",
    ]
    const rows = payrollData.map((entry) => [
      entry.name,
      entry.regularHours,
      entry.overtimeHours,
      entry.hourlyWage,
      entry.overtimeMultiplier,
      calculateTotal(entry),
    ])

    const bom = "\uFEFF"
    const csv =
      bom +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `給与計算_${selectedMonth}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">給与計算</h1>
          <p className="text-sm text-muted-foreground">
            日報ベースの月次給与計算
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m.replace("-", "年")}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="size-4" />
            CSV出力
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">対象者数</p>
              <p className="text-xl font-bold text-foreground">{payrollData.length}名</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Calculator className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">合計稼働時間</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {totalRegularHours + totalOvertimeHours}h
              </p>
              <p className="text-xs text-muted-foreground">
                通常 {totalRegularHours}h / 残業 {totalOvertimeHours}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Download className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総支給額</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {grandTotal.toLocaleString()}円
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            {selectedMonth.replace("-", "年")}月 給与明細
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">従業員名</TableHead>
                  <TableHead className="text-right text-foreground">通常時間(h)</TableHead>
                  <TableHead className="text-right text-foreground">残業時間(h)</TableHead>
                  <TableHead className="text-right text-foreground">時給(円)</TableHead>
                  <TableHead className="text-right text-foreground">残業倍率</TableHead>
                  <TableHead className="text-right text-foreground">支給額(円)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium text-foreground">
                      {entry.name}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {entry.regularHours}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          entry.overtimeHours > 0
                            ? "font-semibold text-amber-600"
                            : "text-foreground"
                        }
                      >
                        {entry.overtimeHours}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={entry.hourlyWage}
                        onChange={(e) =>
                          updateWage(entry.id, Number(e.target.value))
                        }
                        className="ml-auto w-24 text-right font-mono"
                        min={0}
                        step={100}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {entry.overtimeMultiplier}x
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">
                      {calculateTotal(entry).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-primary/20">
                  <TableCell className="font-bold text-foreground">合計</TableCell>
                  <TableCell className="text-right font-mono font-bold text-foreground">
                    {totalRegularHours}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-600">
                    {totalOvertimeHours}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right font-mono text-lg font-bold text-primary">
                    {grandTotal.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
