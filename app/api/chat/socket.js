// server.js (run with `node server.js`)
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const filePath = path.join(__dirname, "data", "chat.json");

async function initFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
}

app.use(express.json());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send all messages to new user
  initFile().then(() => {
    fs.readFile(filePath, "utf-8").then((data) => {
      socket.emit("initialMessages", JSON.parse(data));
    });
  });

  // Handle new message
  socket.on("sendMessage", async (message) => {
    const messages = JSON.parse(await fs.readFile(filePath, "utf-8"));
    messages.push(message);
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
    io.emit("newMessage", message); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("WebSocket server running on port 4000");
});