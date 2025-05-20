"use client"
import { useState } from "react"
import { Check, Clock, Download, Filter, MoreHorizontal, PenToolIcon as Tool, Search, Trash } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CustomDialog } from "@/components/ui/custom-dialog"

// Mock data for maintenance requests
const initialRequests = [
  {
    id: 1,
    title: "Leaking faucet in bathroom",
    description: "The bathroom sink faucet is leaking constantly, causing water to pool around the base.",
    status: "In Progress",
    priority: "Medium",
    category: "Plumbing",
    property: "Sunset Towers",
    unit: "Apt 304",
    tenant: {
      name: "John Smith",
      avatar: "/placeholder.svg?key=3gdo9",
    },
    assignedTo: "Maintenance Team",
    createdAt: "2024-04-28T10:30:00",
    updatedAt: "2024-04-30T14:15:00",
  },
  {
    id: 2,
    title: "AC not cooling properly",
    description: "The air conditioner is running but not cooling the apartment effectively.",
    status: "Scheduled",
    priority: "High",
    category: "HVAC",
    property: "Riverside Apartments",
    unit: "Apt 205",
    tenant: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?key=8ej2k",
    },
    assignedTo: "HVAC Specialist",
    createdAt: "2024-04-25T15:45:00",
    updatedAt: "2024-04-27T09:20:00",
  },
  {
    id: 3,
    title: "Light bulb replacement",
    description: "The ceiling light in the living room has burned out and needs replacement.",
    status: "Completed",
    priority: "Low",
    category: "Electrical",
    property: "Sunset Towers",
    unit: "Apt 101",
    tenant: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?key=7dk2j",
    },
    assignedTo: "Maintenance Team",
    createdAt: "2024-04-20T11:15:00",
    updatedAt: "2024-04-22T16:30:00",
  },
  {
    id: 4,
    title: "Broken dishwasher",
    description: "Dishwasher is not draining properly and making loud noises during the cycle.",
    status: "Open",
    priority: "Medium",
    category: "Appliance",
    property: "Oakwood Residences",
    unit: "Apt 512",
    tenant: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?key=9fk3l",
    },
    assignedTo: "Unassigned",
    createdAt: "2024-05-01T08:45:00",
    updatedAt: "2024-05-01T08:45:00",
  },
  {
    id: 5,
    title: "Clogged toilet",
    description: "Toilet in the master bathroom is clogged and won't flush properly.",
    status: "Open",
    priority: "High",
    category: "Plumbing",
    property: "Riverside Apartments",
    unit: "Apt 405",
    tenant: {
      name: "David Wilson",
      avatar: "/placeholder.svg?key=5hl9m",
    },
    assignedTo: "Unassigned",
    createdAt: "2024-05-02T07:30:00",
    updatedAt: "2024-05-02T07:30:00",
  },
]

// Staff members for assignment
const staffMembers = [
  { id: 1, name: "Maintenance Team" },
  { id: 2, name: "HVAC Specialist" },
  { id: 3, name: "Plumbing Contractor" },
  { id: 4, name: "Electrical Contractor" },
  { id: 5, name: "General Contractor" },
]

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    assignedTo: "",
    notes: "",
  })

  const handleStatusUpdate = () => {
    if (!selectedRequest) return

    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: statusUpdate.status || req.status,
          assignedTo: statusUpdate.assignedTo || req.assignedTo,
          updatedAt: new Date().toISOString(),
        }
      }
      return req
    })

    setRequests(updatedRequests)
    setIsDetailsDialogOpen(false)
  }

  const handleDeleteRequest = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id))
  }

  const filteredRequests = requests.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openRequests = filteredRequests.filter((req) => req.status === "Open")
  const inProgressRequests = filteredRequests.filter(
    (req) => req.status === "In Progress" || req.status === "Scheduled",
  )
  const completedRequests = filteredRequests.filter((req) => req.status === "Completed")

  const viewRequestDetails = (request: any) => {
    setSelectedRequest(request)
    setStatusUpdate({
      status: request.status,
      assignedTo: request.assignedTo,
      notes: "",
    })
    setIsDetailsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="outline">Open</Badge>
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        )
      case "Scheduled":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Scheduled
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Low
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Medium
          </Badge>
        )
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            High
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
        <p className="text-muted-foreground">Manage and track maintenance requests across all properties.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
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
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open ({openRequests.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Maintenance Requests</CardTitle>
              <CardDescription>
                Showing {filteredRequests.length} of {requests.length} total requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="hidden md:table-cell">Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Priority</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {request.property} - {request.unit}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{request.property}</div>
                        <div className="text-xs text-muted-foreground">{request.unit}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={request.tenant.avatar || "/placeholder.svg"} alt={request.tenant.name} />
                            <AvatarFallback>
                              {request.tenant.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.tenant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(request.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => viewRequestDetails(request)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Assign Staff</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteRequest(request.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No maintenance requests found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Open Requests</CardTitle>
              <CardDescription>Requests that need to be assigned and addressed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="hidden md:table-cell">Tenant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {request.property} - {request.unit}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{request.property}</div>
                        <div className="text-xs text-muted-foreground">{request.unit}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={request.tenant.avatar || "/placeholder.svg"} alt={request.tenant.name} />
                            <AvatarFallback>
                              {request.tenant.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.tenant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => viewRequestDetails(request)}>
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {openRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No open requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>In Progress Requests</CardTitle>
              <CardDescription>Requests that are currently being worked on or scheduled.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead className="hidden md:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inProgressRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {request.property} - {request.unit}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{request.property}</div>
                        <div className="text-xs text-muted-foreground">{request.unit}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{request.assignedTo}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(request.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => viewRequestDetails(request)}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {inProgressRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No in-progress requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Completed Requests</CardTitle>
              <CardDescription>Requests that have been resolved.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="hidden md:table-cell">Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Completed By</TableHead>
                    <TableHead className="hidden md:table-cell">Completed On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {request.property} - {request.unit}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{request.property}</div>
                        <div className="text-xs text-muted-foreground">{request.unit}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={request.tenant.avatar || "/placeholder.svg"} alt={request.tenant.name} />
                            <AvatarFallback>
                              {request.tenant.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.tenant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.assignedTo}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(request.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => viewRequestDetails(request)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {completedRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No completed requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <CustomDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          title="Maintenance Request Details"
          description="View and update the status of this maintenance request."
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>Update Request</Button>
            </>
          }
        >
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Request Information</h3>
                <div className="mt-2 space-y-3">
                  <div>
                    <div className="text-sm font-medium">{selectedRequest.title}</div>
                    <div className="text-sm text-muted-foreground">{selectedRequest.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Status:</div>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Priority:</div>
                    <div>{getPriorityBadge(selectedRequest.priority)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Category:</div>
                    <div className="text-sm">{selectedRequest.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Created:</div>
                    <div className="text-sm">{new Date(selectedRequest.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Last Updated:</div>
                    <div className="text-sm">{new Date(selectedRequest.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location & Contact</h3>
                <div className="mt-2 space-y-3">
                  <div>
                    <div className="text-sm font-medium">Property:</div>
                    <div className="text-sm">{selectedRequest.property}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Unit:</div>
                    <div className="text-sm">{selectedRequest.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tenant:</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={selectedRequest.tenant.avatar || "/placeholder.svg"}
                          alt={selectedRequest.tenant.name}
                        />
                        <AvatarFallback>
                          {selectedRequest.tenant.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedRequest.tenant.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Assigned To:</div>
                    <div className="text-sm">{selectedRequest.assignedTo || "Unassigned"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-4 text-sm font-medium">Update Request</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={statusUpdate.status}
                      onValueChange={(value) => setStatusUpdate({ ...statusUpdate, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select
                      value={statusUpdate.assignedTo}
                      onValueChange={(value) => setStatusUpdate({ ...statusUpdate, assignedTo: value })}
                    >
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Update Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter notes about the status update"
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CustomDialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Overview</CardTitle>
          <CardDescription>Quick stats by category and property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Requests by Category</h3>
              <div className="space-y-4">
                {["Plumbing", "Electrical", "HVAC", "Appliance", "Structural"].map((category) => {
                  const count = requests.filter((r) => r.category === category).length
                  const percentage = Math.round((count / requests.length) * 100) || 0

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Tool className="mr-2 h-4 w-4" />
                          <span>{category}</span>
                        </div>
                        <span>
                          {count} requests ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Requests by Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{openRequests.length}</div>
                  <div className="text-xs text-muted-foreground">Open Requests</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-2">
                      <Tool className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{inProgressRequests.length}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-2">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{completedRequests.length}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-2">
                      <Tool className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{requests.length}</div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
