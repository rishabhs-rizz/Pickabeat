import { Main } from "next/document";
import { Appbar } from "../components/ui/Appbar";
import { Maincomp } from "../components/ui/MainComp";
import { Features } from "../components/ui/Features";

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
