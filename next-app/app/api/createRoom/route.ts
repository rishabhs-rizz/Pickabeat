import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Utility to generate random strings
const generateRandomString = (length = 10) => {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => ("0" + (x % 36).toString(36)).slice(-1))
    .join("");
};

// Helper to add CORS headers
function addCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

// Handle preflight requests
export async function OPTIONS() {
  const res = NextResponse.json({});
  return addCorsHeaders(res);
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const parsed = createRoomSchema.safeParse(await req.json());
    if (!parsed.success) {
      const res = NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten() },
        { status: 400 }
      );
      return addCorsHeaders(res);
    }

    const { name, description } = parsed.data;
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const link = generateRandomString();

    if (!userId) {
      const res = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
      return addCorsHeaders(res);
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        userId,
        link,
      },
    });

    const res = NextResponse.json({ newRoom }, { status: 201 });
    return addCorsHeaders(res);
  } catch (e) {
    console.error("Error creating room:", e);
    const res = NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(res);
  }
}
