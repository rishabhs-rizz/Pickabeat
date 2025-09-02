"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export function usePlayerAuth(code: string) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (!code) return;
    axios
      .post("http://localhost:3000/api/PBplayer", { code })
      .then((res) => {
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        console.log(res.data);
        window.history.pushState({}, "", "/PBplayer");
      })
      .catch((e) => console.log(e));
  }, [code]);

  return accessToken;
}
