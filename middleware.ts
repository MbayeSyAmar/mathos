import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Récupérer le token d'authentification depuis les cookies
  const session = request.cookies.get("session")?.value

  // Vérifier si l'utilisateur est authentifié pour accéder aux routes protégées
  if (
    !session &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")))
  ) {
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
