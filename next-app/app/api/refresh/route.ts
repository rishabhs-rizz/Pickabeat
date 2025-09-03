import { NextRequest } from "next/server";
const SpotifyWebApi = require("spotify-web-api-node");

function corsResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function OPTIONS() {
  return corsResponse({}, 200);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const refreshToken = body?.refreshToken ?? "";

  if (!refreshToken) {
    return corsResponse({ error: "refreshtoken is required" }, 400);
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: refreshToken,
  });

  try {
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    return corsResponse({ access_token, expires_in }, 200);
  } catch (e) {
    console.error("Error during Spotify authentication:", e);
    return corsResponse({ error: "Internal server error" }, 500);
  }
}
