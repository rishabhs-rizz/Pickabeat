import { Button } from "@/components/ui/button";
import {
  Badge,
  Music2,
  Radio,
  ShieldCheck,
  Sparkles,
  Vote,
} from "lucide-react";
import Link from "next/link";
import VoteWidget from "./vote-widget";

export function Maincomp() {
  return (
    <div className="mx-auto h-screen grid max-w-7xl items-center gap-10 px-4 pb-8 pt-12 sm:px-6  lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-white/10 text-white hover:bg-white/15">
            {"New"}
          </Badge>
          <p className="text-xs text-white/60">
            {"Host crowd-powered sets for streams, venues & communities."}
          </p>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="block">{"Let the crowd choose"}</span>
          <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
            {"the beat."}
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {
            "Pickabeat is a decentralized way to pick what plays next. Listeners vote, the queue adapts, and your stream or venue stays in perfect flow together."
          }
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500"
          >
            <Link href="#demo" className="flex items-center gap-2">
              <Vote className="size-4" aria-hidden="true" />
              {"Try live demo"}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="#features" className="flex items-center gap-2">
              <Sparkles className="size-4" aria-hidden="true" />
              {"Explore features"}
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <ShieldCheck
              className="size-3.5 text-emerald-400"
              aria-hidden="true"
            />
            {"No installs"}
          </div>
          <div className="flex items-center gap-1">
            <Radio className="size-3.5 text-pink-400" aria-hidden="true" />
            {"Low-latency"}
          </div>
          <div className="flex items-center gap-1">
            <Music2 className="size-3.5 text-violet-400" aria-hidden="true" />
            {"Works with your player"}
          </div>
        </div>
      </div>

      {/* Hero Demo Card */}
      <div id="demo" className="relative">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 via-purple-500/10 to-violet-500/20 blur-2xl" />
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <VoteWidget />
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-white/50">
          {"Interactive mock — votes update instantly in the browser."}
        </p>
      </div>
    </div>
  );
}
