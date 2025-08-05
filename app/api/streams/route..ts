import { prisma } from "@/app/lib/db";
import { YT_REGEX } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = createStreamSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { creatorId, url } = parsed.data;
    const isYTurl = YT_REGEX.test(url);

    if (!isYTurl) {
      return NextResponse.json({
        message: "invalid URL format",
      });
    }

    const extractedId = url.split("?v=")[1];

    const newstream = await prisma.stream.create({
      data: {
        userId: creatorId,
        url: url,
        extractedId,
        type: "Youtube",
        active: true,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}
