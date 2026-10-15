import { NextResponse } from "next/server"
import { auth } from "@/auth"

// Runs in the Node.js runtime (not Edge) because `auth()` is built with the
// Prisma adapter, which needs Node APIs.
export const runtime = "nodejs"

const PUBLIC_PATHS = new Set(["/", "/login"])

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth?.user

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin")) {
    // @ts-expect-error role is added to the session in auth.config.ts
    const role = req.auth?.user?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
