import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building, Shield, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="text-xl font-bold">PropertyPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#roles" className="text-sm font-medium hover:underline underline-offset-4">
              User Roles
            </Link>
            <Link href="#security" className="text-sm font-medium hover:underline underline-offset-4">
              Security
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" passHref>
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Simplify Property Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A comprehensive platform for tenants, property managers, and administrators to manage properties,
                    payments, and maintenance requests.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login" passHref>
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="#features" passHref>
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?key=i0gla"
                  alt="Property Management Dashboard"
                  className="rounded-lg object-cover aspect-video"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Core Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a comprehensive set of features to streamline property management.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Payment Integration */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Payment Integration</h3>
                <p className="text-muted-foreground">
                  Multiple payment options including ACH, credit card, crypto, PayPal, Venmo, and more.
                </p>
              </div>

              {/* Maintenance Requests */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Maintenance Requests</h3>
                <p className="text-muted-foreground">
                  Submit, track, and manage maintenance requests with image/video uploads and status tracking.
                </p>
              </div>

              {/* Bulletin Board */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Bulletin Board</h3>
                <p className="text-muted-foreground">
                  Building-specific forums for community announcements, discussions, and marketplace.
                </p>
              </div>

              {/* Billing Management */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-7h-2c0-1-1.5-1-1.5-1H19Z" />
                    <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                    <path d="M16 11h0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Billing Management</h3>
                <p className="text-muted-foreground">
                  Flexible billing options with one-time or recurring payments and automated invoice generation.
                </p>
              </div>

              {/* Notification Center */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Notification Center</h3>
                <p className="text-muted-foreground">
                  Customizable notifications via email, SMS, and push for payments, maintenance, and community updates.
                </p>
              </div>

              {/* Tenant Services */}
              <div className="flex flex-col items-start gap-2 p-6 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tenant Services</h3>
                <p className="text-muted-foreground">
                  Shopping cart for add-on services like cleaning, AC filters, storage, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">User Roles</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform caters to different user types with role-specific features and permissions.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
              {/* Tenant */}
              <div className="flex flex-col p-6 bg-background border rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Tenant</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground">Access to:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Dashboard with bills and payment history
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Payment processing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Maintenance request submission
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Bulletin board access
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Notification preferences
                    </li>
                  </ul>
                </div>
              </div>

              {/* Property Manager */}
              <div className="flex flex-col p-6 bg-background border rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Property Manager</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground">Access to:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Tenant management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Building management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Billing cycle configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Maintenance request management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Notification settings
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Bulletin board moderation
                    </li>
                  </ul>
                </div>
              </div>

              {/* Admin */}
              <div className="flex flex-col p-6 bg-background border rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Admin</h3>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground">Access to:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Platform-wide settings
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      User role management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Security configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Database management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      System-wide reports
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Integration management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Secure Architecture</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is built with security at its core, protecting sensitive data and transactions.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2">
              <div className="flex flex-col p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4">Authentication & Access</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Required for all users except visitors</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Password Strength Enforcement</p>
                      <p className="text-sm text-muted-foreground">
                        Complex password requirements with regular rotation
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">reCAPTCHA Protection</p>
                      <p className="text-sm text-muted-foreground">
                        Prevents automated attacks and unauthorized access
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Device & Browser Checks</p>
                      <p className="text-sm text-muted-foreground">Monitors for suspicious login attempts</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4">Data Protection</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Prepared Statements</p>
                      <p className="text-sm text-muted-foreground">Prevents SQL injection attacks</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Field-level Encryption</p>
                      <p className="text-sm text-muted-foreground">For financial and personal data</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">PCI Compliance</p>
                      <p className="text-sm text-muted-foreground">For all payment processing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <p className="font-medium">Role-based Access Controls</p>
                      <p className="text-sm text-muted-foreground">Ensures users only access appropriate data</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:gap-8 md:px-6">
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="text-xl font-bold">PropertyPro</span>
          </div>
          <div className="flex-1 text-sm text-muted-foreground md:text-right">
            © 2024 PropertyPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
