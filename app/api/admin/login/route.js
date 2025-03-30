import { NextResponse } from "next/server";

export async function POST(req) {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }
}
