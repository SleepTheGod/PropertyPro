"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Building,
  CreditCard,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Settings,
  PenToolIcon as Tool,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define navigation based on user role
  // For demo purposes, we'll use a tenant role
  const userRole = "tenant"

  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    switch (userRole) {
      case "tenant":
        return [
          ...baseNavigation,
          { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
          { name: "Maintenance", href: "/dashboard/maintenance", icon: Tool },
          { name: "Bulletin Board", href: "/dashboard/bulletin", icon: MessageSquare },
          { name: "Documents", href: "/dashboard/documents", icon: FileText },
        ]
      case "property_manager":
        return [
          ...baseNavigation,
          { name: "Tenants", href: "/dashboard/tenants", icon: Users },
          { name: "Buildings", href: "/dashboard/buildings", icon: Building },
          { name: "Maintenance", href: "/dashboard/maintenance", icon: Tool },
          { name: "Bulletin Board", href: "/dashboard/bulletin", icon: MessageSquare },
        ]
      case "admin":
        return [
          ...baseNavigation,
          { name: "Users", href: "/dashboard/users", icon: Users },
          { name: "Properties", href: "/dashboard/properties", icon: Building },
          { name: "System", href: "/dashboard/system", icon: Settings },
          { name: "Administration", href: "/dashboard/admin", icon: Settings },
        ]
      default:
        return baseNavigation
    }
  }

  const navigation = getNavigation()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="text-lg font-bold">PropertyPro</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
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
          <span className="text-lg font-bold">PropertyPro</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="text-lg font-bold">PropertyPro</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
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
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
