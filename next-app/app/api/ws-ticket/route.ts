import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Issue short-lived JWT for WS connection
  const ticket = jwt.sign({ userId: session.user.id }, process.env.WS_SECRET!, {
    expiresIn: "5m",
  });

  return NextResponse.json({ ticket });
}
