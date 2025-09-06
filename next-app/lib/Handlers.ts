import axios from "axios";
export const handleMusicPlaying = async (uri: string) => {
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
    console.log("Conversion response in handlers.ts:", res.data);
  } catch (error) {
    console.error("Error playing track in handlers.ts:", error);
  }
};

export const handleGetStarted = () => {
  const AUTH_URL = process.env.AUTH_URL;
  window.location.href = AUTH_URL || "http://localhost:3000";
};
