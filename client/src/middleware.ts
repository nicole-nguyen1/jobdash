import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const session = cookies().get("session");

	if (session == null && req.nextUrl.pathname !== "/") {
		return NextResponse.redirect(req.nextUrl.origin);
	} else if (session != null && req.nextUrl.pathname === "/") {
		return NextResponse.redirect(req.nextUrl.origin + "/home");
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
