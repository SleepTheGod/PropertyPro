"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, Clock, FileImage, Paperclip } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function MaintenancePage() {
  const [files, setFiles] = useState<File[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      // Reset form or redirect
    }, 3000)
  }

  // Mock maintenance requests
  const maintenanceRequests = [
    {
      id: 1,
      title: "Leaking faucet in bathroom",
      description: "The bathroom sink faucet is leaking constantly, causing water to pool around the base.",
      status: "In Progress",
      priority: "Medium",
      date: "Apr 28, 2024",
      updates: [
        { date: "Apr 28, 2024", message: "Request received", user: "System" },
        { date: "Apr 29, 2024", message: "Assigned to maintenance team", user: "Admin" },
        { date: "Apr 30, 2024", message: "Scheduled for May 2nd between 10am-12pm", user: "Maintenance" },
      ],
    },
    {
      id: 2,
      title: "AC not cooling properly",
      description: "The air conditioner is running but not cooling the apartment effectively.",
      status: "Scheduled",
      priority: "High",
      date: "Apr 25, 2024",
      updates: [
        { date: "Apr 25, 2024", message: "Request received", user: "System" },
        { date: "Apr 26, 2024", message: "Assigned to HVAC specialist", user: "Admin" },
        { date: "Apr 27, 2024", message: "Scheduled for May 1st between 1pm-3pm", user: "Maintenance" },
      ],
    },
    {
      id: 3,
      title: "Light bulb replacement",
      description: "The ceiling light in the living room has burned out and needs replacement.",
      status: "Completed",
      priority: "Low",
      date: "Apr 20, 2024",
      updates: [
        { date: "Apr 20, 2024", message: "Request received", user: "System" },
        { date: "Apr 21, 2024", message: "Assigned to maintenance team", user: "Admin" },
        { date: "Apr 22, 2024", message: "Completed - Light bulb replaced", user: "Maintenance" },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
        <p className="text-muted-foreground">Submit and track maintenance requests for your unit.</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {maintenanceRequests.filter((req) => req.status !== "Completed").length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No active requests</AlertTitle>
              <AlertDescription>You don't have any active maintenance requests at this time.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {maintenanceRequests
                .filter((req) => req.status !== "Completed")
                .map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{request.title}</CardTitle>
                          <CardDescription>Submitted on {request.date}</CardDescription>
                        </div>
                        <div
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            request.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{request.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Priority:</span>
                          <span
                            className={`${
                              request.priority === "High"
                                ? "text-red-600"
                                : request.priority === "Medium"
                                  ? "text-amber-600"
                                  : "text-green-600"
                            }`}
                          >
                            {request.priority}
                          </span>
                        </div>
                        <Separator />
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Recent Updates</h4>
                          <div className="space-y-2">
                            {request.updates.slice(-2).map((update, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs">
                                <Clock className="h-3 w-3 mt-0.5 text-muted-foreground" />
                                <div>
                                  <span className="text-muted-foreground">{update.date}:</span> {update.message}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Maintenance Request</CardTitle>
              <CardDescription>Please provide details about the issue you're experiencing.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {formSubmitted && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>Your maintenance request has been submitted successfully.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input id="title" placeholder="Brief description of the issue" required />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="appliance">Appliance</SelectItem>
                        <SelectItem value="structural">Structural</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Not Urgent</SelectItem>
                        <SelectItem value="medium">Medium - Needs Attention</SelectItem>
                        <SelectItem value="high">High - Urgent Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible about the issue"
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access">Access Instructions</Label>
                  <Textarea id="access" placeholder="Any special instructions for accessing your unit" rows={2} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Attach Photos or Videos (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="files"
                      className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span>Choose files</span>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </Label>
                    {files.length > 0 && (
                      <span className="text-sm text-muted-foreground">{files.length} file(s) selected</span>
                    )}
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                          <FileImage className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {maintenanceRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{request.title}</CardTitle>
                      <CardDescription>Submitted on {request.date}</CardDescription>
                    </div>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{request.description}</p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Request Timeline</h4>
                      <div className="relative pl-6">
                        <div className="absolute bottom-0 left-0 top-0 w-px bg-border" />
                        <div className="space-y-4">
                          {request.updates.map((update, index) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full border bg-background" />
                              <div className="mb-1 text-sm font-medium">{update.message}</div>
                              <div className="text-xs text-muted-foreground">
                                {update.date} • {update.user}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    {request.status === "Completed" ? "Submit Feedback" : "Add Comment"}
                  </Button>
                  {request.status === "Completed" && (
                    <Button variant="outline" size="sm">
                      Create Similar Request
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
