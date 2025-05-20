"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showCloseButton?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function CustomDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
  size = "md",
}: CustomDialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)

  // Handle escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Lock body scroll when dialog is open
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow

    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = originalStyle
    }

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  // Animation effects
  React.useEffect(() => {
    if (isOpen && dialogRef.current && overlayRef.current) {
      // Fade in overlay
      overlayRef.current.style.opacity = "0"
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.opacity = "1"
      }, 10)

      // Slide in dialog
      dialogRef.current.style.transform = "translateY(20px)"
      dialogRef.current.style.opacity = "0"
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.style.transform = "translateY(0)"
          dialogRef.current.style.opacity = "1"
        }
      }, 10)
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
      aria-describedby={description ? "dialog-description" : undefined}
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 transition-opacity duration-200"
        aria-hidden="true"
        onClick={() => onClose()} // Add click handler to close on backdrop click
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          "relative z-50 bg-background rounded-lg shadow-lg w-full p-6 transition-all duration-200",
          sizeClasses[size],
          className,
        )}
      >
        {/* Close button */}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h2 id="dialog-title" className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="my-2">{children}</div>

        {/* Footer */}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function CustomDialogTrigger({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}
