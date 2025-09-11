import { NextResponse } from "next/server";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get("trackid");

  if (!trackId) {
    return withCors(
      new NextResponse(
        JSON.stringify({ error: "trackid query parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${trackId}`);
    console.log("Received Audio Link:", res);
    return withCors(
      new NextResponse(JSON.stringify(res.url || ""), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (err) {
    console.error("Error extracting audio stream:", err);
    return withCors(
      new NextResponse(
        JSON.stringify({ error: "Failed to extract audio stream" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    );
  }
}
