"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RequireAuth } from "@/components/auth/require-auth"
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TenantsPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not a property manager or admin
  if (session?.user?.role !== "property_manager" && session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  // Mock tenants data
  const tenants = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      unit: "Apt 304",
      building: "Sunset Towers",
      status: "active",
      moveInDate: "2023-01-15",
      balance: 0,
      avatar: "/placeholder.svg?key=3gdo9",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      unit: "Apt 201",
      building: "Sunset Towers",
      status: "active",
      moveInDate: "2022-08-01",
      balance: 1250,
      avatar: "/placeholder.svg?key=4hdo2",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "(555) 456-7890",
      unit: "Apt 512",
      building: "Riverside Apartments",
      status: "active",
      moveInDate: "2023-03-10",
      balance: 0,
      avatar: "/placeholder.svg?key=9fk3l",
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily@example.com",
      phone: "(555) 234-5678",
      unit: "Apt 105",
      building: "Oakwood Residences",
      status: "pending",
      moveInDate: "2024-05-15",
      balance: 0,
      avatar: "/placeholder.svg?key=7dk2j",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david@example.com",
      phone: "(555) 876-5432",
      unit: "Apt 405",
      building: "Riverside Apartments",
      status: "inactive",
      moveInDate: "2021-06-01",
      balance: 250,
      avatar: "/placeholder.svg?key=5hl9m",
    },
  ]

  // Filter tenants based on search query
  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.building.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <RequireAuth allowedRoles={["property_manager", "admin"]}>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage your property tenants and their information.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tenants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Tenants</CardTitle>
            <CardDescription>Showing {filteredTenants.length} tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Move-in Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tenant.avatar || "/placeholder.svg"} alt={tenant.name} />
                          <AvatarFallback>
                            {tenant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-xs text-muted-foreground">{tenant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.unit}</TableCell>
                    <TableCell>{tenant.building}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tenant.status === "active"
                            ? "success"
                            : tenant.status === "pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tenant.balance > 0 ? (
                        <span className="text-red-600">${tenant.balance.toFixed(2)}</span>
                      ) : (
                        <span>${tenant.balance.toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(tenant.moveInDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Tenant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  )
}
