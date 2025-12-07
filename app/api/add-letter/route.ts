import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { letter, id, createdAt } = await req.json();

    if (!letter || letter.length < 5) {
      return NextResponse.json(
        { error: "Text should atleast have 5 characters" },
        { status: 400 }
      );
    }

    await redis.set(
      `letter:${id}`,
      JSON.stringify({ letter, createdAt })
    );

    await redis.zAdd("letters", {
      score: createdAt,
      value: `letter:${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
