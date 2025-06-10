"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
})

const BulletinPage = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category_id: "1",
  })

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/bulletin")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/bulletin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  async function onSubmit(values) {
    try {
      const response = await fetch("/api/bulletin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })

      if (response.ok) {
        fetchPosts()
        setNewPost({ title: "", content: "", category_id: "1" })
        form.reset()
      } else {
        console.error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Bulletin Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Post Form */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Post title"
                        {...field}
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Post content"
                        className="resize-none"
                        {...field}
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newPost.category_id}
                  onValueChange={(value) => setNewPost({ ...newPost, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create Post</Button>
            </form>
          </Form>
        </div>

        {/* Posts Grid */}
        <div>
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id.toString())}
                style={{ backgroundColor: selectedCategory === category.id.toString() ? category.color : undefined }}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {posts
              .filter((post) => selectedCategory === "all" || post.category_id === selectedCategory)
              .map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-600">{post.content}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulletinPage
