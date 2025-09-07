import { NextRequest, NextResponse } from "next/server";
import { upsertUserFromInitData } from "@/lib/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const initUnsafe = body.initDataUnsafe || body.initData || null;
    if (!initUnsafe?.user?.id) {
      return NextResponse.json({ ok: false, error: "no_user" }, { status: 400 });
    }
    console.log("[auth] upsert request", {
      uid: initUnsafe.user.id,
      username: initUnsafe.user.username,
      first_name: initUnsafe.user.first_name,
      last_name: initUnsafe.user.last_name,
      allows_write_to_pm: initUnsafe.user.allows_write_to_pm,
      query_id: initUnsafe.query_id,
      auth_date: initUnsafe.auth_date,
    });
    const user = await upsertUserFromInitData(initUnsafe);
    console.log("[auth] upserted user", {
      telegramId: user.telegramId,
      username: user.telegramData.username,
      language: user.telegramLanguageCode,
      favoritesCount: user.favoriteMeditations.length,
      subscription: user.subscriptionStatus,
    });
    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


