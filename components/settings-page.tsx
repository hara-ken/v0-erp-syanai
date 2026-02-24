"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Ship, Users } from "lucide-react"

interface Employee {
  id: number
  name: string
  department: string
  hourlyWage: number
  active: boolean
}

interface ShipEntry {
  id: number
  name: string
  type: string
  client: string
  active: boolean
}

const initialEmployees: Employee[] = [
  { id: 1, name: "山田 太郎", department: "機関", hourlyWage: 1800, active: true },
  { id: 2, name: "佐藤 一郎", department: "甲板", hourlyWage: 1600, active: true },
  { id: 3, name: "鈴木 健二", department: "機関", hourlyWage: 2000, active: true },
  { id: 4, name: "田中 正志", department: "甲板", hourlyWage: 1700, active: true },
  { id: 5, name: "高橋 雄一", department: "機関", hourlyWage: 1900, active: true },
  { id: 6, name: "伊藤 大輔", department: "甲板", hourlyWage: 1500, active: true },
  { id: 7, name: "渡辺 修", department: "機関", hourlyWage: 1800, active: true },
  { id: 8, name: "中村 浩二", department: "甲板", hourlyWage: 1400, active: false },
]

const initialShips: ShipEntry[] = [
  { id: 1, name: "第一志成丸", type: "作業船", client: "自社", active: true },
  { id: 2, name: "第二志成丸", type: "作業船", client: "自社", active: true },
  { id: 3, name: "第三志成丸", type: "作業船", client: "自社", active: true },
  { id: 4, name: "MHI-2398", type: "修繕対象", client: "三菱重工 下関", active: true },
  { id: 5, name: "MHI-2401", type: "修繕対象", client: "三菱重工 下関", active: true },
  { id: 6, name: "MHI-2405", type: "修繕対象", client: "三菱重工 下関", active: true },
]

export function SettingsPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [ships, setShips] = useState<ShipEntry[]>(initialShips)
  const [empDialogOpen, setEmpDialogOpen] = useState(false)
  const [shipDialogOpen, setShipDialogOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null)
  const [editingShip, setEditingShip] = useState<ShipEntry | null>(null)

  const [empName, setEmpName] = useState("")
  const [empDept, setEmpDept] = useState("機関")
  const [empWage, setEmpWage] = useState(1500)

  const [shipName, setShipName] = useState("")
  const [shipType, setShipType] = useState("修繕対象")
  const [shipClient, setShipClient] = useState("三菱重工 下関")

  function openEmpDialog(emp?: Employee) {
    if (emp) {
      setEditingEmp(emp)
      setEmpName(emp.name)
      setEmpDept(emp.department)
      setEmpWage(emp.hourlyWage)
    } else {
      setEditingEmp(null)
      setEmpName("")
      setEmpDept("機関")
      setEmpWage(1500)
    }
    setEmpDialogOpen(true)
  }

  function saveEmployee() {
    if (!empName) return
    if (editingEmp) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editingEmp.id
            ? { ...e, name: empName, department: empDept, hourlyWage: empWage }
            : e
        )
      )
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: empName,
          department: empDept,
          hourlyWage: empWage,
          active: true,
        },
      ])
    }
    setEmpDialogOpen(false)
  }

  function openShipDialog(ship?: ShipEntry) {
    if (ship) {
      setEditingShip(ship)
      setShipName(ship.name)
      setShipType(ship.type)
      setShipClient(ship.client)
    } else {
      setEditingShip(null)
      setShipName("")
      setShipType("修繕対象")
      setShipClient("三菱重工 下関")
    }
    setShipDialogOpen(true)
  }

  function saveShip() {
    if (!shipName) return
    if (editingShip) {
      setShips((prev) =>
        prev.map((s) =>
          s.id === editingShip.id
            ? { ...s, name: shipName, type: shipType, client: shipClient }
            : s
        )
      )
    } else {
      setShips((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: shipName,
          type: shipType,
          client: shipClient,
          active: true,
        },
      ])
    }
    setShipDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">設定</h1>
        <p className="text-sm text-muted-foreground">
          従業員マスタ・船舶マスタの管理
        </p>
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees" className="gap-2">
            <Users className="size-4" />
            従業員マスタ
          </TabsTrigger>
          <TabsTrigger value="ships" className="gap-2">
            <Ship className="size-4" />
            船舶マスタ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">
                従業員一覧
              </CardTitle>
              <Button
                size="sm"
                className="gap-1"
                onClick={() => openEmpDialog()}
              >
                <Plus className="size-3" />
                追加
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">氏名</TableHead>
                      <TableHead className="text-foreground">部門</TableHead>
                      <TableHead className="text-right text-foreground">
                        時給(円)
                      </TableHead>
                      <TableHead className="text-foreground">ステータス</TableHead>
                      <TableHead className="text-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium text-foreground">
                          {emp.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              emp.department === "機関"
                                ? "border-sky-300 bg-sky-50 text-sky-700"
                                : "border-amber-300 bg-amber-50 text-amber-700"
                            }
                          >
                            {emp.department}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-foreground">
                          {emp.hourlyWage.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={emp.active ? "default" : "secondary"}
                            className={
                              emp.active
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : ""
                            }
                          >
                            {emp.active ? "有効" : "無効"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEmpDialog(emp)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ships" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">
                船舶一覧
              </CardTitle>
              <Button
                size="sm"
                className="gap-1"
                onClick={() => openShipDialog()}
              >
                <Plus className="size-3" />
                追加
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">船舶名</TableHead>
                      <TableHead className="text-foreground">種別</TableHead>
                      <TableHead className="text-foreground">顧客</TableHead>
                      <TableHead className="text-foreground">ステータス</TableHead>
                      <TableHead className="text-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ships.map((ship) => (
                      <TableRow key={ship.id}>
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Ship className="size-4 text-primary" />
                            {ship.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ship.type}</Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{ship.client}</TableCell>
                        <TableCell>
                          <Badge
                            variant={ship.active ? "default" : "secondary"}
                            className={
                              ship.active
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : ""
                            }
                          >
                            {ship.active ? "有効" : "無効"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openShipDialog(ship)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={empDialogOpen} onOpenChange={setEmpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingEmp ? "従業員を編集" : "従業員を追加"}
            </DialogTitle>
            <DialogDescription>
              従業員情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="emp-name" className="text-foreground">氏名</Label>
              <Input
                id="emp-name"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="例: 山田 太郎"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="emp-dept" className="text-foreground">部門</Label>
              <Input
                id="emp-dept"
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value)}
                placeholder="機関 / 甲板"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="emp-wage" className="text-foreground">時給(円)</Label>
              <Input
                id="emp-wage"
                type="number"
                value={empWage}
                onChange={(e) => setEmpWage(Number(e.target.value))}
                min={0}
                step={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmpDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={saveEmployee}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingShip ? "船舶を編集" : "船舶を追加"}
            </DialogTitle>
            <DialogDescription>
              船舶情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ship-name" className="text-foreground">船舶名</Label>
              <Input
                id="ship-name"
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                placeholder="例: MHI-2401"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ship-type" className="text-foreground">種別</Label>
              <Input
                id="ship-type"
                value={shipType}
                onChange={(e) => setShipType(e.target.value)}
                placeholder="作業船 / 修繕対象"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ship-client" className="text-foreground">顧客</Label>
              <Input
                id="ship-client"
                value={shipClient}
                onChange={(e) => setShipClient(e.target.value)}
                placeholder="例: 三菱重工 下関"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={saveShip}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
