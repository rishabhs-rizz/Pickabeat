import { SearchIcon } from "lucide-react";

export function Search({
  onChange,
  onSearch,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}) {
  return (
    <div className="flex mt-2 gap-2 items-center bg-gradient-to-r from-white/70 to-white/90 rounded-2xl shadow-lg px-2 py-1">
      <input
        onChange={onChange}
        type="text"
        placeholder="Search for a song..."
        className="bg-transparent text-black w-full p-2 pl-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 transition"
      />
      <button
        type="button"
        className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow transition flex items-center justify-center"
        onClick={onSearch}
        aria-label="Search"
      >
        <SearchIcon size={20} />
      </button>
    </div>
  );
}
