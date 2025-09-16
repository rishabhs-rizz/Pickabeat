"use client";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { usePlayerAuth } from "@/lib/usePlayerAuth";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

interface DashBoardProps {
  searchParams: { code?: string };
}

export default function DashBoard({ searchParams }: DashBoardProps) {
  const session = useSession();
  const res = localStorage.getItem("accessToken");
  console.log("Access Token from localStorage:", res);

  const code = searchParams.code;
  const accessToken = usePlayerAuth(code || "");

  const notify = () =>
    toast("Need to be signed in to use the app!", {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false} // quick slide-down effect
      />
      <div className="min-h-screen bg-[#07060C] text-white">
        <div className="flex flex-col items-center justify-center pt-20">
          {session.data?.user && (
            <div className="top-0 right-0 p-4 absolute">
              <ActionButtons />
            </div>
          )}
          {!session.data?.user && (
            <>
              <div onClick={notify} className="top-0 right-0 p-4 absolute">
                <ActionButtons />
              </div>
            </>
          )}
          <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-2 text-lg text-white/70">
            Manage your streams and settings here.
          </p>

          <Link
            href={`http://localhost:3000/PBplayer?accessToken=${
              accessToken || res
            }`}
            className="bg-zinc-900 mt-8 p-2 rounded-2xl cursor-pointer"
          >
            Get started
          </Link>

          <p className="mt-2 text-sm text-white/50">
            (Use this button to start listening your favorite music.)
          </p>
        </div>
      </div>
    </>
  );
}
