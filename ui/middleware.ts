import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Define route permissions
const routePermissions: Record<string, string[]> = {
  "/auth/admin": ["SUPER_ADMIN", "ADMIN"],
  "/auth/sales": ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"],
  "/auth/purchase": ["SUPER_ADMIN", "PURCHASE_MANAGER", "PURCHASE_EXECUTIVE"],
  "/auth/inventory": ["SUPER_ADMIN", "INVENTORY_MANAGER", "INVENTORY_EXECUTIVE"],
  "/auth/quality": ["SUPER_ADMIN", "QUALITY_MANAGER", "QUALITY_EXECUTIVE"],
  "/auth/accounts": ["SUPER_ADMIN", "ACCOUNTS_MANAGER", "ACCOUNTS_EXECUTIVE"],
  "/auth/dashboard": [
    "SUPER_ADMIN",
    "ADMIN",
    "SALES_MANAGER",
    "SALES_EXECUTIVE",
    "PURCHASE_MANAGER",
    "PURCHASE_EXECUTIVE",
    "INVENTORY_MANAGER",
    "INVENTORY_EXECUTIVE",
    "QUALITY_MANAGER",
    "QUALITY_EXECUTIVE",
    "ACCOUNTS_MANAGER",
    "ACCOUNTS_EXECUTIVE",
  ],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname.startsWith("/") || pathname === "/") {
    return NextResponse.next()
  }

  // Check if route requires authentication
  if (pathname.startsWith("/auth")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      const { payload } = await jwtVerify(token, secret)

      const user = payload as any

      // Check route permissions
      const requiredRoles = routePermissions[pathname]
      if (requiredRoles) {
        const hasPermission = user.roles?.some((role: string) => requiredRoles.includes(role))

        if (!hasPermission) {
          return NextResponse.redirect(new URL("/auth/unauthorized", request.url))
        }
      }

      // Add user info to headers for server components
      const response = NextResponse.next()
      response.headers.set("x-user-id", user.id)
      response.headers.set("x-user-roles", JSON.stringify(user.roles))
      response.headers.set("x-user-info", JSON.stringify(user))

      return response
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
