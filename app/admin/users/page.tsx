"use client"

import { useState } from "react"
import { Download, Filter, MoreHorizontal, Plus, Search, Shield, Trash, User } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for users
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@propertypro.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-05-02T08:30:00",
    avatar: "/placeholder.svg?key=admin",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@propertypro.com",
    role: "Property Manager",
    status: "Active",
    lastLogin: "2024-05-01T15:45:00",
    avatar: "/placeholder.svg?key=8ej2k",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@propertypro.com",
    role: "Property Manager",
    status: "Active",
    lastLogin: "2024-05-01T10:20:00",
    avatar: "/placeholder.svg?key=mbrown",
  },
  {
    id: 4,
    name: "Jessica Williams",
    email: "jessica.williams@propertypro.com",
    role: "Property Manager",
    status: "Active",
    lastLogin: "2024-04-30T14:15:00",
    avatar: "/placeholder.svg?key=jwilliams",
  },
  {
    id: 5,
    name: "Robert Davis",
    email: "robert.davis@propertypro.com",
    role: "Maintenance Staff",
    status: "Active",
    lastLogin: "2024-05-02T09:10:00",
    avatar: "/placeholder.svg?key=rdavis",
  },
  {
    id: 6,
    name: "Amanda Martinez",
    email: "amanda.martinez@propertypro.com",
    role: "Maintenance Staff",
    status: "Inactive",
    lastLogin: "2024-04-15T11:30:00",
    avatar: "/placeholder.svg?key=amartinez",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david.wilson@propertypro.com",
    role: "Tenant",
    status: "Active",
    lastLogin: "2024-05-01T18:45:00",
    avatar: "/placeholder.svg?key=5hl9m",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(initialUsers)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddUser = () => {
    const userToAdd = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      lastLogin: null,
      avatar: "/placeholder.svg?key=new",
    }

    setUsers([...users, userToAdd])
    setNewUser({ name: "", email: "", role: "", status: "Active" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const adminUsers = filteredUsers.filter((user) => user.role === "Admin")
  const staffUsers = filteredUsers.filter(
    (user) => user.role === "Property Manager" || user.role === "Maintenance Staff",
  )
  const tenantUsers = filteredUsers.filter((user) => user.role === "Tenant")

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{role}</Badge>
      case "Property Manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{role}</Badge>
      case "Maintenance Staff":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{role}</Badge>
      case "Tenant":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{role}</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Enter the details for the new user. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter user name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })} value={newUser.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Property Manager">Property Manager</SelectItem>
                      <SelectItem value="Maintenance Staff">Maintenance Staff</SelectItem>
                      <SelectItem value="Tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setNewUser({ ...newUser, status: value })} value={newUser.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Save User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins ({adminUsers.length})</TabsTrigger>
          <TabsTrigger value="staff">Staff ({staffUsers.length})</TabsTrigger>
          <TabsTrigger value="tenants">Tenants ({tenantUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} of {users.length} total users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
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
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No users found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Users with administrative privileges.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {adminUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No admin users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Staff Users</CardTitle>
              <CardDescription>Property managers and maintenance staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {staffUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No staff users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tenant Users</CardTitle>
              <CardDescription>Tenant accounts for the resident portal.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenantUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No tenant users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>User Roles & Permissions</CardTitle>
          <CardDescription>Overview of user roles and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Full access to all system features and settings.</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Manage all users and permissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Access all properties and tenants</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Configure system settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Generate and view all reports</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Property Manager</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Manage assigned properties and their tenants.</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Manage assigned properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Handle tenant requests and issues</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Process payments and leases</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Generate property reports</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Maintenance Staff</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Handle maintenance requests and property upkeep.</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>View and update maintenance requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Access property maintenance history</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Update request status and notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Limited tenant information access</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
