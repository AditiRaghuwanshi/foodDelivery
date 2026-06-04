import { NextResponse } from "next/server";
import { MENU, CATEGORIES } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ categories: CATEGORIES, items: MENU });
}