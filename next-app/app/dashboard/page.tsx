"use client";
import { usePlayerAuth } from "@/lib/usePlayerAuth";
import Link from "next/link";

interface DashBoardProps {
  searchParams: { code?: string };
}

export default function DashBoard({ searchParams }: DashBoardProps) {
  const code = searchParams.code;
  const accessToken = usePlayerAuth(code || "");
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  return (
    <div className="min-h-screen bg-[#07060C] text-white">
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-lg text-white/70">
          Manage your streams and settings here.
        </p>

        <Link
          href={AUTH_URL!}
          className="bg-zinc-900 mt-8 p-2 rounded-2xl cursor-pointer"
        >
          Get started
        </Link>

        <p className="mt-2 text-sm text-white/50">
          (Use this button to start listening your favorite music.)
        </p>
        <a href={`http://localhost:3000/PBplayer?accessToken=${accessToken}`}>
          ding
        </a>
      </div>
    </div>
  );
}
