"use client";
import { SearchResults } from "@/components/SearchResults";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { Search } from "@/components/ui/Search";
import { handleMusicConverting, handleMusicPlaying } from "@/lib/Handlers";
import { usePlayerAuth } from "@/lib/usePlayerAuth";

import { Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

export type Track = {
  artist: string;
  title: string;
  uri: string;
  albumUrl: string;
};

const PBplayerPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const accessToken = usePlayerAuth(code || "");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  async function chooseTrack(track: Track) {
    setPlayingTrack(track);

    setSearch("");
    setSearchResults([]);
    const res = await handleMusicConverting(track.uri);
    const videoId = res?.split("v=")[1].split("&")[0];
    setVideoId(videoId);
  }

  const spotifyApiRef = useRef(
    new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
    })
  );

  useEffect(() => {
    if (accessToken) spotifyApiRef.current.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search || !accessToken) {
      setSearchResults([]);
      return;
    }

    let cancel = false;
    spotifyApiRef.current.searchTracks(search).then((res: any) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track: any) => ({
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: track.album.images[0].url,
        }))
      );
      console.log(searchResults);
    });

    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoId) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    let player: any;

    (window as any).onYouTubeIframeAPIReady = () => {
      player = new (window as any).YT.Player("ytplayer", {
        videoId,
        playerVars: { autoplay: 1, mute: 1 },
      });
      playerRef.current = player;
    };

    const handleClick = () => {
      if (playerRef.current && typeof playerRef.current.unMute === "function") {
        playerRef.current.unMute();
      }
    };

    window.addEventListener("click", handleClick, { once: true });

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [videoId]);

  if (!code) return <div>Code not found</div>;
  if (!accessToken) return <div>Loading…</div>;

  return (
    <div className="min-h-screen bg-[#07060C] text-white">
      <div className="flex justify-between items-center p-2">
        <a href="http://localhost:3000/dashboard">
          <Home />
        </a>

        <div className="w-1/4 relative">
          <Search onChange={(e) => setSearch(e.target.value)} />
          <div className="w-full mt-2 max-h-96 overflow-y-auto absolute bg-black">
            {searchResults.map((track) => (
              <SearchResults
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
          </div>
        </div>
        <ActionButtons />
      </div>

      <div className="bottom-0">
        <div id="ytplayer-container">
          {videoId && (
            <div id="ytplayer" className="w-full h-60">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                title="YouTube Video"
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {/* <div className="bottom-0">
        {videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
            title="YouTube Video"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div> */}
    </div>
  );
};

export default PBplayerPage;
