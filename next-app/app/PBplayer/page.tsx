"use client";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { Search } from "@/components/ui/Search";
import { usePlayerAuth } from "@/lib/UsePlayerAuth";
import { Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const PBplayerPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  console.log("Authorization Code:", code);
  const accessToken = usePlayerAuth(code || "");
  console.log("Access Token:", accessToken);
  return (
    <div className="min-h-screen bg-[#07060C] text-white">
      <div className="flex justify-between items-center p-2">
        <a href="http://localhost:3000/dashboard">
          <Home />
        </a>
        <Search />
        <ActionButtons />
      </div>
    </div>
  );
};

export default PBplayerPage;
