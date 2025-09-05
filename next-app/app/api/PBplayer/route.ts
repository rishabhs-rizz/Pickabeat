import { NextRequest, NextResponse } from "next/server";
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
  const res = NextResponse.json({});
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body?.code ?? "";

  if (!code) {
    return NextResponse.json({ error: "Code is required" });
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    const res = NextResponse.json({
      access_token,
      refresh_token,
      expires_in,
    });

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return res;
  } catch (e) {
    console.error("Error during Spotify authentication:", e);
    return NextResponse.json(
      { error: "Failed to authenticate with Spotify" },
      { status: 400 }
    );
  }
}
