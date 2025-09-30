"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { StreamRoom } from "@/components/StreamRoom";

export default function StreamPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [socket, setSocket] = useState<WebSocket | null>(null);

  async function TicketCall() {
    const token = await axios
      .get("http://localhost:3000/api/ws-ticket")
      .then((res) => res.data.token);
    console.log("token :", token);
    return token;
  }

  useEffect(() => {
    async function connectWS() {
      const token = await TicketCall();
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
      if (ws) {
        ws.onopen = () => {
          console.log("WebSocket connection established");
          setSocket(ws);
          ws.send(
            JSON.stringify({
              type: "join",
              roomId,
            })
          );
        };
      }
    }

    connectWS();
  }, [roomId]);

  if (!socket) {
    return <div>Loading...</div>;
  }
  return <StreamRoom roomId={roomId} socket={socket} />;
}
