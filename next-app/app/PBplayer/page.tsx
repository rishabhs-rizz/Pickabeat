"use client";
import { SearchResults } from "@/components/SearchResults";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { Search } from "@/components/ui/Search";
import { getYoutubeVideoId, handleMusicConverting } from "@/lib/Handlers";
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
    const id = getYoutubeVideoId(res || "");
    setVideoId(id);
    console.log("YouTube Video ID:", id);
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

  if (!accessToken)
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl text-white">
        Loading…
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07060C] via-[#1a1333] to-[#3a1c71] text-white flex flex-col items-center">
      <div className="w-full max-w-6xl mt-8 px-4">
        {/* top bar */}
        <div className="flex justify-between items-center mb-8">
          <a
            href="/dashboard"
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition shadow-lg"
          >
            <Home size={28} />
          </a>
          <ActionButtons />
        </div>

        <div className="relative flex flex-col items-center mb-2">
          <div className="w-full max-w-xl mx-auto">
            <Search onChange={(e) => setSearch(e.target.value)} />
            {searchResults.length > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-xl max-h-96 overflow-y-auto rounded-2xl bg-black/90 backdrop-blur-lg shadow-2xl border border-purple-700 custom-scrollbar transition-all z-30"
                style={{ top: "100%" }}
              >
                {searchResults.map((track) => (
                  <SearchResults
                    track={track}
                    key={track.uri}
                    chooseTrack={chooseTrack}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* player */}
        <div className="mt-12 flex flex-row items-center justify-center gap-10">
          <div className="w-[420px] h-[420px] relative flex flex-col items-center justify-center rounded-3xl bg-black/60 backdrop-blur-lg shadow-2xl p-6">
            {/* {playingTrack?.albumUrl && (
              <img
                src={playingTrack.albumUrl}
                alt={playingTrack.title}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl opacity-80 z-10 pointer-events-none"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
              />
            )} */}
            {videoId ? (
              <iframe
                key={videoId}
                className="w-full h-full rounded-2xl relative z-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                title="YouTube Video"
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{
                  mixBlendMode: "multiply",
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-2xl bg-black/80 text-gray-400 text-xl relative z-0">
                No video selected
              </div>
            )}
            {/* Track Info */}
            {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center bg-black/60 px-4 py-2 rounded-xl shadow-lg">
              {playingTrack ? (
                <>
                  <div className="text-lg font-semibold text-purple-300">
                    Now Playing:
                  </div>
                  <div className="text-white text-xl font-bold">
                    {playingTrack.title}
                  </div>
                  <div className="text-white/80 text-md">
                    {playingTrack.artist}
                  </div>
                </>
              ) : (
                <span className="text-white/60">Pick a track to play!</span>
              )}
            </div> */}
          </div>

          {/* Lyrics area */}
          <div className="flex-1 h-[420px] rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-center items-start"></div>
        </div>
      </div>
    </div>
  );
};

export default PBplayerPage;
