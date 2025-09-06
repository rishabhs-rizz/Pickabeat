import { Track } from "@/app/PBplayer/page";

export const SearchResults = ({
  track,
  chooseTrack,
}: {
  track: Track;
  chooseTrack: (track: Track) => void;
}) => {
  function handlePlay() {
    chooseTrack(track);
  }
  return (
    <div
      className="bg-zinc-800/50 p-2 rounded-lg mb-2 flex gap-2 items-center"
      onClick={handlePlay}
    >
      <div>{track.title}</div>
      <div>{track.artist}</div>
    </div>
  );
};
