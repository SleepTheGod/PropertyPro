"use client"

import { useState } from "react"
import { Download, Filter, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for tenants
const initialTenants = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    unit: "Apt 304",
    property: "Sunset Towers",
    leaseEnd: "2024-05-31",
    status: "Active",
    balance: 0,
    avatar: "/placeholder.svg?key=3gdo9",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    unit: "Apt 205",
    property: "Riverside Apartments",
    leaseEnd: "2024-06-15",
    status: "Active",
    balance: 0,
    avatar: "/placeholder.svg?key=8ej2k",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "(555) 345-6789",
    unit: "Apt 512",
    property: "Oakwood Residences",
    leaseEnd: "2024-06-30",
    status: "Active",
    balance: 0,
    avatar: "/placeholder.svg?key=9fk3l",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "(555) 456-7890",
    unit: "Apt 101",
    property: "Sunset Towers",
    leaseEnd: "2024-07-15",
    status: "Active",
    balance: 1250,
    avatar: "/placeholder.svg?key=7dk2j",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "(555) 567-8901",
    unit: "Apt 405",
    property: "Riverside Apartments",
    leaseEnd: "2024-08-01",
    status: "Active",
    balance: 0,
    avatar: "/placeholder.svg?key=5hl9m",
  },
]

// Mock data for properties
const properties = [
  { id: 1, name: "Sunset Towers" },
  { id: 2, name: "Riverside Apartments" },
  { id: 3, name: "Oakwood Residences" },
  { id: 4, name: "Parkview Condos" },
]

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tenants, setTenants] = useState(initialTenants)
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    leaseEnd: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddTenant = () => {
    const tenantToAdd = {
      id: tenants.length + 1,
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      property: newTenant.property,
      unit: newTenant.unit,
      leaseEnd: newTenant.leaseEnd,
      status: "Active",
      balance: 0,
      avatar: "/placeholder.svg?key=new",
    }

    setTenants([...tenants, tenantToAdd])
    setNewTenant({ name: "", email: "", phone: "", property: "", unit: "", leaseEnd: "" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTenant = (id: number) => {
    setTenants(tenants.filter((tenant) => tenant.id !== id))
  }

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <p className="text-muted-foreground">Manage your tenants and leases.</p>
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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
                <DialogDescription>
                  Enter the details for the new tenant. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    placeholder="Enter tenant name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="property">Property</Label>
                  <Select
                    onValueChange={(value) => setNewTenant({ ...newTenant, property: value })}
                    value={newTenant.property}
                  >
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.name}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newTenant.unit}
                    onChange={(e) => setNewTenant({ ...newTenant, unit: e.target.value })}
                    placeholder="Enter unit number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leaseEnd">Lease End Date</Label>
                  <Input
                    id="leaseEnd"
                    type="date"
                    value={newTenant.leaseEnd}
                    onChange={(e) => setNewTenant({ ...newTenant, leaseEnd: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTenant}>Save Tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tenants</CardTitle>
          <CardDescription>
            You have {tenants.length} tenants across {properties.length} properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="hidden md:table-cell">Lease End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
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
                        <div className="text-xs text-muted-foreground md:hidden">{tenant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm">
                      <div>{tenant.email}</div>
                      <div className="text-muted-foreground">{tenant.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{tenant.unit}</div>
                      <div className="text-xs text-muted-foreground">{tenant.property}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.status === "Active" ? "default" : "secondary"} className="whitespace-nowrap">
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {tenant.balance > 0 ? (
                      <span className="text-red-500">${tenant.balance.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-500">$0.00</span>
                    )}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                        <DropdownMenuItem>Manage Lease</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTenant(tenant.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No tenants found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Overview</CardTitle>
          <CardDescription>Quick stats by property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {properties.map((property) => {
              const propertyTenants = tenants.filter((t) => t.property === property.name)
              const overdueCount = propertyTenants.filter((t) => t.balance > 0).length

              return (
                <div key={property.id} className="rounded-lg border p-3">
                  <div className="font-medium">{property.name}</div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tenants:</span>
                      <span>{propertyTenants.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Overdue:</span>
                      <span className={overdueCount > 0 ? "text-red-500" : ""}>{overdueCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Leases ending soon:</span>
                      <span>
                        {
                          propertyTenants.filter((t) => {
                            const leaseEnd = new Date(t.leaseEnd)
                            const now = new Date()
                            const diffDays = Math.ceil((leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                            return diffDays <= 30
                          }).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
