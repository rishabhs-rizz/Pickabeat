import { Main } from "next/document";
import { Appbar } from "./components/Appbar";
import { Maincomp } from "./components/MainComp";
import { Features } from "./components/Features";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#07060C] text-white">
      <Appbar />
      <main>
        <Maincomp />
      </main>
      <Features />
    </div>
  );
}
