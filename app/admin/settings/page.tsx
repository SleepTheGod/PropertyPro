"use client"

import { useState } from "react"
import { Bell, Building, CreditCard, Lock, Mail, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState({
    companyName: "PropertyPro",
    address: "123 Business Ave, Suite 100, San Francisco, CA 94107",
    phone: "(555) 123-4567",
    email: "info@propertypro.com",
    website: "https://propertypro.com",
    logo: "/placeholder.svg?key=logo",
  })

  const [emailSettings, setEmailSettings] = useState({
    fromName: "PropertyPro",
    fromEmail: "notifications@propertypro.com",
    replyToEmail: "support@propertypro.com",
    smtpServer: "smtp.propertypro.com",
    smtpPort: "587",
    smtpUsername: "smtp_user",
    smtpPassword: "••••••••••••",
    enableSsl: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCards: true,
    acceptBankTransfers: true,
    acceptCash: false,
    acceptChecks: true,
    processingFee: "2.9",
    lateFeeAmount: "50",
    lateFeeGracePeriod: "5",
    paymentDueDay: "1",
    stripeApiKey: "sk_test_••••••••••••••••••••••••",
    paypalClientId: "client_id_••••••••••••••••••",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enablePushNotifications: false,
    maintenanceRequestNotifications: true,
    paymentNotifications: true,
    leaseNotifications: true,
    announcementNotifications: true,
    dailyDigest: false,
    weeklyDigest: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: true,
    passwordExpiryDays: "90",
    minPasswordLength: "8",
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    maxLoginAttempts: "5",
    sessionTimeoutMinutes: "30",
  })

  const handleSaveCompanySettings = () => {
    // In a real app, this would save to the backend
    console.log("Saving company settings:", companySettings)
    // Show success message
    alert("Company settings saved successfully!")
  }

  const handleSaveEmailSettings = () => {
    console.log("Saving email settings:", emailSettings)
    alert("Email settings saved successfully!")
  }

  const handleSavePaymentSettings = () => {
    console.log("Saving payment settings:", paymentSettings)
    alert("Payment settings saved successfully!")
  }

  const handleSaveNotificationSettings = () => {
    console.log("Saving notification settings:", notificationSettings)
    alert("Notification settings saved successfully!")
  }

  const handleSaveSecuritySettings = () => {
    console.log("Saving security settings:", securitySettings)
    alert("Security settings saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your system settings and preferences.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">
            <Building className="mr-2 h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={companySettings.logo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-16 w-16 rounded-md border object-contain p-1"
                  />
                  <Button variant="outline">Upload New Logo</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCompanySettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure your email server and notification settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={emailSettings.replyToEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, replyToEmail: e.target.value })}
                />
              </div>
              <Separator />
              <h3 className="text-lg font-medium">SMTP Server Settings</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSsl"
                  checked={emailSettings.enableSsl}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableSsl: checked })}
                />
                <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveEmailSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and processing options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="acceptCreditCards"
                    checked={paymentSettings.acceptCreditCards}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({ ...paymentSettings, acceptCreditCards: checked })
                    }
                  />
                  <Label htmlFor="acceptCreditCards">Accept Credit Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="acceptBankTransfers"
                    checked={paymentSettings.acceptBankTransfers}
                    onCheckedChange={(checked) =>
                      setPaymentSettings({ ...paymentSettings, acceptBankTransfers: checked })
                    }
                  />
                  <Label htmlFor="acceptBankTransfers">Accept Bank Transfers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="acceptCash"
                    checked={paymentSettings.acceptCash}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, acceptCash: checked })}
                  />
                  <Label htmlFor="acceptCash">Accept Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="acceptChecks"
                    checked={paymentSettings.acceptChecks}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, acceptChecks: checked })}
                  />
                  <Label htmlFor="acceptChecks">Accept Checks</Label>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Payment Processing</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    value={paymentSettings.processingFee}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, processingFee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDueDay">Payment Due Day</Label>
                  <Select
                    value={paymentSettings.paymentDueDay}
                    onValueChange={(value) => setPaymentSettings({ ...paymentSettings, paymentDueDay: value })}
                  >
                    <SelectTrigger id="paymentDueDay">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lateFeeAmount">Late Fee Amount ($)</Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    value={paymentSettings.lateFeeAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, lateFeeAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFeeGracePeriod">Grace Period (Days)</Label>
                  <Input
                    id="lateFeeGracePeriod"
                    type="number"
                    value={paymentSettings.lateFeeGracePeriod}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, lateFeeGracePeriod: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Payment Gateways</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                  <Input
                    id="stripeApiKey"
                    type="password"
                    value={paymentSettings.stripeApiKey}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeApiKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                  <Input
                    id="paypalClientId"
                    type="password"
                    value={paymentSettings.paypalClientId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableEmailNotifications"
                    checked={notificationSettings.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked })
                    }
                  />
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableSmsNotifications"
                    checked={notificationSettings.enableSmsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, enableSmsNotifications: checked })
                    }
                  />
                  <Label htmlFor="enableSmsNotifications">Enable SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enablePushNotifications"
                    checked={notificationSettings.enablePushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, enablePushNotifications: checked })
                    }
                  />
                  <Label htmlFor="enablePushNotifications">Enable Push Notifications</Label>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceRequestNotifications"
                    checked={notificationSettings.maintenanceRequestNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, maintenanceRequestNotifications: checked })
                    }
                  />
                  <Label htmlFor="maintenanceRequestNotifications">Maintenance Requests</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="paymentNotifications"
                    checked={notificationSettings.paymentNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, paymentNotifications: checked })
                    }
                  />
                  <Label htmlFor="paymentNotifications">Payments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="leaseNotifications"
                    checked={notificationSettings.leaseNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, leaseNotifications: checked })
                    }
                  />
                  <Label htmlFor="leaseNotifications">Leases</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="announcementNotifications"
                    checked={notificationSettings.announcementNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, announcementNotifications: checked })
                    }
                  />
                  <Label htmlFor="announcementNotifications">Announcements</Label>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Digest Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, dailyDigest: checked })
                    }
                  />
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="weeklyDigest"
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                    }
                  />
                  <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Authentication</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireTwoFactor"
                    checked={securitySettings.requireTwoFactor}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireTwoFactor: checked })
                    }
                  />
                  <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Password Requirements</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                  <Input
                    id="minPasswordLength"
                    type="number"
                    value={securitySettings.minPasswordLength}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, sessionTimeoutMinutes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireSpecialChars"
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireSpecialChars: checked })
                    }
                  />
                  <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireNumbers"
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireNumbers: checked })}
                  />
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireUppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireUppercase: checked })
                    }
                  />
                  <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecuritySettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
