import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { athensNow, isBusinessDay, isSlotBookable, isValidISODate, SLOT_TIMES } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!isValidISODate(date)) {
    return Response.json({ ok: false, error: "Invalid date" }, { status: 400 });
  }
  if (!isBusinessDay(date)) {
    return Response.json({ ok: true, date, slots: SLOT_TIMES.map((time) => ({ time, available: false })) });
  }
  try {
    const booked = await db
      .select({ time: appointments.time })
      .from(appointments)
      .where(and(eq(appointments.date, date), ne(appointments.status, "cancelled")));
    const taken = new Set(booked.map((b) => b.time));
    const now = athensNow();
    const slots = SLOT_TIMES.map((time) => ({
      time,
      available: !taken.has(time) && isSlotBookable(date, time, now),
    }));
    return Response.json({ ok: true, date, slots }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[availability]", error);
    return Response.json({ ok: false, error: "Unavailable" }, { status: 500 });
  }
}
