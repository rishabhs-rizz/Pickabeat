import { ActionButtons } from "./ActionButtons";

export function DashBoard() {
  const AUTH_URL = process.env.AUTH_URL;
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
          <a
            href={AUTH_URL}
            className="bg-zinc-900 mt-8 p-2 rounded-2xl cursor-pointer"
          >
            Get started
          </a>
          <p className="mt-2 text-sm text-white/50">
            {"( Use this button to start listening your favorite music. )"}
          </p>
        </div>
      </div>
    </>
  );
}
