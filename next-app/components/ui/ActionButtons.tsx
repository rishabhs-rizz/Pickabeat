import { Button } from "./button";

export function ActionButtons() {
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Button
          size="lg"
          className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 cursor-pointer"
        >
          {"Create Stream"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/15 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
        >
          {"Join Stream"}
        </Button>
      </div>
    </>
  );
}
