import { SearchIcon } from "lucide-react";

export function Search() {
  return (
    <div className="flex mt-2 w-1/4 gap-2 ">
      <input
        type="text"
        placeholder="enter the song name"
        className="bg-white/80 text-black w-full p-2 pl-4 rounded-2xl"
      />
      <span className="bg-white/80 text-black p-2 rounded-2xl">
        <SearchIcon />
      </span>
    </div>
  );
}
