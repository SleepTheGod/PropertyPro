"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  Calendar,
  Megaphone,
  Wrench,
  ShieldAlert,
  Dumbbell,
  FileText,
  Users,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
  description: string
  color: string
  icon: string
  is_active: boolean
  sort_order: number
  post_count: number
  created_at: string
}

const iconOptions = [
  { value: "folder", label: "Folder", icon: Folder },
  { value: "calendar", label: "Calendar", icon: Calendar },
  { value: "megaphone", label: "Megaphone", icon: Megaphone },
  { value: "wrench", label: "Wrench", icon: Wrench },
  { value: "shield-alert", label: "Shield Alert", icon: ShieldAlert },
  { value: "dumbbell", label: "Dumbbell", icon: Dumbbell },
  { value: "file-text", label: "File Text", icon: FileText },
  { value: "users", label: "Users", icon: Users },
  { value: "alert-circle", label: "Alert Circle", icon: AlertCircle },
]

const colorOptions = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
]

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "folder",
    is_active: true,
    sort_order: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories"

      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Category ${editingCategory ? "updated" : "created"} successfully`,
        })
        fetchCategories()
        resetForm()
        setIsDialogOpen(false)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      icon: category.icon,
      is_active: category.is_active,
      sort_order: category.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (category.post_count > 0) {
      toast({
        title: "Cannot Delete",
        description: "This category has posts. Please move or delete posts first.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "folder",
      is_active: true,
      sort_order: 0,
    })
    setEditingCategory(null)
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName)
    return iconOption ? iconOption.icon : Folder
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage bulletin board categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the category details below." : "Create a new category for bulletin posts."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description (optional)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-1 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded border-2 ${
                            formData.color === color ? "border-gray-900" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number.parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCategory ? "Update" : "Create"} Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage bulletin board categories and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon)
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{category.description || "No description"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.post_count} posts</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{category.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={category.post_count > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
