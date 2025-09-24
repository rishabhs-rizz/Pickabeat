import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

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

export async function GET(req: Request) {
  const session = await getServerSession();
  console.log("Session in ws-ticket:", session);

  if (!session || !session.user.email) {
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return addCorsHeaders(res);
  }

  // Issue short-lived JWT for WS connection
  const ticket = jwt.sign({ userId: session.user.id }, process.env.WS_SECRET!, {
    expiresIn: "5m",
  });

  const res = NextResponse.json({ ticket });
  return addCorsHeaders(res);
}
