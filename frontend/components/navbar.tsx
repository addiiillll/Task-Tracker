"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, LogIn, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { authApi } from "@/lib/api/auth"

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    authApi
      .validate()
      .then((r) => setUserEmail(r.user.email))
      .catch(() => setUserEmail(null))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">Task Tracker</span>
              </Link>
            </div>

            <nav className="flex items-center gap-4">
              {userEmail ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {userEmail}
                  </span>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={async () => {
                      try {
                        await authApi.logout()
                        setUserEmail(null)
                        window.location.reload()
                      } catch {}
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={() => setAuthOpen(true)}
                >
                  <LogIn className="h-4 w-4" /> Login / Register
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={async () => {
          try {
            const r = await authApi.validate()
            setUserEmail(r.user.email)
          } catch {}
        }}
      />
    </>
  )
}