import { useCallback, useEffect, useRef, useState } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  autoplay: number;
}

const GAP_PX = 12; // matches gap-3

export default function Carousel({
  images = [],
  alt = "Product",
  autoplay = 0,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const total = Math.max(images.length, 1);

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteracting = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const slideOffset = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return 0;
    const slideWidth = (track.children[0] as HTMLElement).offsetWidth;
    return i * (slideWidth + GAP_PX);
  }, []);

  const goTo = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const clamped = Math.min(Math.max(i, 0), total - 1);
      trackRef.current?.scrollTo({ left: slideOffset(clamped), behavior });
    },
    [total, slideOffset],
  );
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  const pauseAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resumeAutoplay = useCallback(() => {
    if (!autoplay || total <= 1 || isInteracting.current) return;
    pauseAutoplay();
    intervalRef.current = setInterval(() => {
      const i = indexRef.current;
      if (i >= total - 1) {
        pauseAutoplay(); // reached the end — stop instead of wrapping
        return;
      }
      goTo(i + 1);
    }, autoplay);
  }, [autoplay, total, goTo]);

  useEffect(() => {
    resumeAutoplay();
    return pauseAutoplay;
  }, [resumeAutoplay]);

  // Keeps `index` (and the dots) synced to wherever native scroll/snap actually lands —
  // covers touch swipe, trackpad, scrollbar drag, and programmatic goTo alike.
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const slideWidth = (track.children[0] as HTMLElement).offsetWidth;
    const raw = track.scrollLeft / (slideWidth + GAP_PX);
    const nearest = Math.min(Math.max(Math.round(raw), 0), total - 1);
    setIndex((prev) => (prev === nearest ? prev : nearest));

    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      isInteracting.current = false;
      resumeAutoplay();
    }, 150);
  }, [total, resumeAutoplay]);

  const beginInteraction = () => {
    isInteracting.current = true;
    pauseAutoplay();
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
      className="relative w-full mt-6 select-none"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={() => !isInteracting.current && resumeAutoplay()}
      role="region"
      aria-label="Product images"
    >
      {/* Native scroll-snap track — this IS the scroller, no transform trick */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={beginInteraction}
        onTouchStart={beginInteraction}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x
          [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {images.length > 0 ? (
          images.map((src, i) => (
            <div
              key={i}
              className="flex-none w-[95%] max-w-[327px] min-h-[365px] max-h-[400px] relative overflow-hidden rounded-2xl snap-center"
              aria-hidden={i !== index}
            >
              <img
                src={src}
                alt={`${alt} — view ${i + 1}`}
                draggable={false}
                className="w-full h-full"
              />
            </div>
          ))
        ) : (
          <div className="flex-none w-full min-h-[260px] max-h-[340px] flex items-center justify-center bg-[#141414] snap-center">
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

      {/* Dots */}
      {total > 1 && (
        <div
          className="flex items-center justify-center gap-1.5 mt-6"
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