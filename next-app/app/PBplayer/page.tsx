"use client";
import { SearchResults } from "@/components/SearchResults";
import { ActionButtons } from "@/components/ui/ActionButtons";
import Player from "@/components/ui/PlayerTab";
import { Search } from "@/components/ui/Search";
import { handleMusicConverting, handleMusicPlaying } from "@/lib/Handlers";
import { usePlayerAuth } from "@/lib/usePlayerAuth";

import { Home, SearchIcon } from "lucide-react";
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
  const [audioLink, setAudioLink] = useState<string | null>(null);

  async function chooseTrack(track: Track) {
    setPlayingTrack(track);

    setSearch("");
    setSearchResults([]);
    const YTLINK = await handleMusicConverting(track.uri);
    const audLink = await handleMusicPlaying(YTLINK);
    setAudioLink(audLink);
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
        {audioLink && <audio src={audioLink} controls autoPlay />}
        {/* <Player accessToken={accessToken} trackUri={playingTrack?.uri} /> */}
      </div>
    </div>
  );
};

export default PBplayerPage;
