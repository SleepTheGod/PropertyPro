"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PenToolIcon as Tool,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const auth = localStorage.getItem("adminAuthenticated") === "true"
    setIsAuthenticated(auth)

    // If not authenticated and not on the login page, redirect to login
    if (!auth && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  // Don't render the layout for the login page or if not authenticated
  if (!isClient || pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: Home },
    { name: "Tenants", href: "/admin/tenants", icon: Users },
    { name: "Maintenance", href: "/admin/maintenance", icon: Tool },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="text-lg font-bold">PropertyPro Admin</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <Separator className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <div className="flex items-center gap-2 md:hidden">
          <Building className="h-6 w-6" />
          <span className="text-lg font-bold">PropertyPro Admin</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Shield className="h-4 w-4" />
                Administrator
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="text-lg font-bold">PropertyPro Admin</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <Separator className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
