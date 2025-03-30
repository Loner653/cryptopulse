import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm"; // Add this import

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        if (!username || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const [user] = await db.select().from(users).where(eq(users.username, username)); // Fix this line
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful", userId: user.id }, { status: 200 });
    } catch (err) {
        console.log("Login error:", err.message);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}