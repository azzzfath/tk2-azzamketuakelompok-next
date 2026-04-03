import { NextResponse } from "next/server";

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

function forwardCookie(headers: Headers): Record<string, string> {
  const cookie = headers.get("cookie");
  if (!cookie) return {};
  return { cookie };
}

export async function GET(request: Request) {
  const backendUrl = getBackendUrl();
  const res = await fetch(`${backendUrl}/api/theme`, {
    method: "GET",
    headers: forwardCookie(request.headers),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const backendUrl = getBackendUrl();
  const body = await request.json().catch(() => null);

  const res = await fetch(`${backendUrl}/api/theme`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...forwardCookie(request.headers),
    },
    body: JSON.stringify(body ?? {}),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

