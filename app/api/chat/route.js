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

    let timestamp;
    if (newMessage.timestamp) {
      timestamp = Date.parse(newMessage.timestamp)
        ? new Date(newMessage.timestamp)
        : new Date();
    } else {
      timestamp = new Date();
    }

    if (isNaN(timestamp.getTime())) {
      throw new Error("Invalid timestamp format");
    }

    const inserted = await db
      .insert(messages)
      .values({
        text: newMessage.text,
        timestamp,
      })
      .returning();

    console.log("Inserted message:", inserted);
    return new Response(JSON.stringify(inserted[0]), { status: 201 });
  } catch (err) {
    console.log("POST error:", err.message);
    return new Response("Can’t save message: " + err.message, { status: 500 });
  }
}
