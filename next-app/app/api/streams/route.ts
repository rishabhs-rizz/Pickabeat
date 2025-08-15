import { prisma } from "@/app/lib/db";
import { YT_REGEX } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import youtubesearchapi from "youtube-search-api";

console.log("inside route");
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = createStreamSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten },
        { status: 400 }
      );
    }

    const { creatorId, url } = parsed.data;
    const isYTurl = url.match(YT_REGEX);

    if (!isYTurl) {
      return NextResponse.json({
        message: "invalid URL format",
      });
    }

    const extractedId = url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    const title = res.title;
    const thumbnails = res.thumbnail.thumbnails;

    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    const newstream = await prisma.stream.create({
      data: {
        userId: creatorId,
        url: url,
        title: title ?? "cant find video",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ??
              "https://imgs.search.brave.com/TC8e9TWDdexB7NBhe_fnqkmPSbePT7yI7jaNcdceodk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93aW5k/b3dzcmVwb3J0LmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Mi8wOC9VbnRpdGxl/ZC1kZXNpZ24tMTct/ODg2eDU5MC5qcGc",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://imgs.search.brave.com/TC8e9TWDdexB7NBhe_fnqkmPSbePT7yI7jaNcdceodk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93aW5k/b3dzcmVwb3J0LmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Mi8wOC9VbnRpdGxl/ZC1kZXNpZ24tMTct/ODg2eDU5MC5qcGc",
        extractedId,
        type: "Youtube",
        active: true,
      },
    });
    return NextResponse.json({
      newstream,
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

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  const streams = await prisma.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
