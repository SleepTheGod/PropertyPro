"use client"
import { useState } from "react"
import { Building, Calendar, Filter, MessageSquare, Pin, PlusCircle, Search, Tag, ThumbsUp, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CustomDialog } from "@/components/ui/custom-dialog"

export default function BulletinPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeBuilding, setActiveBuilding] = useState("All Buildings")

  const handleNewPost = () => {
    // Handle new post submission
    if (!newPostContent.trim()) return

    console.log("New post:", newPostContent)
    setNewPostContent("")
    setIsNewPostModalOpen(false)
  }

  // Mock bulletin board data
  const announcements = [
    {
      id: 1,
      title: "Building Maintenance Notice",
      content:
        "The water will be shut off on May 5th from 10am-2pm for routine maintenance. Please plan accordingly and store water if needed. We apologize for any inconvenience this may cause.",
      date: "Apr 29, 2024",
      author: {
        name: "Sarah Johnson",
        role: "Property Manager",
        avatar: "/placeholder.svg?key=8ej2k",
      },
      pinned: true,
      category: "Maintenance",
      building: "All Buildings",
      comments: 5,
      likes: 12,
    },
    {
      id: 2,
      title: "Community BBQ",
      content:
        "Join us for a community BBQ in the courtyard on May 20th at 4pm. Food and drinks will be provided. This is a great opportunity to meet your neighbors and enjoy some delicious food!",
      date: "Apr 27, 2024",
      author: {
        name: "Sarah Johnson",
        role: "Property Manager",
        avatar: "/placeholder.svg?key=8ej2k",
      },
      pinned: true,
      category: "Events",
      building: "Sunset Towers",
      comments: 15,
      likes: 32,
    },
    {
      id: 3,
      title: "Parking Lot Repainting",
      content:
        "The parking lot will be repainted on May 10th. Please move your vehicles by 8am. The work should be completed by 5pm the same day. Temporary parking will be available on the street.",
      date: "Apr 25, 2024",
      author: {
        name: "Sarah Johnson",
        role: "Property Manager",
        avatar: "/placeholder.svg?key=8ej2k",
      },
      pinned: false,
      category: "Maintenance",
      building: "Sunset Towers",
      comments: 8,
      likes: 5,
    },
  ]

  const communityPosts = [
    {
      id: 1,
      content:
        "Does anyone have recommendations for a good local plumber? I need some minor repairs done in my bathroom.",
      date: "Apr 30, 2024",
      author: {
        name: "Michael Chen",
        unit: "Apt 201",
        avatar: "/placeholder.svg?key=9fk3l",
      },
      category: "Recommendations",
      comments: 7,
      likes: 3,
    },
    {
      id: 2,
      content:
        "I found a set of keys in the lobby. They have a blue keychain with a dolphin. Please contact me if they're yours!",
      date: "Apr 29, 2024",
      author: {
        name: "Emily Rodriguez",
        unit: "Apt 512",
        avatar: "/placeholder.svg?key=7dk2j",
      },
      category: "Lost & Found",
      comments: 2,
      likes: 8,
    },
    {
      id: 3,
      content:
        "I'm selling my dining table and chairs. Great condition, only 1 year old. $200 OBO. Message me if interested!",
      date: "Apr 28, 2024",
      author: {
        name: "David Wilson",
        unit: "Apt 405",
        avatar: "/placeholder.svg?key=5hl9m",
      },
      category: "Marketplace",
      comments: 5,
      likes: 2,
    },
  ]

  const categories = [
    { name: "All", count: announcements.length + communityPosts.length },
    { name: "Announcements", count: announcements.length },
    { name: "Maintenance", count: announcements.filter((a) => a.category === "Maintenance").length },
    { name: "Events", count: announcements.filter((a) => a.category === "Events").length },
    { name: "Community", count: communityPosts.length },
    { name: "Marketplace", count: communityPosts.filter((p) => p.category === "Marketplace").length },
    { name: "Lost & Found", count: communityPosts.filter((p) => p.category === "Lost & Found").length },
    { name: "Recommendations", count: communityPosts.filter((p) => p.category === "Recommendations").length },
  ]

  const buildings = ["All Buildings", "Sunset Towers", "Riverside Apartments", "Oakwood Residences"]

  // Filter posts based on search query, category, and building
  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      (activeCategory === "All" || activeCategory === "Announcements" || announcement.category === activeCategory) &&
      (activeBuilding === "All Buildings" || announcement.building === activeBuilding) &&
      (announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredCommunityPosts = communityPosts.filter(
    (post) =>
      (activeCategory === "All" || activeCategory === "Community" || post.category === activeCategory) &&
      post.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bulletin Board</h1>
        <p className="text-muted-foreground">
          Stay connected with your building community and important announcements.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <div className="px-4 pb-4 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                      activeCategory === category.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <span>{category.name}</span>
                    <Badge variant={activeCategory === category.name ? "outline" : "secondary"} className="ml-auto">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Building Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <div className="px-4 pb-4 space-y-1">
                {buildings.map((building) => (
                  <button
                    key={building}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                      activeBuilding === building ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveBuilding(building)}
                  >
                    <span>{building}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
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
              <Button size="sm" onClick={() => setIsNewPostModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>

          {/* Custom Dialog for New Post */}
          <CustomDialog
            isOpen={isNewPostModalOpen}
            onClose={() => setIsNewPostModalOpen(false)}
            title="Create New Post"
            footer={
              <>
                <Button variant="outline" onClick={() => setIsNewPostModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewPost} disabled={!newPostContent.trim()}>
                  Post
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px]"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Tag className="mr-2 h-3.5 w-3.5" />
                  Category
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <Users className="mr-2 h-3.5 w-3.5" />
                  Audience
                </Button>
              </div>
            </div>
          </CustomDialog>

          <Tabs defaultValue="announcements" className="space-y-4">
            <TabsList>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="announcements" className="space-y-4">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className={announcement.pinned ? "border-primary/50" : ""}>
                    {announcement.pinned && (
                      <div className="bg-primary/10 px-4 py-1 text-xs font-medium text-primary flex items-center">
                        <Pin className="mr-1 h-3 w-3" />
                        Pinned Announcement
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{announcement.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {announcement.date}
                            <Separator orientation="vertical" className="h-3" />
                            <Building className="h-3 w-3" />
                            {announcement.building}
                            <Separator orientation="vertical" className="h-3" />
                            <Tag className="h-3 w-3" />
                            {announcement.category}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={announcement.author.avatar || "/placeholder.svg"}
                            alt={announcement.author.name}
                          />
                          <AvatarFallback>
                            {announcement.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <span className="font-medium">{announcement.author.name}</span>
                          <span className="text-muted-foreground"> • {announcement.author.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{announcement.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{announcement.comments}</span>
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">No announcements found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="community" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="min-h-[100px]"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm">
                      <Tag className="mr-2 h-3.5 w-3.5" />
                      Category
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Users className="mr-2 h-3.5 w-3.5" />
                      Audience
                    </Button>
                  </div>
                  <Button size="sm" disabled={!newPostContent.trim()} onClick={handleNewPost}>
                    Post
                  </Button>
                </CardFooter>
              </Card>

              {filteredCommunityPosts.length > 0 ? (
                filteredCommunityPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{post.author.unit}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{post.content}</p>
                      <Badge variant="outline" className="mt-3">
                        {post.category}
                      </Badge>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">No community posts found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
