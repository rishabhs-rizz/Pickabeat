import { NextResponse } from "next/server";
import axios from "axios";

function addCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

export async function OPTIONS() {
  return addCorsHeaders(NextResponse.json({}));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");
  const artist = searchParams.get("artist");

  if (!track || !artist) {
    return addCorsHeaders(
      NextResponse.json(
        { error: "track and artist are required" },
        { status: 400 }
      )
    );
  }

  const query = `${artist} ${track}`;

  try {
    const { data } = await axios.get(
      `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`
    );

    if (!data.length) {
      return addCorsHeaders(
        NextResponse.json({ lyrics: "No lyrics found" }, { status: 404 })
      );
    }

    const match = data[0];

    const lyrics =
      match.syncedLyrics || match.plainLyrics || "No lyrics available";

    return addCorsHeaders(
      NextResponse.json({ lyrics, trackInfo: match }, { status: 200 })
    );
  } catch (err) {
    console.error("Error fetching lyrics:", err);
    return addCorsHeaders(
      NextResponse.json({ error: "Failed to fetch lyrics" }, { status: 500 })
    );
  }
}
