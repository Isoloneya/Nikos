import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { restaurantId } = await request.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("restaurantId", restaurantId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}