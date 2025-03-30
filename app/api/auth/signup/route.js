import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        console.log("Signup endpoint hit");
        const { username, password } = await req.json();
        console.log("Received:", { username, password });
        if (!username || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        console.log("Checking existing user...");
        const existingUser = await db.select().from(users).where(eq(users.username, username));
        console.log("Existing user:", existingUser);
        if (existingUser.length > 0) {
            return NextResponse.json({ message: "Username taken" }, { status: 400 });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Inserting user...");
        const [newUser] = await db
            .insert(users)
            .values({ username, password: hashedPassword })
            .returning();
        console.log("Inserted user:", newUser);

        return NextResponse.json({ message: "User created", userId: newUser.id }, { status: 201 });
    } catch (err) {
        console.error("Signup error:", err.message); // Use console.error for consistency
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}