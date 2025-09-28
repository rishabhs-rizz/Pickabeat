"use client";
import { handleCopy, handleCreateRoom, handleJoinRoom } from "@/lib/Handlers";
import { Button } from "./button";
import axios from "axios";
import { useState } from "react";

export function ActionButtons() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setisJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [link, setLink] = useState("");
  const [roomId, setRoomId] = useState("");
  const [clicked, setClicked] = useState(false);
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Button
          onClick={
            isCreateModalOpen
              ? () => setCreateModalOpen(false)
              : () => setCreateModalOpen(true)
          }
          size="lg"
          className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 cursor-pointer"
        >
          {"Create Stream"}
        </Button>
        <Button
          onClick={
            isJoinModalOpen
              ? () => setisJoinModalOpen(false)
              : () => setisJoinModalOpen(true)
          }
          size="lg"
          variant="outline"
          className="border-white/15 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
        >
          {"Join Stream"}
        </Button>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setCreateModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Create Room</h2>
            <p className="text-sm text-gray-600 mb-4">
              Create your own room and collaborate with friends by sharing the
              room ID.
            </p>
            <input
              className="w-full px-4 py-2 border rounded mb-2"
              placeholder="Enter your room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border rounded mb-2"
              placeholder="Enter description about room"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center space-x-2 mb-4">
              <input
                className="flex-1 px-4 py-2 border rounded"
                value={link}
                readOnly
                placeholder="Generated link"
              />
              <button
                onClick={() => {
                  handleCopy(link);
                }}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Copy
              </button>
            </div>
            <button
              onClick={async () => {
                setClicked(true);
                const response = await handleCreateRoom(roomName, description);
                if (response?.link && response.roomID) {
                  setLink(response.link);
                  setRoomId(response.roomID);
                }
                setClicked(false);
              }}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              {clicked ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
