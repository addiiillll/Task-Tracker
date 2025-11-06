import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // Public routes (auth pages)
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register"
  
  // Protected routes
  const isProtectedRoute = pathname.startsWith("/tasks")

  // If user has token and tries to access public routes, redirect to /tasks
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/tasks", req.url))
  }

  // If user has no token and tries to access protected routes, redirect to /
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Otherwise allow the request
  return NextResponse.next()
}

// Apply middleware to relevant routes
export const config = {
  matcher: [
    "/",
    "/auth/register", 
    "/tasks/:path*"
  ],
}