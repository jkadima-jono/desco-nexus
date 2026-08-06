import { NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";

export function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  return params.then(({ locale }) => {
    if (!isLocale(locale)) {
      return new NextResponse(
        "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Page not found — DESCO Compass</title></head><body><main><h1>Page not found</h1><p>The requested DESCO Compass page does not exist.</p><p><a href=\"/\">Return to the homepage</a></p></main></body></html>",
        { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }
    const destination = request.nextUrl.clone();
    destination.pathname = "/";
    const response = NextResponse.redirect(destination);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  });
}
