"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
if (!config_1.default) {
    console.error("Missing JWT_SECRET in environment");
    process.exit(1);
}
const PORT = Number(process.env.PORT || 8080);
const wss = new ws_1.WebSocketServer({ port: PORT });
const clients = new Map();
function CheckUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default);
        if (typeof decoded === "string")
            return null;
        if (!decoded.id)
            return null; // <- MUST include id in the payload
        return String(decoded.id);
    }
    catch {
        return null;
    }
}
const HEARTBEAT_INTERVAL = 30_000; // 30s
const hb = setInterval(() => {
    for (const [socket, user] of clients.entries()) {
        if (!user.isAlive) {
            try {
                socket.terminate();
            }
            catch { }
            clients.delete(socket);
            continue;
        }
        user.isAlive = false;
        try {
            socket.ping();
        }
        catch { }
    }
}, HEARTBEAT_INTERVAL);
wss.on("connection", (ws, request) => {
    const url = new URL(request.url || "/", "http://localhost");
    const ticket = url.searchParams.get("ticket") ?? "";
    if (!ticket) {
        ws.close(1008, "Missing ticket");
        return;
    }
    const id = CheckUser(ticket);
    if (!id) {
        ws.close(1008, "Unauthorized");
        return;
    }
    const user = { ws, rooms: new Set(), id, isAlive: true };
    clients.set(ws, user);
    ws.on("pong", () => {
        const u = clients.get(ws);
        if (u)
            u.isAlive = true;
    });
    ws.on("message", (data) => {
        const text = typeof data === "string" ? data : data.toString();
        console.log(`Message from ${id}: ${text}`);
        if (text === "ping" && ws.readyState === ws.OPEN) {
            ws.send("pong");
        }
        else if (ws.readyState === ws.OPEN) {
            ws.send(`You said: ${text}`);
        }
    });
    ws.on("close", () => {
        clients.delete(ws);
        console.log(`Client ${id} disconnected. ${clients.size} remaining.`);
    });
    ws.on("error", (err) => console.error("WS error", err));
    if (ws.readyState === ws.OPEN)
        ws.send("Connected (secured).");
});
wss.on("close", () => clearInterval(hb));
console.log(`WebSocket server running on ws://localhost:${PORT}`);
//# sourceMappingURL=index.js.map