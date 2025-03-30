import { db } from "@/lib/db";
import { messages, users } from "@/lib/db/schema";
import { eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
    const accept = request.headers.get("accept");
    console.log("GET at:", new Date().toISOString(), "Accept:", accept);

    if (accept === "text/event-stream") {
        const headers = {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Keep-Alive": "timeout=120", // Longer timeout
        };

        const stream = new ReadableStream({
            async start(controller) {
                console.log("SSE stream started at:", new Date().toISOString());
                const sendEvent = (data) => {
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                };

                let lastMessageId = 0;
                try {
                    const startTime = Date.now();
                    const allMessages = await db
                        .select({
                            id: messages.id,
                            text: messages.text,
                            timestamp: messages.timestamp,
                            username: users.username,
                        })
                        .from(messages)
                        .leftJoin(users, eq(messages.userId, users.id))
                        .orderBy(messages.id)
                        .limit(50);
                    const endTime = Date.now();
                    console.log("Initial fetch took:", endTime - startTime, "ms", "Messages:", allMessages.length);
                    if (allMessages.length > 0) {
                        lastMessageId = allMessages[allMessages.length - 1].id;
                        sendEvent({ type: "initial", messages: allMessages });
                    }
                } catch (err) {
                    console.error("Initial fetch error at:", new Date().toISOString(), "Details:", err.message);
                    sendEvent({ type: "error", message: "Failed to load messages" });
                    controller.close();
                    return;
                }

                let lastKeepalive = Date.now();
                let isActive = true;
                const interval = setInterval(async () => {
                    if (!isActive) return;
                    try {
                        const startTime = Date.now();
                        const newMessages = await db
                            .select({
                                id: messages.id,
                                text: messages.text,
                                timestamp: messages.timestamp,
                                username: users.username,
                            })
                            .from(messages)
                            .leftJoin(users, eq(messages.userId, users.id))
                            .where(gt(messages.id, lastMessageId))
                            .orderBy(messages.id)
                            .limit(10);
                        const endTime = Date.now();
                        console.log("Poll took:", endTime - startTime, "ms", "New:", newMessages.length);
                        if (newMessages.length > 0) {
                            lastMessageId = newMessages[newMessages.length - 1].id;
                            sendEvent({ type: "new", messages: newMessages });
                        }
                        if (endTime - lastKeepalive >= 5000) {
                            controller.enqueue(":keepalive\n\n");
                            lastKeepalive = endTime;
                            console.log("Keepalive sent at:", new Date().toISOString());
                        }
                    } catch (err) {
                        console.error("Polling error at:", new Date().toISOString(), "Details:", err.message);
                        sendEvent({ type: "error", message: "Polling failed" });
                    }
                }, 1000);

                request.signal.addEventListener("abort", () => {
                    isActive = false;
                    clearInterval(interval);
                    controller.close();
                    console.log("Stream aborted at:", new Date().toISOString());
                });
            },
            cancel() {
                console.log("Stream cancelled at:", new Date().toISOString());
            },
        });

        return new NextResponse(stream, { headers });
    }

    try {
        const startTime = Date.now();
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
        const endTime = Date.now();
        console.log("GET fetch took:", endTime - startTime, "ms", "Messages:", allMessages.length);
        return NextResponse.json(allMessages, { status: 200 });
    } catch (err) {
        console.error("GET error at:", new Date().toISOString(), "Details:", err.message);
        return NextResponse.json({ message: "Can’t get messages" }, { status: 500 });
    }
}

export async function POST(req) {
    console.log("POST at:", new Date().toISOString());
    try {
        const { text, userId } = await req.json();
        if (!text || !userId) {
            return NextResponse.json({ message: "Missing text or userId" }, { status: 400 });
        }
        const startTime = Date.now();
        const [inserted] = await db
            .insert(messages)
            .values({ text, userId, timestamp: new Date() })
            .returning();
        const [user] = await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.id, userId));
        const endTime = Date.now();
        console.log("POST took:", endTime - startTime, "ms", "Message:", inserted);
        return NextResponse.json({ ...inserted, username: user.username }, { status: 201 });
    } catch (err) {
        console.error("POST error at:", new Date().toISOString(), "Details:", err.message);
        return NextResponse.json({ message: "Can’t save message" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const adminToken = req.headers.get("X-Admin-Token");

        console.log("DELETE at:", new Date().toISOString(), "ID:", id, "Token:", adminToken);

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

        console.log("Deleted:", deleted);
        return NextResponse.json({ message: "Message deleted" }, { status: 200 });
    } catch (err) {
        console.error("DELETE error at:", new Date().toISOString(), "Details:", err.message);
        return NextResponse.json({ message: "Can’t delete message" }, { status: 500 });
    }
}
