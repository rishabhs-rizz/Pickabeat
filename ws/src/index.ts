import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const url = new URL(req.url!, "http://localhost");
  const ticket = url.searchParams.get("ticket");

  if (!ticket) {
    ws.close(1008, "Missing ticket");
    return;
  }

  try {
    const payload = jwt.verify(ticket, process.env.WS_SECRET!);
    console.log("User connected:", payload);
    // safe to proceed
  } catch (err) {
    ws.close(1008, "Invalid ticket");
  }
});
