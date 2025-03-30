import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "chat.json");

async function initFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
}

export async function GET() {
  await initFile();
  const data = await fs.readFile(filePath, "utf-8");
  return new Response(data, { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request) {
  await initFile();
  const newMessage = await request.json();
  const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
  data.push(newMessage);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return new Response(JSON.stringify(newMessage), { status: 201 });
}