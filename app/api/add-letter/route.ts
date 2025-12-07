import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

const LIMIT = 5
const WINDOW = 60

export async function POST(req: NextRequest) {
  try {
    const { letter, id, createdAt } = await req.json();

    if (!letter || letter.length < 5) {
      return NextResponse.json(
        { error: "Text should atleast have 5 characters" },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(",")[0] || 'unknown'

    const key = `rate:${ip}`
    const count = await redis.incr(key)

    if (count === 1){
        await redis.expire(key, WINDOW)
    }

    if (count > LIMIT){
        return NextResponse.json({error: "Slow down sailor (limit reached)"}, {status: 429})
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
