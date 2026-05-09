import { NextResponse } from "next/server";
import { getAlleTagesmuetter } from "@/lib/steckbriefe";

export async function GET() {
  const steckbriefe = await getAlleTagesmuetter();
  return NextResponse.json(steckbriefe);
}
