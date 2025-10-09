import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Récupérer le token d'authentification depuis les cookies
  const session = request.cookies.get("session")?.value

  // Vérifier si l'utilisateur essaie d'accéder aux routes admin (sauf login)
  if (
    !session &&
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Vérifier si l'utilisateur essaie d'accéder au dashboard sans authentification
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/connexion"
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}