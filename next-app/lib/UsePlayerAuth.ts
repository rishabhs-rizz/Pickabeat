"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "zod";

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

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeout = setTimeout(() => {
      axios
        .post("http://localhost:3000/api/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
          console.log(res.data);
          window.history.pushState({}, "", "/PBplayer");
        })
        .catch((e) => console.log(e));
    }, (expiresIn - 60) * 1000);
    return () => clearTimeout(timeout);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
