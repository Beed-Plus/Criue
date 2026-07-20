import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  autoplay: number;
}

const GAP_PX = 12;
const MAX_SCALE = 4;
const SWIPE_THRESHOLD = 50;
const DOUBLE_TAP_MS = 280;
const ZOOM_IN_SCALE = 2.5;

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export default function Carousel({
  images = [],
  alt = "Product",
  autoplay = 0,
}: CarouselProps) {
  // ── main carousel ──────────────────────────────────────────────────────────
  const [index, setIndex] = useState(0);
  const total = Math.max(images.length, 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteracting = useRef(false);

  useEffect(() => { indexRef.current = index; }, [index]);

  const slideOffset = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return 0;
    return i * ((track.children[0] as HTMLElement).offsetWidth + GAP_PX);
  }, []);

  const goTo = useCallback((i: number, behavior: ScrollBehavior = "smooth") => {
    trackRef.current?.scrollTo({ left: slideOffset(clamp(i, 0, total - 1)), behavior });
  }, [total, slideOffset]);

  const pauseAutoplay = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  const resumeAutoplay = useCallback(() => {
    if (!autoplay || total <= 1 || isInteracting.current) return;
    pauseAutoplay();
    intervalRef.current = setInterval(() => {
      const i = indexRef.current;
      if (i >= total - 1) { pauseAutoplay(); return; }
      goTo(i + 1);
    }, autoplay);
  }, [autoplay, total, goTo]);

  useEffect(() => { resumeAutoplay(); return pauseAutoplay; }, [resumeAutoplay]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const slideWidth = (track.children[0] as HTMLElement).offsetWidth;
    const nearest = clamp(Math.round(track.scrollLeft / (slideWidth + GAP_PX)), 0, total - 1);
    setIndex(prev => prev === nearest ? prev : nearest);
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => { isInteracting.current = false; resumeAutoplay(); }, 150);
  }, [total, resumeAutoplay]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(indexRef.current - 1);
      if (e.key === "ArrowRight") goTo(indexRef.current + 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goTo]);

  // ── preview state ──────────────────────────────────────────────────────────
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [swipeDelta, setSwipeDelta] = useState(0);

  const previewIndexRef = useRef(0);
  useEffect(() => { previewIndexRef.current = previewIndex; }, [previewIndex]);

  // The active image element — needed for clamping and double-tap offset math
  const imgRefs = useRef<Map<number, HTMLImageElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // ── transform state — kept in refs, flushed to DOM via rAF ────────────────
  // We never call setScale/setOffset during a gesture; only on gesture END or
  // discrete events (double-tap, reset). This keeps the hot path off React.
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // React state for scale is only used to gate swipe vs pan mode in render.
  // It's updated lazily, not on every pointer move.
  const [scaleState, setScaleState] = useState(1);

  const applyTransform = useCallback(() => {
    const img = imgRefs.current.get(previewIndexRef.current);
    if (!img) return;
    img.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${scaleRef.current})`;
  }, []);

  const scheduleApply = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applyTransform();
    });
  }, [applyTransform]);

  const clampOffset = useCallback((ox: number, oy: number, s: number, imgIdx: number) => {
    if (s <= 1) return { x: 0, y: 0 };
    const img = imgRefs.current.get(imgIdx);
    if (!img) return { x: ox, y: oy };
    const maxX = (img.offsetWidth  * (s - 1)) / 2;
    const maxY = (img.offsetHeight * (s - 1)) / 2;
    return { x: clamp(ox, -maxX, maxX), y: clamp(oy, -maxY, maxY) };
  }, []);

  const resetZoom = useCallback((imgIdx?: number) => {
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setScaleState(1);
    // apply immediately so the image doesn't flash in wrong position
    const img = imgRefs.current.get(imgIdx ?? previewIndexRef.current);
    if (img) img.style.transform = "";
  }, []);

  // Zoom in to `targetScale` centred on a viewport point (cx, cy).
  // If (cx, cy) are omitted, zooms to center.
  const zoomTo = useCallback((targetScale: number, cx?: number, cy?: number) => {
    const idx = previewIndexRef.current;
    const img = imgRefs.current.get(idx);
    const container = containerRef.current;
    if (!img || !container) return;

    const clampedScale = clamp(targetScale, 1, MAX_SCALE);

    let ox = 0, oy = 0;
    if (clampedScale > 1 && cx !== undefined && cy !== undefined) {
      // cx/cy are viewport coords; map to image-local coords
      const rect = img.getBoundingClientRect();
      // Position of tap relative to image center
      const localX = cx - (rect.left + rect.width  / 2);
      const localY = cy - (rect.top  + rect.height / 2);
      // To keep that spot under the finger after scaling, we need to
      // translate the image so the tapped point stays fixed:
      //   newOffset = -localX * (scale - 1) in image space
      ox = -localX * (clampedScale - 1);
      oy = -localY * (clampedScale - 1);
    }

    const clamped = clampOffset(ox, oy, clampedScale, idx);
    scaleRef.current = clampedScale;
    offsetRef.current = clamped;
    setScaleState(clampedScale); // update React so swipe/pan gate flips

    if (img) {
      img.style.transform =
        clampedScale === 1
          ? ""
          : `translate(${clamped.x}px, ${clamped.y}px) scale(${clampedScale})`;
    }
  }, [clampOffset]);

  // ── pointer gesture tracking (all in refs) ─────────────────────────────────
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());

  const pinchAnchor = useRef<{
    distance: number;
    scale: number;
    midX: number; midY: number; // viewport midpoint at pinch start
    offsetX: number; offsetY: number; // image offset at pinch start
  } | null>(null);

  const panAnchor = useRef<{
    pointerId: number;
    startX: number; startY: number;
    startOffsetX: number; startOffsetY: number;
  } | null>(null);

  const swipeAnchor = useRef<{ startX: number } | null>(null);

  const lastTapTime = useRef(0);
  const lastTapPos  = useRef({ x: 0, y: 0 });

  const openPreview = (i: number) => {
    pointers.current.clear();
    pinchAnchor.current = null;
    panAnchor.current = null;
    swipeAnchor.current = null;
    setPreviewIndex(i);
    setSwipeDelta(0);
    setScaleState(1);
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setPreviewOpen(true);
  };

  const closePreview = () => {
    resetZoom();
    setPreviewOpen(false);
    setSwipeDelta(0);
    pointers.current.clear();
  };

  useEffect(() => {
    if (previewOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [previewOpen]);

  // reset zoom whenever slide changes
  useEffect(() => {
    if (previewOpen) resetZoom(previewIndex);
  }, [previewIndex, previewOpen, resetZoom]);

  // ── pointer down ───────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const count = pointers.current.size;

    if (count === 2) {
      // ── initiate pinch ──
      swipeAnchor.current = null;
      panAnchor.current = null;
      setSwipeDelta(0);

      const pts = Array.from(pointers.current.values());
      const mx = (pts[0].x + pts[1].x) / 2;
      const my = (pts[0].y + pts[1].y) / 2;
      pinchAnchor.current = {
        distance: dist2(pts[0], pts[1]),
        scale: scaleRef.current,
        midX: mx, midY: my,
        offsetX: offsetRef.current.x,
        offsetY: offsetRef.current.y,
      };
    } else if (count === 1) {
      pinchAnchor.current = null;

      if (scaleRef.current > 1) {
        // ── pan mode ──
        panAnchor.current = {
          pointerId: e.pointerId,
          startX: e.clientX, startY: e.clientY,
          startOffsetX: offsetRef.current.x,
          startOffsetY: offsetRef.current.y,
        };
        swipeAnchor.current = null;
      } else {
        // ── swipe or double-tap ──
        swipeAnchor.current = { startX: e.clientX };
        panAnchor.current = null;
      }
    }
  }, []);

  // ── pointer move ───────────────────────────────────────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // ── pinch ──
    if (pointers.current.size === 2 && pinchAnchor.current) {
      const pts = Array.from(pointers.current.values());
      const d = dist2(pts[0], pts[1]);
      const rawScale = (d / pinchAnchor.current.distance) * pinchAnchor.current.scale;
      const newScale = clamp(rawScale, 1, MAX_SCALE);

      // zoom toward the pinch midpoint (anchor.midX/Y)
      const a = pinchAnchor.current;
      const container = containerRef.current;
      if (container) {
        const cx = container.clientWidth  / 2;
        const cy = container.clientHeight / 2;
        // distance from container center to pinch midpoint
        const dmx = a.midX - cx;
        const dmy = a.midY - cy;
        const ratio = newScale / a.scale;
        // translate so the midpoint stays visually fixed
        const newOx = a.offsetX * ratio - dmx * (ratio - 1);
        const newOy = a.offsetY * ratio - dmy * (ratio - 1);
        const clamped = clampOffset(newOx, newOy, newScale, previewIndexRef.current);
        scaleRef.current = newScale;
        offsetRef.current = clamped;
        scheduleApply();
      }
      return;
    }

    // ── pan ──
    if (panAnchor.current?.pointerId === e.pointerId && scaleRef.current > 1) {
      const dx = e.clientX - panAnchor.current.startX;
      const dy = e.clientY - panAnchor.current.startY;
      const clamped = clampOffset(
        panAnchor.current.startOffsetX + dx,
        panAnchor.current.startOffsetY + dy,
        scaleRef.current,
        previewIndexRef.current,
      );
      offsetRef.current = clamped;
      scheduleApply();
      return;
    }

    // ── swipe ──
    if (swipeAnchor.current && scaleRef.current === 1) {
      const dx = e.clientX - swipeAnchor.current.startX;
      setSwipeDelta(dx);
    }
  }, [clampOffset, scheduleApply]);

  // ── pointer up ─────────────────────────────────────────────────────────────
  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}

    const swipeDx = swipeAnchor.current ? (e.clientX - swipeAnchor.current.startX) : 0;
    const wasSwipe = !!swipeAnchor.current && scaleRef.current === 1;

    pointers.current.delete(e.pointerId);

    if (panAnchor.current?.pointerId === e.pointerId) {
      panAnchor.current = null;
    }

    const remaining = pointers.current.size;

    // ── pinch finger lifted ──
    if (pinchAnchor.current) {
      if (remaining === 1) {
        // hand off to pan if still zoomed
        pinchAnchor.current = null;
        if (scaleRef.current > 1) {
          const [id, pt] = Array.from(pointers.current.entries())[0];
          panAnchor.current = {
            pointerId: id,
            startX: pt.x, startY: pt.y,
            startOffsetX: offsetRef.current.x,
            startOffsetY: offsetRef.current.y,
          };
        }
      }
      // snap to 1 if pinched all the way back
      if (scaleRef.current <= 1.05) resetZoom();
      // update React scale state so mode gates re-evaluate
      setScaleState(scaleRef.current <= 1.05 ? 1 : scaleRef.current);
      return;
    }

    if (remaining > 0) return;

    // ── all fingers up ──
    pinchAnchor.current = null;

    // double-tap detection (pointer events only, works on both desktop + mobile)
    const now = performance.now();
    const tapX = e.clientX;
    const tapY = e.clientY;
    const dt = now - lastTapTime.current;
    const moved = Math.abs(tapX - lastTapPos.current.x) < 20 && Math.abs(tapY - lastTapPos.current.y) < 20;

    if (dt < DOUBLE_TAP_MS && moved && !wasSwipe) {
      // double tap: toggle zoom at tapped position
      if (scaleRef.current > 1) {
        resetZoom();
      } else {
        zoomTo(ZOOM_IN_SCALE, tapX, tapY);
      }
      lastTapTime.current = 0; // reset so triple-tap doesn't re-fire
      swipeAnchor.current = null;
      setSwipeDelta(0);
      return;
    }

    lastTapTime.current = now;
    lastTapPos.current = { x: tapX, y: tapY };

    // ── commit or cancel swipe ──
    if (wasSwipe) {
      swipeAnchor.current = null;
      setSwipeDelta(0);
      if (Math.abs(swipeDx) >= SWIPE_THRESHOLD) {
        const dir = swipeDx < 0 ? 1 : -1;
        const next = clamp(previewIndexRef.current + dir, 0, images.length - 1);
        if (next !== previewIndexRef.current) {
          resetZoom(previewIndexRef.current);
          setPreviewIndex(next);
        }
      }
    }
  }, [images.length, resetZoom, zoomTo]);

  // ── slide width for swipe strip ────────────────────────────────────────────
  const [slideWidth, setSlideWidth] = useState(0);
  useEffect(() => {
    if (!previewOpen || !containerRef.current) return;
    const measure = () => setSlideWidth(containerRef.current?.clientWidth ?? 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [previewOpen]);

  return (
    <div
      className="relative w-full mt-6 select-none"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={() => !isInteracting.current && resumeAutoplay()}
      role="region"
      aria-label="Product images"
    >
      {/* ── main carousel track ── */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={() => { isInteracting.current = true; pauseAutoplay(); }}
        onTouchStart={() => { isInteracting.current = true; pauseAutoplay(); }}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x
          [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {images.length > 0 ? (
          images.map((src, i) => (
            <button
              key={i}
              onClick={() => openPreview(i)}
              className="first:ml-4 md:first:ml-8 lg:first:ml-10 lg:last:mr-5 flex-none w-[95%] max-w-[327px] min-h-[365px] max-h-[400px] relative overflow-hidden rounded-2xl snap-center"
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
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-xs tracking-widest uppercase">No image</span>
            </div>
          </div>
        )}
      </div>

      {/* ── dots ── */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6" role="tablist" aria-label="Slide indicators">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to image ${i + 1}`}
              className={`rounded-full border-none p-0 cursor-pointer transition-all duration-200
                ${i === index ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
      )}

      {/* ── full-screen preview ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">

          {/* close */}
          <button
            type="button"
            onClick={closePreview}
            className="absolute right-5 top-5 z-30 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2.5 text-white transition-colors"
            aria-label="Close preview"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L7 7L13 13M13 1L7 7L1 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* dots */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200
                    ${i === previewIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`}
                />
              ))}
            </div>
          )}

          {/* gesture surface — owns ALL pointer events, no native scroll */}
          <div
            ref={containerRef}
            className="absolute inset-0"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "none", userSelect: "none" }}
          >
            {/*
              Slide strip: positioned by CSS transform, never native scroll.
              swipeDelta shifts the strip live while finger is down;
              when finger lifts it snaps to the new index with a CSS transition.
            */}
            <div
              className="absolute inset-0 flex"
              style={{
                transform: `translateX(calc(${-previewIndex * 100}% + ${swipeDelta}px))`,
                transition: swipeDelta === 0 ? "transform 0.28s cubic-bezier(.32,.72,0,1)" : "none",
                willChange: "transform",
              }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  className="min-w-full h-full flex items-center justify-center bg-black overflow-hidden"
                >
                  <img
                    ref={el => { if (el) imgRefs.current.set(i, el); else imgRefs.current.delete(i); }}
                    src={src}
                    alt={`${alt} preview ${i + 1}`}
                    draggable={false}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                    style={{
                      transformOrigin: "center center",
                      willChange: "transform",
                      // transform is applied imperatively via ref — not via React state
                      // so we don't re-render on every pointer move
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}