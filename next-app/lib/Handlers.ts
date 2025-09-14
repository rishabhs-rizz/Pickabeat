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
