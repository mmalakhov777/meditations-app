import { NextRequest, NextResponse } from "next/server";
import { getUserByTelegramId, updateUserFavorites } from "@/lib/services/user-service";
import { addFavoriteMeditation, removeFavoriteMeditation } from "@/lib/user-schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramIdParam = searchParams.get("telegramId");
    const telegramId = telegramIdParam ? Number(telegramIdParam) : NaN;
    if (!telegramId || Number.isNaN(telegramId)) {
      return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
    }
    const user = await getUserByTelegramId(telegramId);
    if (!user) return NextResponse.json({ favorites: [] });
    return NextResponse.json({ favorites: user.favoriteMeditations });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const telegramId = Number(body?.telegramId);
    const meditationId = String(body?.meditationId || "");
    const action = (body?.action as "add" | "remove" | "toggle") || "toggle";

    if (!telegramId || Number.isNaN(telegramId)) {
      return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
    }
    if (!meditationId) {
      return NextResponse.json({ error: "meditationId is required" }, { status: 400 });
    }

    const user = await getUserByTelegramId(telegramId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let nextFavorites: string[] = user.favoriteMeditations || [];
    const isAlready = nextFavorites.includes(meditationId);

    if (action === "add" || (action === "toggle" && !isAlready)) {
      nextFavorites = addFavoriteMeditation(user, meditationId);
    } else if (action === "remove" || (action === "toggle" && isAlready)) {
      nextFavorites = removeFavoriteMeditation(user, meditationId);
    }

    await updateUserFavorites(telegramId, nextFavorites);

    const isFavorite = nextFavorites.includes(meditationId);
    return NextResponse.json({ favorites: nextFavorites, isFavorite });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update favorites" }, { status: 500 });
  }
}


