import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const downvoteSchema = z.object({
  streamId: z.string(),
});
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user || !user.id) {
    return NextResponse.json(
      {
        message: "unAuthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const parsed = downvoteSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
    const { streamId } = parsed.data;
    const entry = await prisma.upvote.delete({
      where: {
        streamId_userId: {
          streamId: streamId,
          userId: user.id,
        },
      },
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
