import { NextResponse } from "next/server";
// Your auth logic here (e.g., check cookie)
export async function GET(req) {
    const isAuthenticated = true; // Replace with real check
    return NextResponse.json({ loggedIn: isAuthenticated });
}