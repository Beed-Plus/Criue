import { useCallback, useEffect, useRef, useState } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  autoplay: number;
}

export default function Carousel({
  images = [],
  alt = "Product",
  autoplay = 0,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const total = Math.max(images.length, 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const MIN_SWIPE_PX = 40;

  const goTo = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total],
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    intervalRef.current = setInterval(next, autoplay);
    return () => clearInterval(intervalRef.current!);
  }, [autoplay, total, next]);

  const pauseAutoplay = () => clearInterval(intervalRef.current!);
  const resumeAutoplay = () => {
    if (!autoplay || total <= 1) return;
    intervalRef.current = setInterval(next, autoplay);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = null;
    pauseAutoplay();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) >= MIN_SWIPE_PX) diff > 0 ? next() : prev();
    touchStart.current = null;
    touchEnd.current = null;
    resumeAutoplay();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <div
      className="relative w-full sm:max-w-[327px] mx-auto mt-6 select-none"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      role="region"
      aria-label="Product images"
    >
      {/* Viewport */}
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-3 transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {images.length > 0 ? (
            images.map((src, i) => (
              <div
                key={i}
                className="flex-none w-[97%] sm:max-w-[327px] min-h-[365px] max-h-[400px] relative overflow-hidden rounded-2xl"
                aria-hidden={i !== index}
              >
                <img
                  src={src}
                  alt={`${alt} — view ${i + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))
          ) : (
            <div className="flex-none w-full min-h-[260px] max-h-[340px] flex items-center justify-center bg-[#141414]">
              <div className="flex flex-col items-center gap-3 text-white/15">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs tracking-widest uppercase">
                  No image
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dots */}
      {total > 1 && (
        <div
          className="flex items-center justify-center gap-1.5  mt-6"
          role="tablist"
          aria-label="Slide indicators"
        >
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to image ${i + 1}`}
              className={`rounded-full border-none p-0 cursor-pointer transition-all duration-200
                ${
                  i === index
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
