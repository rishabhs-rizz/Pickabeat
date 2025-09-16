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
    <div className="bg-zinc-800/50 px-8">
      <div
        className="p-3 rounded-full flex gap-2 items-center cursor-pointer
      hover:bg-zinc-800/80 group transition hover:shadow-zinc-900/50 hover:shadow-base"
        onClick={handlePlay}
      >
        {" "}
        <div className="flex gap-4 items-center transition">
          <img
            className="w-10 h-10 object-cover rounded-md transform transition group-hover:scale-115"
            src={track.albumUrl}
            alt="imgs"
          />
          <div className="flex flex-col">
            <span className="font-bold">{track.title}</span>
            <span className="font-light text-xs">{track.artist}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
