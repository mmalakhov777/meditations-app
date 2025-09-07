import { NextRequest, NextResponse } from "next/server";
import { upsertUserFromInitData } from "@/lib/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const initUnsafe = body.initDataUnsafe || body.initData || null;
    if (!initUnsafe?.user?.id) {
      return NextResponse.json({ ok: false, error: "no_user" }, { status: 400 });
    }
    const user = await upsertUserFromInitData(initUnsafe);
    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


