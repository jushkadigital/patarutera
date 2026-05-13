import { signOut } from "@/lib2/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const callbackUrl =
    req.nextUrl.searchParams.get("callbackUrl") ??
    process.env.AUTH_URL ??
    "/";

  await signOut({ redirect: false });

  const response = NextResponse.redirect(new URL(callbackUrl, req.url));
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("_medusa_jwt", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("connect.sid", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("medusa_sync_guest_fallback", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 0,
    path: "/",
  });

  return response;
};
