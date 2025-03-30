import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";

export async function GET() {
    try {
        const allMessages = await db.select().from(messages).orderBy(messages.id);
        console.log("Fetched messages:", allMessages);
        return new Response(JSON.stringify(allMessages), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.log("GET error:", err.message);
        return new Response("Can’t get messages: " + err.message, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newMessage = await request.json();
        console.log("Received message:", newMessage);
        const inserted = await db
            .insert(messages)
            .values({
                text: newMessage.text,
                timestamp: new Date(newMessage.timestamp),
            })
            .returning();
        console.log("Inserted message:", inserted);
        return new Response(JSON.stringify(inserted[0]), { status: 201 });
    } catch (err) {
        console.log("POST error:", err.message);
        return new Response("Can’t save message: " + err.message, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        console.log("Deleting message with id:", id);

        if (!id) {
            return new Response("Missing message ID", { status: 400 });
        }

        const deleted = await db
            .delete(messages)
            .where(messages.id.eq(parseInt(id)))
            .returning();

        if (deleted.length === 0) {
            return new Response("Message not found", { status: 404 });
        }

        console.log("Deleted message:", deleted);
        return new Response("Message deleted", { status: 200 });
    } catch (err) {
        console.log("DELETE error:", err.message);
        return new Response("Can’t delete message: " + err.message, { status: 500 });
    }
}