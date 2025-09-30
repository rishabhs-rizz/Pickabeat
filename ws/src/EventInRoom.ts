import { Uzers } from ".";
import { PrismaClient } from "../../next-app/app/generated/prisma";
const prisma = new PrismaClient();

export const EventInRoom = async (
  ws: import("ws").WebSocket,
  message: string,
  roomId: string,
  id: string,
  url: string,
  title: string,
  image: string,
  extractedId: string
) => {
  const user = Uzers.find((u) => u.ws === ws);

  // Check if the user exists and is part of the room
  if (!user || !user.rooms.includes(roomId)) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not a member of this room",
      })
    );
    return;
  }

  // Save the message to the database
  const chat = await prisma.stream.create({
    data: {
      type: "Youtube",
      active: true,
      url: url,
      title,
      bigImg: image,
      smallImg: image,
      extractedId,
      userId: id,
      roomId: roomId,
    },
  });

  Uzers.forEach((u) => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(JSON.stringify({ type: "event", message, roomId }));
    }
  });
};
