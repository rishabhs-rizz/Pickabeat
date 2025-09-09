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
    console.log("Received YT Link:", res.data);
    return res.data.data.youtubeURL;
  } catch (error) {
    console.error("Error playing track in handlers.ts:", error);
  }
};
export const handleMusicPlaying = async (uri: string) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/extractor?trackid=${uri}`
    );
    console.log("Received Audio Link:", res.data);
    return res.data || "";
  } catch (err) {
    console.error("Error extracting audio:", err);
    throw err;
  }
};

export const handleGetStarted = () => {
  const AUTH_URL = process.env.AUTH_URL;
  window.location.href = AUTH_URL || "http://localhost:3000";
};
