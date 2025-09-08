import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get("trackId");

  try {
    const response = await axios.get(
      `https://backend.canum.xyz/api2/api/song/convert?spotifyURL=https://open.spotify.com/track/${trackId}`
    );
    const res = NextResponse.json({ data: response.data }, { status: 200 });
    return addCorsHeaders(res);
  } catch (e) {
    console.log("error" + e);
    return NextResponse.json(
      { error: "Failed to convert the spotify url to YT" },
      { status: 400 }
    );
  }
}
