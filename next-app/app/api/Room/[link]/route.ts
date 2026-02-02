import { prisma } from "@/app/lib/db";
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
  const { pathname } = req.nextUrl;
  const link = pathname.split("/").pop();

  if (!link) {
    const res = NextResponse.json(
      {
        message: "Link parameter is required",
      },
      { status: 400 }
    );
    return addCorsHeaders(res);
  }

  try {
    const room = await prisma.room.findUnique({
      where: { link: link },
      include: { streams: true },
    });

    if (!room) {
      const res = NextResponse.json(
        {
          message: "Room not found",
        },
        { status: 404 }
      );
      return addCorsHeaders(res);
    }

    const res = NextResponse.json({ room });
    return addCorsHeaders(res);
  } catch (error) {
    console.error("Error fetching room:", error);
    const res = NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(res);
  }
}
