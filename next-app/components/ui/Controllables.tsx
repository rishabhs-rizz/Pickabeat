import { Pause, PlayIcon, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { YouTubePlayer } from "react-youtube";
import { HighVol, LowVol } from "./icons";

export default function Controllables({
  player,
  duration,
  playing,
  setPlaying,
}: {
  player: YouTubePlayer | null;
  duration: number;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  singer?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => setCurrent(player.getCurrentTime()), 500);
    return () => clearInterval(id);
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    playing ? player.pauseVideo() : player.playVideo();
  };

  const skip = (sec: number) => {
    if (!player) return;
    const t = player.getCurrentTime() + sec;
    player.seekTo(Math.max(0, Math.min(duration, t)), true);
  };

  const formatTime = (time: number, isRemaining = false) => {
    const t = Math.floor(time);
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${isRemaining ? "-" : ""}${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-2 p-4 rounded-3xl shadow-2xl flex flex-col gap-4">
      <input
        type="range"
        min={0}
        max={duration}
        value={current}
        step="0.1"
        onChange={(e) => player?.seekTo(Number(e.target.value), true)}
        className="w-full -mt-2 accent-purple-400 cursor-pointer"
      />
      <div className="flex -mt-4 justify-between text-xs text-gray-300">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration - current, true)}</span>
      </div>

      <div className="flex items-center justify-center -mt-4 gap-8">
        <SkipBack
          size={25}
          onClick={() => skip(-10)}
          className="cursor-pointer hover:text-purple-300"
        />
        {playing ? (
          <Pause
            size={30}
            onClick={togglePlay}
            className="cursor-pointer hover:text-purple-300"
          />
        ) : (
          <PlayIcon
            size={30}
            onClick={togglePlay}
            className="cursor-pointer hover:text-purple-300"
          />
        )}
        <SkipForward
          size={25}
          onClick={() => skip(10)}
          className="cursor-pointer hover:text-purple-300"
        />
      </div>

      <div className="flex items-center gap-3">
        <LowVol />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            player?.setVolume(v * 100);
          }}
          className="flex-1 accent-purple-400 cursor-pointer"
        />
        <HighVol />
      </div>
    </div>
  );
}
