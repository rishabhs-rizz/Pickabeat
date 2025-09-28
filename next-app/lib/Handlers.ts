import axios from "axios";

export const handleMusicConverting = async (uri: string) => {
  const trackId = uri.split(":").pop();

  if (!trackId) {
    console.error("Invalid Spotify URI:", uri);
    return;
  }

  console.log("Playing track with ID:", trackId);

  try {
    const res = await axios.get(
      `http://localhost:3000/api/convert?trackId=${trackId}`
    );
    console.log("Response from /api/convert:", res.data); //
    return res.data.data.youtubeURL;
  } catch (error) {
    console.error("Error playing track in handlers.ts:", error);
  }
};

export function getYoutubeVideoId(url: string): string | null {
  const pattern =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const matches = url.match(pattern);
  return matches ? matches[1] : null;
}

export const handleGetStarted = () => {
  const AUTH_URL = process.env.AUTH_URL;
  window.location.href = AUTH_URL || "http://localhost:3000";
};

export const handleCopy = (link: string) => {
  navigator.clipboard.writeText(link);
  alert("Link copied to clipboard!");
};

export const handleJoinRoom = () => {};

export const handleCreateRoom = async (
  roomName: string,
  description?: string
) => {
  if (!roomName) return alert("Enter room name");
  console.log("Creating room with name:", roomName);
  const response = await axios.post("http://localhost:3000/api/createRoom", {
    name: roomName,
    description: description,
  });
  if (response) {
    console.log("Room created successfully:", response.data);
    const { link, id: roomID } = response.data.newRoom;

    // const createdAt = response.data.createdAt;
    return { link, roomID };
  }
};

async function handleCreateStream() {
  const token = await axios
    .get("http://localhost:3000/api/ws-ticket")
    .then((res) => res.data.token);
  console.log("token :", token);
  return token;
}
