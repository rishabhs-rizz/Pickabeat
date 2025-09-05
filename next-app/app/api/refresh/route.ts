import { NextRequest, NextResponse } from "next/server";
const SpotifyWebApi = require("spotify-web-api-node");

function addCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

export async function OPTIONS() {
  const res = NextResponse.json({});
  return addCorsHeaders(res);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body?.refreshToken ?? "";
    console.log("refresh token is ryt here:", refreshToken);

    if (!refreshToken) {
      const res = NextResponse.json(
        { error: "refreshToken is required" },
        { status: 400 }
      );
      return addCorsHeaders(res);
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
    });

    spotifyApi.setRefreshToken(refreshToken);

    const data = await spotifyApi.refreshAccessToken();

    const res = NextResponse.json({
      access_token: data.body.access_token,
      expires_in: data.body.expires_in,
    });

    return addCorsHeaders(res);
  } catch (err) {
    console.error("Spotify refresh error:", err);
    const res = NextResponse.json(
      { error: "Failed to refresh access token" },
      { status: 500 }
    );
    return addCorsHeaders(res);
  }
}
