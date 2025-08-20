import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function POST(req: NextRequest) {
  const generateRandomString = (length = 10) => {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => ("0" + (x % 36).toString(36)).slice(-1))
      .join("");
  };
  try {
    const parsed = createRoomSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description } = parsed.data;
    const session = await getServerSession();
    const userId = session?.user?.id;
    const link = generateRandomString();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        userId,
        link,
      },
    });

    return NextResponse.json({ newRoom }, { status: 201 });
  } catch (e) {
    console.error("Error creating room:", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
