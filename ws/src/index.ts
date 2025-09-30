import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "./config";

import dotenv from "dotenv";
import { JoinRoom } from "./JoinRoom";
import { EventInRoom } from "./EventInRoom";
import { LeaveRoom } from "./LeaveRoom";
dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

function CheckUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    if (!decoded || typeof decoded !== "object") return null;

    // The ticket was signed with { userId: ... }
    if (!decoded.userId) return null;

    return decoded.userId as string;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export interface User {
  ws: import("ws").WebSocket;
  rooms: string[];
  id: string;
}

export let Uzers: User[] = [];

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  console.log("Token", token);
  if (!token) {
    ws.send("Token missing");
    ws.close();
    return;
  }
  const id = CheckUser(token);
  console.log("New Connection", id);

  if (!id) {
    ws.send("Unauthorized");
    ws.close();
    return;
  }

  Uzers.push({
    id,
    rooms: [],
    ws,
  });

  ws.on("message", function incoming(message: string) {
    try {
      const ParsedData = JSON.parse(message);

      if (!ParsedData.type) {
        ws.send("Type Required");
        return;
      }
      switch (ParsedData.type) {
        case "join":
          JoinRoom(ws, ParsedData.roomId);
          break;
        case "event":
          EventInRoom(
            ws,
            ParsedData.message,
            ParsedData.roomId,
            ParsedData.url,
            ParsedData.title,
            ParsedData.image,
            ParsedData.extractedId,
            id
          );
          break;
        case "leave":
          LeaveRoom(ws, ParsedData.roomId);
          break;
        default:
          ws.send("Invalid event Type");
          break;
      }
    } catch (error) {
      ws.send("Invalid JSON");
    }
  });

  ws.send("connected to server");
});
