import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  verifyCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password || !verifyCredentials(username, password)) {
      return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, createAuthToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 500 });
  }
}
