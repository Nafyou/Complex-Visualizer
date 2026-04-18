export function CanvasSkeleton() {
  return (
    <div className="canvas-frame h-[460px] w-full flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(31,27,26,0.12) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-ochre animate-[blink_1.4s_ease-in-out_infinite]" />
        <span className="font-hand text-ochre text-xl rotate-[-2deg]">
          drawing…
        </span>
      </div>
      <span className="absolute bottom-3 right-4 font-hand text-ink-quiet text-sm">
        the canvas is warming up
      </span>
    </div>
  );
}
