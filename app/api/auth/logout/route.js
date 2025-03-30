import { NextResponse } from "next/server";
export async function POST() {
    // Clear session/cookie here
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
}