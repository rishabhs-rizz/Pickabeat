import { LyricLine } from "@/app/PBplayer/page";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseLRC(lrc: string): LyricLine[] {
  return lrc
    .split("\n")
    .map((line) => {
      const m = line.match(/\[(\d{2}):(\d{2}(?:\.\d{2})?)\](.*)/);
      if (!m) return null;
      const min = parseInt(m[1], 10);
      const sec = parseFloat(m[2]);
      const text = m[3].trim();
      return { time: min * 60 + sec, text };
    })
    .filter(Boolean) as LyricLine[];
}
