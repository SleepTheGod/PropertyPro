import Link from "next/link"
import { Building, CreditCard, DollarSign, Home, PenToolIcon as Tool, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  // Mock data
  const tenant = {
    name: "John Doe",
    unit: "Apt 304",
    building: "Sunset Towers",
    balance: 1250,
    dueDate: "May 15, 2024",
    avatar: "/placeholder.svg?key=3gdo9",
  }

  const recentPayments = [
    { id: 1, date: "Apr 15, 2024", amount: 1250, status: "Paid", method: "Credit Card" },
    { id: 2, date: "Mar 15, 2024", amount: 1250, status: "Paid", method: "Bank Transfer" },
    { id: 3, date: "Feb 15, 2024", amount: 1250, status: "Paid", method: "Credit Card" },
  ]

  const maintenanceRequests = [
    { id: 1, title: "Leaking faucet in bathroom", status: "In Progress", date: "Apr 28, 2024" },
    { id: 2, title: "AC not cooling properly", status: "Scheduled", date: "Apr 25, 2024" },
    { id: 3, title: "Light bulb replacement", status: "Completed", date: "Apr 20, 2024" },
  ]

  const announcements = [
    {
      id: 1,
      title: "Building Maintenance Notice",
      content: "The water will be shut off on May 5th from 10am-2pm for routine maintenance.",
      date: "Apr 29, 2024",
    },
    {
      id: 2,
      title: "Community BBQ",
      content: "Join us for a community BBQ in the courtyard on May 20th at 4pm.",
      date: "Apr 27, 2024",
    },
    {
      id: 3,
      title: "Parking Lot Repainting",
      content: "The parking lot will be repainted on May 10th. Please move your vehicles by 8am.",
      date: "Apr 25, 2024",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {tenant.name}. Here's an overview of your account.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tenant.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Due on {tenant.dueDate}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/payments" className="w-full">
              <Button className="w-full">Pay Now</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Your Unit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Unit</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenant.unit}</div>
            <p className="text-xs text-muted-foreground">{tenant.building}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/unit-details" className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceRequests.filter((r) => r.status === "In Progress").length} in progress
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/maintenance" className="w-full">
              <Button variant="outline" className="w-full">
                New Request
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">
              {announcements.filter((a) => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}{" "}
              new this week
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/bulletin" className="w-full">
              <Button variant="outline" className="w-full">
                View All
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="relative pl-6">
                  <div className="absolute bottom-0 left-0 top-0 w-px bg-border" />
                  <div className="space-y-6">
                    {[...recentPayments, ...maintenanceRequests]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-2 top-0 h-4 w-4 rounded-full border bg-background" />
                          <div className="mb-1 text-sm font-medium">
                            {item.title || `Payment - $${(item as any).amount}`}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Building Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Building className="h-10 w-10 text-primary" />
                  <div>
                    <div className="font-medium">{tenant.building}</div>
                    <div className="text-sm text-muted-foreground">123 Main Street, Cityville</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Building Manager</div>
                    <div>Sarah Johnson</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>Emergency Contact</div>
                    <div>(555) 123-4567</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>Office Hours</div>
                    <div>Mon-Fri, 9am-5pm</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Building Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Monthly Rent</div>
                        <div className="text-sm text-muted-foreground">{payment.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${payment.amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{payment.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Payments
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 05/25</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Bank Account</div>
                      <div className="text-sm text-muted-foreground">Checking ****6789</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Track your maintenance tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          request.status === "Completed"
                            ? "bg-green-100"
                            : request.status === "In Progress"
                              ? "bg-blue-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        <Tool
                          className={`h-4 w-4 ${
                            request.status === "Completed"
                              ? "text-green-600"
                              : request.status === "In Progress"
                                ? "text-blue-600"
                                : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-sm text-muted-foreground">{request.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit New Request</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Tips</CardTitle>
              <CardDescription>Keep your unit in top condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">HVAC Maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    Replace your air filters every 3 months for optimal performance and air quality.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Plumbing Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Report leaks immediately to prevent water damage and mold growth.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Appliance Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean refrigerator coils and dryer vents regularly to extend appliance life.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Building Announcements</CardTitle>
              <CardDescription>Stay updated with the latest news</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Announcements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
