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
      })
      .catch((e) => {
        window.location.href = "http://localhost:3000/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3000/api/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
        })
        .catch((e) => {
          window.location.href = "http://localhost:3000/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
