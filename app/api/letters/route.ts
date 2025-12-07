import redis from "@/lib/redis";
import { NextResponse } from "next/server";



export async function GET() {
    const keys = await redis.zRange("letters", 0, -1, { REV: true })

    const pipe = redis.multi()
    keys.forEach(k => pipe.get(k))

    const raw = await pipe.exec()

    const list = raw.map((x: string, i: number) => {
        const data = JSON.parse(x)
        return {
            id: keys[i].replace('letter:', ''),
            letter: data.text,
            createdAt: data.createdAt
        }
    })


    return NextResponse.json(list)
}