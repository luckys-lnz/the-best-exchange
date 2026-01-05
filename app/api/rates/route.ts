import { NextResponse } from "next/server";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYmkwjHlwBNptKzeXwMimP3uAR6P-c8UuJnLt-5ZucPo2sEE921-re46ouye6b2A-uJUpEMm4TFJ2n/pub?output=csv";

export const dynamic = "force-dynamic"; // 🚀 disables Next cache completely

export async function GET() {
  try {
    const res = await fetch(`${SHEET_URL}&_ts=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Google Sheet" },
        { status: 500 }
      );
    }

    const text = await res.text();
    const rows = text.trim().split("\n").slice(1);

    let BUY_RATE: number | null = null;
    let SELL_RATE: number | null = null;

    for (const row of rows) {
      const [key, value] = row.split(",");
      const num = Number(value);

      if (key === "BUY_RATE") BUY_RATE = num;
      if (key === "SELL_RATE") SELL_RATE = num;
    }

    if (BUY_RATE === null || SELL_RATE === null) {
      return NextResponse.json(
        { error: "Invalid sheet data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      BUY_RATE,
      SELL_RATE,
      updatedAt: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
