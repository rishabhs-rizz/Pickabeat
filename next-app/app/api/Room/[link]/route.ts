import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const link = pathname.split("/").pop();

  if (!link) {
    return NextResponse.json(
      {
        message: "Link parameter is required",
      },
      { status: 400 }
    );
  }

  try {
    const room = await prisma.room.findUnique({
      where: { link: link },
      include: { streams: true },
    });

    if (!room) {
      return NextResponse.json(
        {
          message: "Room not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
