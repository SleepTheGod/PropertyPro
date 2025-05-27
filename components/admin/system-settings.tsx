"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SystemSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "PropertyPro",
    siteDescription: "Property Management System",
    supportEmail: "support@propertypro.com",
    supportPhone: "(555) 123-4567",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@propertypro.com",
    smtpPassword: "••••••••••••",
    fromEmail: "notifications@propertypro.com",
    fromName: "PropertyPro Notifications",
    enableSsl: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enablePushNotifications: true,
    maintenanceRequestNotifications: true,
    paymentReminderNotifications: true,
    bulletinBoardNotifications: true,
    systemAnnouncementNotifications: true,
  })

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailSettingsChange = (e) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure global system settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  name="supportPhone"
                  value={generalSettings.supportPhone}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={generalSettings.timezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={generalSettings.dateFormat}>
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  name="smtpServer"
                  value={emailSettings.smtpServer}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  name="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  name="smtpUsername"
                  value={emailSettings.smtpUsername}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  name="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  name="fromEmail"
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  name="fromName"
                  value={emailSettings.fromName}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSsl"
                  checked={emailSettings.enableSsl}
                  onCheckedChange={() => setEmailSettings((prev) => ({ ...prev, enableSsl: !prev.enableSsl }))}
                />
                <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email</Label>
              <div className="flex items-center gap-2">
                <Input id="testEmail" placeholder="Enter email address" />
                <Button>Send Test</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable email notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.enableEmailNotifications}
                  onCheckedChange={() => handleNotificationToggle("enableEmailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable SMS notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.enableSmsNotifications}
                  onCheckedChange={() => handleNotificationToggle("enableSmsNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable push notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.enablePushNotifications}
                  onCheckedChange={() => handleNotificationToggle("enablePushNotifications")}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceRequestNotifications">Maintenance Requests</Label>
                  <Switch
                    id="maintenanceRequestNotifications"
                    checked={notificationSettings.maintenanceRequestNotifications}
                    onCheckedChange={() => handleNotificationToggle("maintenanceRequestNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="paymentReminderNotifications">Payment Reminders</Label>
                  <Switch
                    id="paymentReminderNotifications"
                    checked={notificationSettings.paymentReminderNotifications}
                    onCheckedChange={() => handleNotificationToggle("paymentReminderNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bulletinBoardNotifications">Bulletin Board Updates</Label>
                  <Switch
                    id="bulletinBoardNotifications"
                    checked={notificationSettings.bulletinBoardNotifications}
                    onCheckedChange={() => handleNotificationToggle("bulletinBoardNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="systemAnnouncementNotifications">System Announcements</Label>
                  <Switch
                    id="systemAnnouncementNotifications"
                    checked={notificationSettings.systemAnnouncementNotifications}
                    onCheckedChange={() => handleNotificationToggle("systemAnnouncementNotifications")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="primaryColor" type="color" className="h-10 w-20" defaultValue="#0284c7" />
                  <Input defaultValue="#0284c7" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="secondaryColor" type="color" className="h-10 w-20" defaultValue="#7c3aed" />
                  <Input defaultValue="#7c3aed" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-2">
                  <div className="h-20 w-20 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Logo</span>
                  </div>
                  <Button>Upload</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Icon</span>
                  </div>
                  <Button>Upload</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch id="maintenanceMode" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  placeholder="Enter maintenance message"
                  className="min-h-[100px]"
                  defaultValue="We're currently performing scheduled maintenance. Please check back soon."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledMaintenance">Scheduled Maintenance</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="startDate" className="text-xs">
                      Start Date
                    </Label>
                    <Input id="startDate" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-xs">
                      End Date
                    </Label>
                    <Input id="endDate" type="datetime-local" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
