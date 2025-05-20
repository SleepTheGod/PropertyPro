"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="mx-auto my-4 max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle>Something went wrong</CardTitle>
            </div>
            <CardDescription>
              An error occurred while rendering this component. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono overflow-auto max-h-40">{this.state.error?.message || "Unknown error"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
