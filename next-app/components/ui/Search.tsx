import { SearchIcon } from "lucide-react";

export function Search({
  onChange,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex mt-2 gap-2 ">
      <input
        onChange={onChange}
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
