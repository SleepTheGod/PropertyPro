"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, Shield, Users, Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RoleManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock roles data
  const roles = [
    {
      id: "1",
      name: "admin",
      displayName: "Administrator",
      description: "Full system access and control",
      userCount: 1,
      permissions: [
        "user_management",
        "role_management",
        "system_settings",
        "property_management",
        "tenant_management",
        "billing_management",
        "maintenance_management",
        "bulletin_management",
      ],
      createdAt: "2023-01-01",
    },
    {
      id: "2",
      name: "property_manager",
      displayName: "Property Manager",
      description: "Manage properties, tenants, and maintenance",
      userCount: 5,
      permissions: [
        "property_management",
        "tenant_management",
        "billing_management",
        "maintenance_management",
        "bulletin_management",
      ],
      createdAt: "2023-01-01",
    },
    {
      id: "3",
      name: "tenant",
      displayName: "Tenant",
      description: "Access tenant portal and services",
      userCount: 120,
      permissions: ["tenant_portal", "maintenance_requests", "payment_processing", "bulletin_view"],
      createdAt: "2023-01-01",
    },
  ]

  // Mock permissions data
  const permissionCategories = [
    {
      name: "User Management",
      permissions: [
        { id: "user_management", name: "User Management", description: "Create, edit, and delete users" },
        { id: "role_management", name: "Role Management", description: "Create, edit, and delete roles" },
      ],
    },
    {
      name: "System",
      permissions: [
        { id: "system_settings", name: "System Settings", description: "Configure system settings" },
        { id: "system_logs", name: "System Logs", description: "View system logs" },
      ],
    },
    {
      name: "Properties",
      permissions: [
        { id: "property_management", name: "Property Management", description: "Manage properties and buildings" },
        { id: "tenant_management", name: "Tenant Management", description: "Manage tenants and leases" },
      ],
    },
    {
      name: "Operations",
      permissions: [
        { id: "billing_management", name: "Billing Management", description: "Manage billing and payments" },
        { id: "maintenance_management", name: "Maintenance Management", description: "Manage maintenance requests" },
        { id: "bulletin_management", name: "Bulletin Management", description: "Manage bulletin board" },
      ],
    },
    {
      name: "Tenant",
      permissions: [
        { id: "tenant_portal", name: "Tenant Portal", description: "Access tenant portal" },
        { id: "maintenance_requests", name: "Maintenance Requests", description: "Submit maintenance requests" },
        { id: "payment_processing", name: "Payment Processing", description: "Make payments" },
        { id: "bulletin_view", name: "Bulletin View", description: "View bulletin board" },
      ],
    },
  ]

  // Filter roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Manage user roles and their permissions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {role.name === "admin" ? (
                        <Shield className="h-4 w-4 text-primary" />
                      ) : (
                        <Users className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{role.displayName}</div>
                      <div className="text-xs text-muted-foreground">{role.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{role.userCount}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace(/_/g, " ")}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
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
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                      <DropdownMenuItem>View Users</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete Role</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Permission Management</CardTitle>
            <CardDescription>Configure permissions for each role.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <div className="grid gap-2">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Admin</span>
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Manager</span>
                            {[
                              "property_management",
                              "tenant_management",
                              "billing_management",
                              "maintenance_management",
                              "bulletin_management",
                            ].includes(permission.id) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Tenant</span>
                            {["tenant_portal", "maintenance_requests", "payment_processing", "bulletin_view"].includes(
                              permission.id,
                            ) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
