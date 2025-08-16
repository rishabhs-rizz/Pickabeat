import { Search } from "lucide-react";
import { ActionButtons } from "./ActionButtons";

export function DashBoard() {
  return (
    <>
      <div className="min-h-screen bg-[#07060C] text-white">
        <span className="right-2 top-2 absolute z-50 p-4">
          <ActionButtons />
        </span>
        <div className="flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl font-bold">{"Welcome to the Dashboard"}</h1>
          <p className="mt-2 text-lg text-white/70">
            {"Manage your streams and settings here."}
          </p>
          <p className="mt-2 text-sm text-white/50">
            {"Use the buttons above to create or join a stream."}
          </p>
          <div className="flex mt-6 w-1/4 gap-2 ">
            <input
              type="text"
              className="bg-white/80 text-black w-full p-2 rounded-2xl"
            />
            <span className="bg-white/80 text-black p-2 rounded-2xl">
              <Search />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
