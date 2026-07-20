import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

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
  const previewTrackRef = useRef<HTMLDivElement>(null);
  const previewScrollPending = useRef(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteracting = useRef(false);
  const [touchIndex, setTouchIndex] = useState<number | null>(0);
  const [previewImage, setPreviewImage] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchState = useRef<{ distance: number; scale: number } | null>(null);

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

  const showPreview = (index: number) => {
    previewScrollPending.current = true;
    setPreviewScale(1);
    activePointers.current.clear();
    pinchState.current = null;
    setTouchIndex(index);
    setPreviewImage(true);
  };

  const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);

    if (activePointers.current.size === 2) {
      const points = Array.from(activePointers.current.values());
      pinchState.current = {
        distance: getDistance(points[0], points[1]),
        scale: previewScale,
      };
    }
  };

  const handlePreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pinchState.current || activePointers.current.size !== 2) return;
    if (!activePointers.current.has(e.pointerId)) return;

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const points = Array.from(activePointers.current.values());
    if (points.length !== 2) return;

    const distance = getDistance(points[0], points[1]);
    const scale = Math.min(Math.max((distance / pinchState.current.distance) * pinchState.current.scale, 1), 3);
    setPreviewScale(scale);
  };

  const handlePreviewPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(e.pointerId);
    pinchState.current = activePointers.current.size === 2 ? pinchState.current : null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!previewImage || !previewScrollPending.current || touchIndex === null) return;
    const track = previewTrackRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      const width = track.clientWidth;
      if (width) {
        track.scrollTo({ left: width * touchIndex, behavior: "auto" });
      }
      previewScrollPending.current = false;
    });
  }, [previewImage, touchIndex]);

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
            <button
              key={i}
              onClick={() => showPreview(i)}
              className="first:ml-4 md:first:ml-8 lg:first:ml-10 lg:last:mr-5 flex-none w-[95%] max-w-[327px] min-h-[365px] max-h-[365px] relative overflow-hidden rounded-2xl snap-center"
              aria-hidden={i !== index}
            >
              <img
                src={src}
                alt={`${alt} — view ${i + 1}`}
                draggable={false}
                className="w-full h-full"
              />
            </button>
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

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black py-4">
          <div className="w-full max-w-8xl overflow-visible rounded-3xl bg-black">
            <button
              type="button"
              onClick={() => setPreviewImage(false)}
              className="absolute right-6 top-6 z-20 rounded-full bg-black/80 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div className="flex min-h-[65vh] flex-col mt-10 items-center justify-center bg-black overflow-auto">
              <div
                ref={previewTrackRef}
                onScroll={() => {
                  if (!previewTrackRef.current) return;
                  const width = previewTrackRef.current.clientWidth;
                  const index = Math.round(previewTrackRef.current.scrollLeft / width);
                  if (index !== touchIndex) {
                    setTouchIndex(index);
                  }
                }}
                onPointerDown={handlePreviewPointerDown}
                onPointerMove={handlePreviewPointerMove}
                onPointerUp={handlePreviewPointerUp}
                onPointerCancel={handlePreviewPointerUp}
                style={{ touchAction: "pan-x pinch-zoom" }}
                className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory touch-pan-x scrollbar-none [&::-webkit-scrollbar]:hidden"
              >
                {images.map((src, index) => (
                  <div
                    key={src}
                    className="min-w-screen flex items-center justify-center snap-center overflow-visible"
                  >
                    <img
                      src={src}
                      alt={`${alt} preview ${index + 1}`}
                      className="w-auto max-w-none object-contain transition-transform duration-200 ease-in-out"
                      style={{ transform: `scale(${previewScale})` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
