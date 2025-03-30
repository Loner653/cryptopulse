import { db } from "../../../lib/db";
import { messages, users } from "../../../lib/db/schema";
import { eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
    const accept = request.headers.get("accept");

    if (accept === "text/event-stream") {
        const headers = {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        };

        const stream = new ReadableStream({
            async start(controller) {
                const sendEvent = (data) => {
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                };

                // Initial messages
                let lastMessageId = 0;
                try {
                    const allMessages = await db
                        .select({
                            id: messages.id,
                            text: messages.text,
                            timestamp: messages.timestamp,
                            username: users.username,
                        })
                        .from(messages)
                        .leftJoin(users, eq(messages.userId, users.id))
                        .orderBy(messages.id);
                    if (allMessages.length > 0) {
                        lastMessageId = allMessages[allMessages.length - 1].id;
                        sendEvent({ type: "initial", messages: allMessages });
                    }
                } catch (err) {
                    console.error("SSE initial fetch error:", err.message);
                    sendEvent({ type: "error", message: "Failed to load messages" });
                }

                // Poll for new messages
                const interval = setInterval(async () => {
                    try {
                        const newMessages = await db
                            .select({
                                id: messages.id,
                                text: messages.text,
                                timestamp: messages.timestamp,
                                username: users.username,
                            })
                            .from(messages)
                            .leftJoin(users, eq(messages.userId, users.id))
                            .where(gt(messages.id, lastMessageId)) // Only fetch messages after last ID
                            .orderBy(messages.id);
                        if (newMessages.length > 0) {
                            lastMessageId = newMessages[newMessages.length - 1].id;
                            sendEvent({ type: "new", messages: newMessages });
                        }
                    } catch (err) {
                        console.error("SSE polling error:", err.message);
                    }
                }, 2000);

                request.signal.addEventListener("abort", () => {
                    clearInterval(interval);
                    controller.close();
                });
            },
        });

        return new NextResponse(stream, { headers });
    }

    // Regular GET
    try {
        const allMessages = await db
            .select({
                id: messages.id,
                text: messages.text,
                timestamp: messages.timestamp,
                username: users.username,
            })
            .from(messages)
            .leftJoin(users, eq(messages.userId, users.id))
            .orderBy(messages.id);
        return NextResponse.json(allMessages, { status: 200 });
    } catch (err) {
        console.log("GET error:", err.message);
        return NextResponse.json({ message: "Can’t get messages" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { text, userId } = await req.json();
        if (!text || !userId) {
            return NextResponse.json({ message: "Missing text or userId" }, { status: 400 });
        }
        const [inserted] = await db
            .insert(messages)
            .values({ text, userId, timestamp: new Date() })
            .returning();
        const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId));
        console.log("Inserted message:", inserted);
        return NextResponse.json({ ...inserted, username: user.username }, { status: 201 });
    } catch (err) {
        console.log("POST error:", err.message);
        return NextResponse.json({ message: "Can’t save message" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const adminToken = req.headers.get("X-Admin-Token");

        console.log("Deleting message with id:", id);
        console.log("Admin token:", adminToken);

        if (adminToken !== "true") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
        }

        if (!id) {
            return NextResponse.json({ message: "Missing message ID" }, { status: 400 });
        }

        const deleted = await db
            .delete(messages)
            .where(eq(messages.id, parseInt(id)))
            .returning();

        if (deleted.length === 0) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        console.log("Deleted message:", deleted);
        return NextResponse.json({ message: "Message deleted" }, { status: 200 });
    } catch (err) {
        console.log("DELETE error:", err.message);
        return NextResponse.json({ message: "Can’t delete message" }, { status: 500 });
    }
}