import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  // If token exists and user tries to access root ("/" or "/login" or "/register"), redirect to /tasks
  if (token && (req.nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL("/tasks", req.url))
  }

  // If no token and user tries to access protected route, redirect to /
  if (!token && req.nextUrl.pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Otherwise allow request
  return NextResponse.next()
}

// Apply middleware to all routes except static files and Next internal paths
export const config = {
  matcher: ["/", "/auth/register", "/tasks/:path*"],
}
