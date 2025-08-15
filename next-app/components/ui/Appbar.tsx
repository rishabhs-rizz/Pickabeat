"use client";
import { PlayCircle, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Appbar() {
  const [signedIn, setSignedIn] = useState(false);
  const session = useSession();
  const router = useRouter();

  function handleSignIn() {
    setSignedIn(true);
    signIn("google", {
      callbackUrl: "/dashboard",
    });
  }
  return (
    <>
      <div className="flex justify-between items-center px-4 py-3 bg-black/20 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative grid size-8 place-items-center rounded-md bg-gradient-to-br from-fuchsia-500/30 via-purple-500/20 to-violet-500/30 ring-1 ring-white/10">
            <Waves className="size-4 text-fuchsia-300" aria-hidden="true" />
          </div>
          <span className="font-semibold tracking-tight">Pickabeat</span>
          <span className="sr-only">
            {"BeamBeat — community-powered music"}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm text-white/80 hover:text-white transition"
          >
            {"Features"}
          </Link>
          <Link
            href="#how"
            className="text-sm text-white/80 hover:text-white transition"
          >
            {"How it works"}
          </Link>
          <Link
            href="#demo"
            className="text-sm text-white/80 hover:text-white transition"
          >
            {"Live demo"}
          </Link>
        </nav>

        <div className="flex items-center space-x-2 ">
          {session.data?.user && (
            <>
              <Button
                asChild
                className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500"
              >
                <Link href="#cta" className="flex items-center gap-1">
                  <PlayCircle className="size-4" aria-hidden="true" />
                  {"Launch App"}
                </Link>
              </Button>
              <button
                className="p-2 text-sm text-white/80 hover:text-white transition"
                onClick={() => {
                  signOut();
                  setSignedIn(false);
                }}
              >
                SignOut
              </button>
            </>
          )}
          {!session.data?.user && (
            <>
              <Button
                asChild
                className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500"
              >
                <Link href="#cta" className="flex items-center gap-1">
                  <PlayCircle className="size-4" aria-hidden="true" />
                  {"Launch App"}
                </Link>
              </Button>
              <button
                className="p-2 text-sm text-white/80 hover:text-white transition"
                onClick={() => {
                  handleSignIn();
                }}
              >
                SignIn
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
