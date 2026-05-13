import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const redirectTo = searchParams.get("redirectTo") ?? "/account";
  const loginUrl = new URL("/account", req.url);
  loginUrl.searchParams.set("callbackUrl", redirectTo);
  return NextResponse.redirect(loginUrl);
};
