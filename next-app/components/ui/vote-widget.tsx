"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Music2, ThumbsUp, ListMusic, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Track = {
  id: string;
  title: string;
  artist: string;
  votes: number;
  lengthSec: number;
};

const initialTracks: Track[] = [
  { id: "1", title: "Neon Nights", artist: "Kairo", votes: 12, lengthSec: 198 },
  { id: "2", title: "Pulse Driver", artist: "Luma", votes: 9, lengthSec: 212 },
  {
    id: "3",
    title: "Midnight Alley",
    artist: "Juno",
    votes: 7,
    lengthSec: 184,
  },
  { id: "4", title: "Velvet Ray", artist: "Echoes", votes: 5, lengthSec: 201 },
];

export default function VoteWidget(
  props: { className?: string } = { className: "" }
) {
  const { className = "" } = props;
  const [tracks, setTracks] = React.useState<Track[]>(() => initialTracks);
  const [elapsed, setElapsed] = React.useState<number>(24); // seconds elapsed for demo

  // Simulate progress
  React.useEffect(() => {
    const id = setInterval(() => {
      setElapsed((e) => {
        const nowPlaying = tracks[0];
        if (!nowPlaying) return 0;
        const next = e + 1;
        if (next >= nowPlaying.lengthSec) {
          // Move to next track in queue
          setTracks((prev) => {
            const [first, ...rest] = prev;
            if (!first) return prev;
            // Reset elapsed
            setElapsed(0);
            return [...rest, { ...first, votes: 0 }];
          });
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  const onVote = (id: string) => {
    setTracks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, votes: t.votes + 1 } : t
      );
      // Re-sort by votes (desc)
      updated.sort((a, b) => b.votes - a.votes);
      return [...updated];
    });
  };

  const nowPlaying = tracks[0];
  const queue = tracks.slice(1);
  const progress = nowPlaying
    ? Math.min(100, (elapsed / nowPlaying.lengthSec) * 100)
    : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Now Playing */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <Music2 className="size-5 text-fuchsia-300" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-white/60">{"Now playing"}</p>
            <h4 className="truncate font-semibold">
              {nowPlaying
                ? `${nowPlaying.title} — ${nowPlaying.artist}`
                : "Queue empty"}
            </h4>
          </div>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Play className="size-4 text-white/60" aria-hidden="true" />
            <span className="text-xs text-white/60">
              {formatTime(elapsed)} {"/"}{" "}
              {formatTime(nowPlaying?.lengthSec ?? 0)}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <Progress
            value={progress}
            className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-fuchsia-500 [&>div]:to-violet-500"
          />
        </div>
      </div>

      {/* Queue + Voting */}
      <div className="rounded-xl border border-white/10 bg-black/30">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <ListMusic className="size-4 text-white/70" aria-hidden="true" />
          <h5 className="text-sm font-medium">{"Up next"}</h5>
        </div>

        <ul className="divide-y divide-white/10">
          {queue.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <div className="grid size-9 place-items-center rounded-md bg-white/5 ring-1 ring-white/10">
                <Music2 className="size-4 text-violet-300" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{`${t.title}`}</p>
                <p className="truncate text-xs text-white/60">{t.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-label="votes"
                  className="text-xs tabular-nums text-white/70"
                >
                  {t.votes} {"votes"}
                </span>
                <Button
                  size="sm"
                  className="h-8 bg-white/10 text-white hover:bg-white/15"
                  onClick={() => onVote(t.id)}
                >
                  <ThumbsUp className="mr-1 size-3.5" aria-hidden="true" />
                  {"Vote"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      <p className="text-center text-xs text-white/50">
        {
          "Host can pin or skip tracks • Limits prevent spam • Works great on a TV or projector"
        }
      </p>
    </div>
  );
}

function formatTime(totalSec: number): string {
  if (!totalSec || Number.isNaN(totalSec)) return "0:00";
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
