import { Vote, Radio, ShieldCheck, Sparkles } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

function Feature({ icon, title, desc }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white/5 rounded-lg p-6">
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative z-10 border-y border-white/10 bg-black/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {"Built for streams, clubs, cafés & pop-ups"}
          </h2>
          <p className="mt-3 text-white/70">
            {"Let your audience steer the vibe while you stay in control."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={
              <Vote className="size-5 text-fuchsia-300" aria-hidden="true" />
            }
            title="Live voting"
            desc="Tracks rise and fall in real time with community votes."
          />
          <Feature
            icon={<Radio className="size-5 text-pink-300" aria-hidden="true" />}
            title="Low latency"
            desc="Snappy updates keep your queue in sync with the room."
          />
          <Feature
            icon={
              <ShieldCheck
                className="size-5 text-emerald-300"
                aria-hidden="true"
              />
            }
            title="Host controls"
            desc="Lock genres, set limits, or pin a track at the top."
          />
          <Feature
            icon={
              <Sparkles className="size-5 text-violet-300" aria-hidden="true" />
            }
            title="Beautiful UI"
            desc="Aesthetic, readable, and made to shine on big screens."
          />
        </div>
      </div>
    </section>
  );
}
