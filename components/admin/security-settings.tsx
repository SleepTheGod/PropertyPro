"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function SecuritySettings() {
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiration: 90,
    preventReuse: 5,
  })

  const [authSettings, setAuthSettings] = useState({
    enableTwoFactor: true,
    requireTwoFactor: true,
    allowRememberMe: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
  })

  // Mock security logs
  const securityLogs = [
    {
      id: 1,
      event: "Login Success",
      user: "sleepraps@gmail.com",
      ip: "192.168.1.1",
      date: "2024-05-02 08:45:12",
      details: "Login from Chrome on Windows",
    },
    {
      id: 2,
      event: "Password Changed",
      user: "sleepraps@gmail.com",
      ip: "192.168.1.1",
      date: "2024-04-28 14:32:45",
      details: "Password changed successfully",
    },
    {
      id: 3,
      event: "Login Failed",
      user: "john@example.com",
      ip: "203.0.113.42",
      date: "2024-04-30 16:18:22",
      details: "Invalid password (attempt 1 of 5)",
    },
    {
      id: 4,
      event: "Two-Factor Authentication",
      user: "jane@example.com",
      ip: "198.51.100.73",
      date: "2024-05-01 09:12:38",
      details: "2FA code verified successfully",
    },
    {
      id: 5,
      event: "Account Locked",
      user: "michael@example.com",
      ip: "203.0.113.105",
      date: "2024-04-29 22:05:17",
      details: "Account locked after 5 failed login attempts",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security and authentication settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="authentication" className="space-y-4">
          <TabsList>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="passwords">Passwords</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="logs">Security Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="authentication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Configure two-factor authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Allow users to set up 2FA for their accounts</p>
                  </div>
                  <Switch
                    checked={authSettings.enableTwoFactor}
                    onCheckedChange={(checked) => setAuthSettings((prev) => ({ ...prev, enableTwoFactor: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Force all users to set up 2FA</p>
                  </div>
                  <Switch
                    checked={authSettings.requireTwoFactor}
                    onCheckedChange={(checked) => setAuthSettings((prev) => ({ ...prev, requireTwoFactor: checked }))}
                    disabled={!authSettings.enableTwoFactor}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Two-Factor Methods</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="method-app"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="method-app" className="text-sm font-normal">
                        Authenticator App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="method-sms"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="method-sms" className="text-sm font-normal">
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="passwords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password Requirements</CardTitle>
                <CardDescription>Configure password complexity requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Minimum Length</h4>
                    <p className="text-sm text-muted-foreground">Minimum number of characters required</p>
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{passwordSettings.minLength}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Uppercase Letters</h4>
                    <p className="text-sm text-muted-foreground">Require at least one uppercase letter</p>
                  </div>
                  <Switch
                    checked={passwordSettings.requireUppercase}
                    onCheckedChange={(checked) =>
                      setPasswordSettings((prev) => ({ ...prev, requireUppercase: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Lowercase Letters</h4>
                    <p className="text-sm text-muted-foreground">Require at least one lowercase letter</p>
                  </div>
                  <Switch
                    checked={passwordSettings.requireLowercase}
                    onCheckedChange={(checked) =>
                      setPasswordSettings((prev) => ({ ...prev, requireLowercase: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Numbers</h4>
                    <p className="text-sm text-muted-foreground">Require at least one number</p>
                  </div>
                  <Switch
                    checked={passwordSettings.requireNumbers}
                    onCheckedChange={(checked) => setPasswordSettings((prev) => ({ ...prev, requireNumbers: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Special Characters</h4>
                    <p className="text-sm text-muted-foreground">Require at least one special character</p>
                  </div>
                  <Switch
                    checked={passwordSettings.requireSpecialChars}
                    onCheckedChange={(checked) =>
                      setPasswordSettings((prev) => ({ ...prev, requireSpecialChars: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>Configure session timeout and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{authSettings.sessionTimeout} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow "Remember Me"</h4>
                    <p className="text-sm text-muted-foreground">Allow users to stay logged in</p>
                  </div>
                  <Switch
                    checked={authSettings.allowRememberMe}
                    onCheckedChange={(checked) => setAuthSettings((prev) => ({ ...prev, allowRememberMe: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maximum Login Attempts</h4>
                    <p className="text-sm text-muted-foreground">Number of failed attempts before lockout</p>
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{authSettings.maxLoginAttempts}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Account Lockout Duration</h4>
                    <p className="text-sm text-muted-foreground">Time in minutes before allowing login attempts</p>
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{authSettings.lockoutDuration} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Logs</CardTitle>
                <CardDescription>View security-related events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge
                            variant={
                              log.event.includes("Success") || log.event.includes("Authentication")
                                ? "success"
                                : log.event.includes("Failed") || log.event.includes("Locked")
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {log.event}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.details}</TableCell>
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
