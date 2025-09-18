"use client";
import { SearchResults } from "@/components/SearchResults";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { Search } from "@/components/ui/Search";
import { getYoutubeVideoId, handleMusicConverting } from "@/lib/Handlers";
import { usePlayerAuth } from "@/lib/usePlayerAuth";
import {
  Home,
  Pause,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { parseLRC } from "@/lib/utils";
import Controllables from "@/components/ui/Controllables";

export type Track = {
  artist: string;
  title: string;
  uri: string;
  albumUrl: string;
};

export type LyricLine = { time: number; text: string };

const PBplayerPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const accessToken = usePlayerAuth(code || "");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lyricsRefs = useRef<Array<HTMLParagraphElement | null>>([]);

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

  async function chooseTrack(track: Track) {
    setPlayingTrack(track);
    setSearch("");
    setSearchResults([]);
    const res = await handleMusicConverting(track.uri);
    const id = getYoutubeVideoId(res || "");
    setVideoId(id);
    setActiveIndex(0);
  }

  // fetch LRC when track changes
  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3000/api/lyrics", {
        params: { track: playingTrack.title, artist: playingTrack.artist },
      })
      .then((res) => setLyrics(parseLRC(res.data.lyrics || "")))
      .catch(() => setLyrics([]));
  }, [playingTrack]);

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
    });
    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  // poll current time to update activeIndex
  useEffect(() => {
    if (!player || lyrics.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      const t = player.getCurrentTime();
      let idx = lyrics.findIndex((l, i) => {
        const next = lyrics[i + 1];
        return t >= l.time && (!next || t < next.time);
      });
      if (idx === -1) idx = lyrics.length - 1;
      setActiveIndex(idx);
    }, 300);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player, lyrics]);

  useEffect(() => {
    if (lyricsRefs.current[activeIndex]) {
      lyricsRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl text-white">
        Loading…
      </div>
    );
  }

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
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-xl max-h-96 overflow-y-auto rounded-2xl bg-black/90 backdrop-blur-lg shadow-2xl border border-purple-700 custom-scrollbar transition-all z-30">
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

        <div className="mt-12 flex flex-row items-center justify-center gap-10">
          {/*yt player */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-[300px] relative rounded-3xl bg-black/60 backdrop-blur-lg shadow-2xl p-4 flex items-center justify-center">
              {playingTrack?.albumUrl && (
                <>
                  <img
                    src={playingTrack.albumUrl}
                    alt={playingTrack.title}
                    className="absolute w-[270px] h-[270px] object-cover rounded-2xl opacity-100 z-10 pointer-events-none"
                    style={{
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    }}
                  />
                </>
              )}
              {videoId ? (
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: "260",
                    height: "260",
                    playerVars: { autoplay: 1 },
                  }}
                  onReady={(e: YouTubeEvent) => setPlayer(e.target)}
                  onStateChange={(e) => {
                    if (e.data === 1) setPlaying(true); // PLAYING
                    else if (e.data === 2 || e.data === 0) setPlaying(false); // PAUSED or ENDED
                  }}
                />
              ) : (
                <div className="text-gray-400 text-xl">No video selected</div>
              )}
            </div>
            <span className="w-full pl-4">
              <p className="font-bold">{playingTrack?.title}</p>{" "}
              <p className="text-xs font-light">{playingTrack?.artist}</p>
            </span>

            <Controllables
              player={player}
              duration={player ? player.getDuration() : 0}
              playing={playing}
              setPlaying={setPlaying}
            />
          </div>

          {/* Lyrics */}
          <div className="flex-1 h-[420px] rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-center items-start">
            <div className="overflow-y-auto w-full h-full space-y-3 custom-scrollbar">
              {lyrics.length === 0 ? (
                <p className="text-purple-200">No lyrics found</p>
              ) : (
                lyrics.map((line, i) => (
                  <p
                    key={i}
                    ref={(el: HTMLParagraphElement | null) => {
                      lyricsRefs.current[i] = el;
                    }}
                    className={
                      i === activeIndex
                        ? "text-purple-400 font-bold"
                        : "text-purple-100"
                    }
                  >
                    {line.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PBplayerPage;
