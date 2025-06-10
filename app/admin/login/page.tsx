"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Shield, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user.role === "admin") {
          toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard",
          })
          router.push("/admin/dashboard")
        } else {
          setError("Access denied. Admin privileges required.")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">PropertyPro Administration</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-200 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Email: root@admin.com</p>
                <p>Password: root</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
