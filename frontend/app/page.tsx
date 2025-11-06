"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.validate()
        // If validation succeeds, redirect to tasks
        router.push("/tasks")
      } catch {
        // User is not authenticated, show login form
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}
