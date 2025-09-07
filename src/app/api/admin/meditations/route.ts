import { NextRequest, NextResponse } from "next/server";
import { deleteItem, upsertItem, readMonth } from "@/lib/server/meditations-admin";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));
  if (!year || !month) return NextResponse.json({ ok: false, error: "year/month required" }, { status: 400 });
  const doc = await readMonth(year, month);
  return NextResponse.json({ ok: true, doc });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const doc = await upsertItem(body);
  return NextResponse.json({ ok: true, doc });
}

export async function DELETE(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));
  const id = req.nextUrl.searchParams.get("id");
  if (!year || !month || !id) return NextResponse.json({ ok: false, error: "id/year/month required" }, { status: 400 });
  const doc = await deleteItem(id, year, month);
  return NextResponse.json({ ok: true, doc });
}


