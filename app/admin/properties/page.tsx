"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, Download, Filter, Home, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for properties
const initialProperties = [
  {
    id: 1,
    name: "Sunset Towers",
    address: "123 Main St, Cityville, CA 90210",
    type: "Apartment Building",
    units: 48,
    occupancy: 95,
    manager: "Sarah Johnson",
  },
  {
    id: 2,
    name: "Riverside Apartments",
    address: "456 River Rd, Townsville, CA 90211",
    type: "Apartment Building",
    units: 36,
    occupancy: 88,
    manager: "Michael Brown",
  },
  {
    id: 3,
    name: "Oakwood Residences",
    address: "789 Oak Ave, Villageton, CA 90212",
    type: "Apartment Building",
    units: 60,
    occupancy: 92,
    manager: "Jessica Williams",
  },
  {
    id: 4,
    name: "Parkview Condos",
    address: "101 Park Blvd, Hamletville, CA 90213",
    type: "Condominium",
    units: 12,
    occupancy: 100,
    manager: "Robert Davis",
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState(initialProperties)
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    type: "",
    units: "",
    manager: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddProperty = () => {
    const propertyToAdd = {
      id: properties.length + 1,
      name: newProperty.name,
      address: newProperty.address,
      type: newProperty.type,
      units: Number.parseInt(newProperty.units),
      occupancy: 0,
      manager: newProperty.manager,
    }

    setProperties([...properties, propertyToAdd])
    setNewProperty({ name: "", address: "", type: "", units: "", manager: "" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter((property) => property.id !== id))
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.manager.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">Manage your properties and buildings.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
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
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
                <DialogDescription>
                  Enter the details for the new property. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    placeholder="Enter property name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select
                    onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                    value={newProperty.type}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment Building">Apartment Building</SelectItem>
                      <SelectItem value="Condominium">Condominium</SelectItem>
                      <SelectItem value="Single Family Home">Single Family Home</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="units">Number of Units</Label>
                  <Input
                    id="units"
                    type="number"
                    value={newProperty.units}
                    onChange={(e) => setNewProperty({ ...newProperty, units: e.target.value })}
                    placeholder="Enter number of units"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="manager">Property Manager</Label>
                  <Input
                    id="manager"
                    value={newProperty.manager}
                    onChange={(e) => setNewProperty({ ...newProperty, manager: e.target.value })}
                    placeholder="Enter property manager name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProperty}>Save Property</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            You have {properties.length} properties with a total of {properties.reduce((sum, p) => sum + p.units, 0)}{" "}
            units.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
                <TableHead className="hidden md:table-cell">Manager</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {property.name}
                    </div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{property.address}</TableCell>
                  <TableCell className="text-right">{property.units}</TableCell>
                  <TableCell className="text-right">{property.occupancy}%</TableCell>
                  <TableCell className="hidden md:table-cell">{property.manager}</TableCell>
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
                        <DropdownMenuItem>
                          <Link href={`/admin/properties/${property.id}`} className="flex w-full items-center">
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Property</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProperty(property.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No properties found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
          <CardDescription>Quick stats for all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {properties.map((property) => (
              <div key={property.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.name}</span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Units:</span>
                    <span>{property.units}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Occupancy:</span>
                    <span>{property.occupancy}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${property.occupancy}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
