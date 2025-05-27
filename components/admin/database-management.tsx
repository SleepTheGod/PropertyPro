"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database, Download, RefreshCw, Upload } from "lucide-react"

export function DatabaseManagement() {
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Mock database tables
  const tables = [
    { name: "User", rows: 125, size: "2.4 MB", lastUpdated: "2024-05-01 14:32:45" },
    { name: "Role", rows: 3, size: "0.1 MB", lastUpdated: "2024-01-15 09:12:30" },
    { name: "Session", rows: 87, size: "1.2 MB", lastUpdated: "2024-05-02 08:45:12" },
    { name: "Account", rows: 132, size: "1.8 MB", lastUpdated: "2024-05-01 18:22:05" },
    { name: "VerificationToken", rows: 15, size: "0.3 MB", lastUpdated: "2024-04-28 11:05:33" },
    { name: "PasswordReset", rows: 8, size: "0.2 MB", lastUpdated: "2024-04-30 16:18:42" },
    { name: "Building", rows: 8, size: "1.5 MB", lastUpdated: "2024-04-15 10:30:22" },
    { name: "Unit", rows: 245, size: "3.2 MB", lastUpdated: "2024-04-20 14:15:38" },
    { name: "Tenant", rows: 120, size: "2.8 MB", lastUpdated: "2024-05-01 09:45:12" },
    { name: "MaintenanceRequest", rows: 87, size: "4.5 MB", lastUpdated: "2024-05-02 07:30:15" },
    { name: "Payment", rows: 342, size: "5.2 MB", lastUpdated: "2024-05-01 23:10:05" },
    { name: "BulletinPost", rows: 56, size: "3.1 MB", lastUpdated: "2024-04-29 16:22:40" },
  ]

  // Mock backup history
  const backupHistory = [
    {
      id: 1,
      date: "2024-05-01 00:00:00",
      size: "26.8 MB",
      status: "success",
      type: "Automatic",
      duration: "45 seconds",
    },
    {
      id: 2,
      date: "2024-04-24 00:00:00",
      size: "25.4 MB",
      status: "success",
      type: "Automatic",
      duration: "42 seconds",
    },
    {
      id: 3,
      date: "2024-04-17 00:00:00",
      size: "24.9 MB",
      status: "success",
      type: "Automatic",
      duration: "40 seconds",
    },
    {
      id: 4,
      date: "2024-04-15 15:32:10",
      size: "24.8 MB",
      status: "success",
      type: "Manual",
      duration: "41 seconds",
    },
    {
      id: 5,
      date: "2024-04-10 00:00:00",
      size: "24.2 MB",
      status: "success",
      type: "Automatic",
      duration: "39 seconds",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Management</CardTitle>
        <CardDescription>Manage database operations, backups, and maintenance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">26.8 MB</div>
                  <p className="text-xs text-muted-foreground">12 tables</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,223</div>
                  <p className="text-xs text-muted-foreground">Across all tables</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1 day ago</div>
                  <p className="text-xs text-muted-foreground">May 1, 2024</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-lg font-medium">Healthy</span>
                  </div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Database Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Database Type:</span>
                    <span>PostgreSQL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Version:</span>
                    <span>14.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Connection:</span>
                    <span>Pooled (5 connections)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Uptime:</span>
                    <span>15 days, 7 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Maintenance:</span>
                    <span>April 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell className="text-right">{table.rows.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{table.size}</TableCell>
                    <TableCell>{table.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="backups" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium">Database Backup</h3>
                <p className="text-sm text-muted-foreground">Create and manage database backups</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled={isBackingUp}>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore
                </Button>
                <Button onClick={handleBackup} disabled={isBackingUp}>
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Backing Up...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isBackingUp && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Backup in progress...</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="h-2" />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.date}</TableCell>
                        <TableCell>{backup.type}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>{backup.duration}</TableCell>
                        <TableCell>
                          <Badge variant={backup.status === "success" ? "success" : "destructive"}>
                            {backup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
