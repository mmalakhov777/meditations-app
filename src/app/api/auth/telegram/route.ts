import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const initData: string | undefined = body.initData || req.headers.get("x-telegram-init-data") || undefined;
    const payload = { ok: true, initDataPresent: Boolean(initData) };
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


