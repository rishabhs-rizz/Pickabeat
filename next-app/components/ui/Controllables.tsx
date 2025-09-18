import { useEffect, useState } from "react";
import { YouTubePlayer } from "react-youtube";

// Controllables.tsx
export default function Controllables({
  player,
  duration,
}: {
  player: YouTubePlayer | null;
  duration: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => setCurrent(player.getCurrentTime()), 500);
    return () => clearInterval(id);
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
    setPlaying(!playing);
  };

  return (
    <div>
      <input
        type="range"
        min={0}
        max={duration}
        value={current}
        step="0.1"
        onChange={(e) => player?.seekTo(Number(e.target.value), true)}
      />
      <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
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
      />
    </div>
  );
}
