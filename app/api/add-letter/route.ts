import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
    try {
        const {text} = await req.json()

        
    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 400})
    }
}