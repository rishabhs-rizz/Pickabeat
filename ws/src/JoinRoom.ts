import { Uzers } from ".";
import { PrismaClient } from "../../next-app/app/generated/prisma";
const prisma = new PrismaClient();

export const JoinRoom = async (ws: import("ws").WebSocket, roomId: string) => {
  const user = Uzers.find((u) => u.ws === ws);

  if (!user) {
    return;
  }

  const validRoom = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!validRoom) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }
  console.log("system hang");
  console.log("valid room", validRoom);
  if (user.rooms.includes(roomId)) {
    ws.send(JSON.stringify({ type: "error", message: "Already in room" }));
    return;
  }
  user.rooms.push(roomId);
};
