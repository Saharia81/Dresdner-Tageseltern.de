import { NextResponse } from "next/server";

// Phase 2: Buchungsanfragen entgegennehmen.
export async function POST() {
  return NextResponse.json(
    { message: "Phase 2 – noch nicht implementiert" },
    { status: 501 },
  );
}
