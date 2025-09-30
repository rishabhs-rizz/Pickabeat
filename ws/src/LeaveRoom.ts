import { WebSocket, WebSocketServer } from "ws";
import { Uzers } from ".";

export const LeaveRoom = (
  ws: WebSocket,

  roomId: string
) => {
  const user = Uzers.find((u) => u.ws === ws);
  if (!user) {
    return;
  }
  user.rooms = user.rooms.filter((r) => r !== roomId);
};
