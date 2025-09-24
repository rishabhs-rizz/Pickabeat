import { useEffect, useRef } from "react";

interface LyricsProps {
  lyrics: { text: string }[];
  activeIndex: number;
}

export default function LyricsBox({ lyrics, activeIndex }: LyricsProps) {
  const lyricsRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (lyricsRefs.current[activeIndex]) {
      lyricsRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div
      className="
        flex-1 h-[460px]
        rounded-3xl
        overflow-hidden    
        bg-gradient-to-b from-black/60 via-purple-950/40 to-black/60
        backdrop-blur-md shadow-2xl p-8
        flex justify-center items-center
        border border-purple-800/30 hover:border-purple-500/40
        transition-colors duration-500
      "
    >
      <div
        className="
          overflow-y-auto overflow-x-hidden 
          w-full h-full
          space-y-5
          custom-scrollbar
          snap-y snap-mandatory
        "
      >
        {lyrics.length === 0 ? (
          <p className="text-purple-300 text-center italic mt-10">
            No lyrics found
          </p>
        ) : (
          lyrics.map((line, i) => (
            <p
              key={i}
              ref={(el) => {
                lyricsRefs.current[i] = el;
              }}
              className={`
                text-center break-words transition-all duration-100 ease-in-out transform
                ${
                  i === activeIndex
                    ? "text-[#F2F1EB] font-extrabold text-2xl"
                    : "text-purple-200 text-xl opacity-50"
                }
                hover:text-purple-300
              `}
            >
              {line.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
