import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  CreditCard,
  MessageSquare,
  Wrench,
  Shield,
  Users,
  BarChart3,
  Bell,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Manage multiple properties, units, and tenant information in one centralized platform.",
      color: "bg-blue-500",
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Secure online rent collection with Stripe integration and automated late fee management.",
      color: "bg-green-500",
    },
    {
      icon: Wrench,
      title: "Maintenance Requests",
      description: "Streamlined maintenance request system with priority levels and status tracking.",
      color: "bg-orange-500",
    },
    {
      icon: MessageSquare,
      title: "Bulletin Board",
      description: "Community communication hub for announcements, events, and tenant interactions.",
      color: "bg-purple-500",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated email and SMS notifications for rent reminders and important updates.",
      color: "bg-red-500",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive reporting and analytics for property performance and financials.",
      color: "bg-indigo-500",
    },
  ]

  const userRoles = [
    {
      title: "Property Managers",
      description: "Complete administrative control with tenant management, payment tracking, and reporting.",
      features: ["Tenant Management", "Payment Processing", "Maintenance Oversight", "Financial Reports"],
    },
    {
      title: "Landlords",
      description: "Property oversight with revenue tracking and maintenance coordination.",
      features: ["Property Analytics", "Revenue Tracking", "Maintenance Approval", "Tenant Communication"],
    },
    {
      title: "Tenants",
      description: "Self-service portal for payments, maintenance requests, and community interaction.",
      features: ["Online Rent Payment", "Maintenance Requests", "Bulletin Board Access", "Payment History"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PropertyPro</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/admin/login">
                <Button>Admin Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Production Ready Template
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Property Management
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive property management system with tenant portals, payment processing, maintenance tracking,
            and community features. Built with Next.js, TypeScript, and modern web technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Admin Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage properties efficiently and keep tenants happy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored experiences for property managers, landlords, and tenants.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Security</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your data is protected with industry-standard security measures and compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "SSL Encryption",
              "Secure Authentication",
              "Data Backup",
              "Role-Based Access",
              "Payment Security",
              "GDPR Compliant",
              "Regular Updates",
              "24/7 Monitoring",
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of property managers who trust PropertyPro for their daily operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">PropertyPro</span>
              </div>
              <p className="text-gray-400">Modern property management software for the digital age.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Property Management</li>
                <li>Payment Processing</li>
                <li>Maintenance Tracking</li>
                <li>Tenant Portal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
