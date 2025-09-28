import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
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
  const session = await getServerSession(authOptions);
  console.log("Session in ws-token:", session);

  if (!session || !session.user.id) {
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return addCorsHeaders(res);
  }
  console.log("Session User:", session.user.id);
  // Issue short-lived JWT for WS connection
  const token = jwt.sign({ userId: session.user.id }, process.env.WS_SECRET!, {
    expiresIn: "5m",
  });

  console.log("Issued WS token:", token);

  const res = NextResponse.json({ token });
  return addCorsHeaders(res);
}
