import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "../data/product";

type Props = {
  addOns?: Product["addOns"];
};

const MAX_SCALE = 4;
const SWIPE_THRESHOLD = 50;
const DOUBLE_TAP_MS = 280;
const ZOOM_IN_SCALE = 2.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function AddOnGallery({ addOns }: Props) {
  const [activeAddOnIndex, setActiveAddOnIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const preloadedImages = useRef(new Set<string>());

  const activeAddOnIndexRef = useRef<number | null>(null);
  const activeImageIndexRef = useRef(0);
  useEffect(() => { activeAddOnIndexRef.current = activeAddOnIndex; }, [activeAddOnIndex]);
  useEffect(() => { activeImageIndexRef.current = activeImageIndex; }, [activeImageIndex]);

  const activeAddOn =
    activeAddOnIndex !== null && addOns ? addOns[activeAddOnIndex] : undefined;
  const gallery =
    activeAddOn?.gallery?.length
      ? activeAddOn.gallery
      : activeAddOn?.image
        ? [activeAddOn.image]
        : [];
  const galleryRef = useRef<string[]>([]);
  useEffect(() => { galleryRef.current = gallery; }, [gallery]);

  // ── transform state — refs drive DOM directly, React state only gates mode ─
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [scaleState, setScaleState] = useState(1); // used only for swipe/pan gate

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafRef = useRef<number | null>(null);

  const applyTransform = useCallback(() => {
    const img = imgRefs.current.get(activeImageIndexRef.current);
    if (!img) return;
    if (scaleRef.current <= 1) {
      img.style.transform = "";
    } else {
      img.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${scaleRef.current})`;
    }
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
    const img = imgRefs.current.get(imgIdx ?? activeImageIndexRef.current);
    if (img) img.style.transform = "";
  }, []);

  const zoomTo = useCallback((targetScale: number, cx?: number, cy?: number) => {
    const idx = activeImageIndexRef.current;
    const img = imgRefs.current.get(idx);
    if (!img) return;

    const s = clamp(targetScale, 1, MAX_SCALE);
    let ox = 0, oy = 0;

    if (s > 1 && cx !== undefined && cy !== undefined) {
      const rect = img.getBoundingClientRect();
      const localX = cx - (rect.left + rect.width  / 2);
      const localY = cy - (rect.top  + rect.height / 2);
      ox = -localX * (s - 1);
      oy = -localY * (s - 1);
    }

    const clamped = clampOffset(ox, oy, s, idx);
    scaleRef.current = s;
    offsetRef.current = clamped;
    setScaleState(s);
    img.style.transform =
      s <= 1 ? "" : `translate(${clamped.x}px, ${clamped.y}px) scale(${s})`;
  }, [clampOffset]);

  // ── pointer gesture tracking ───────────────────────────────────────────────
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());

  const pinchAnchor = useRef<{
    distance: number; scale: number;
    midX: number; midY: number;
    offsetX: number; offsetY: number;
  } | null>(null);

  const panAnchor = useRef<{
    pointerId: number;
    startX: number; startY: number;
    startOffsetX: number; startOffsetY: number;
  } | null>(null);

  const swipeAnchor = useRef<{ startX: number } | null>(null);
  const lastTapTime = useRef(0);
  const lastTapPos  = useRef({ x: 0, y: 0 });

  const openViewer = (index: number) => {
    pointers.current.clear();
    pinchAnchor.current = null;
    panAnchor.current = null;
    swipeAnchor.current = null;
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setScaleState(1);
    setSwipeDelta(0);
    setActiveImageIndex(0);
    setActiveAddOnIndex(index);
  };

  const closeViewer = () => {
    resetZoom();
    setSwipeDelta(0);
    pointers.current.clear();
    setActiveAddOnIndex(null);
  };

  // reset zoom when active image changes (swipe to new slide)
  useEffect(() => {
    if (activeAddOn) resetZoom(activeImageIndex);
  }, [activeImageIndex, activeAddOn, resetZoom]);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (activeAddOn) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [activeAddOn]);

  // preload all add-on images
  useEffect(() => {
    if (!addOns) return;
    addOns.forEach((addon) => {
      const imgs = addon.gallery?.length ? addon.gallery : [addon.image];
      imgs.forEach((src) => {
        if (!preloadedImages.current.has(src)) {
          const img = new Image();
          img.src = src;
          img.onload = () => preloadedImages.current.add(src);
        }
      });
    });
  }, [addOns]);

  // ── pointer down ───────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const count = pointers.current.size;

    if (count === 2) {
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
        panAnchor.current = {
          pointerId: e.pointerId,
          startX: e.clientX, startY: e.clientY,
          startOffsetX: offsetRef.current.x,
          startOffsetY: offsetRef.current.y,
        };
        swipeAnchor.current = null;
      } else {
        swipeAnchor.current = { startX: e.clientX };
        panAnchor.current = null;
      }
    }
  }, []);

  // ── pointer move ───────────────────────────────────────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // pinch
    if (pointers.current.size === 2 && pinchAnchor.current) {
      const pts = Array.from(pointers.current.values());
      const d = dist2(pts[0], pts[1]);
      const rawScale = (d / pinchAnchor.current.distance) * pinchAnchor.current.scale;
      const newScale = clamp(rawScale, 1, MAX_SCALE);
      const a = pinchAnchor.current;
      const container = containerRef.current;
      if (container) {
        const cx = container.clientWidth  / 2;
        const cy = container.clientHeight / 2;
        const dmx = a.midX - cx;
        const dmy = a.midY - cy;
        const ratio = newScale / a.scale;
        const newOx = a.offsetX * ratio - dmx * (ratio - 1);
        const newOy = a.offsetY * ratio - dmy * (ratio - 1);
        const clamped = clampOffset(newOx, newOy, newScale, activeImageIndexRef.current);
        scaleRef.current = newScale;
        offsetRef.current = clamped;
        scheduleApply();
      }
      return;
    }

    // pan
    if (panAnchor.current?.pointerId === e.pointerId && scaleRef.current > 1) {
      const dx = e.clientX - panAnchor.current.startX;
      const dy = e.clientY - panAnchor.current.startY;
      const clamped = clampOffset(
        panAnchor.current.startOffsetX + dx,
        panAnchor.current.startOffsetY + dy,
        scaleRef.current,
        activeImageIndexRef.current,
      );
      offsetRef.current = clamped;
      scheduleApply();
      return;
    }

    // swipe
    if (swipeAnchor.current && scaleRef.current === 1) {
      setSwipeDelta(e.clientX - swipeAnchor.current.startX);
    }
  }, [clampOffset, scheduleApply]);

  // ── pointer up ─────────────────────────────────────────────────────────────
  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}

    const swipeDx = swipeAnchor.current ? (e.clientX - swipeAnchor.current.startX) : 0;
    const wasSwipe = !!swipeAnchor.current && scaleRef.current === 1;

    pointers.current.delete(e.pointerId);
    if (panAnchor.current?.pointerId === e.pointerId) panAnchor.current = null;

    const remaining = pointers.current.size;

    // pinch finger lifted — hand off to pan or snap back
    if (pinchAnchor.current) {
      if (remaining === 1) {
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
      if (scaleRef.current <= 1.05) resetZoom();
      setScaleState(scaleRef.current <= 1.05 ? 1 : scaleRef.current);
      return;
    }

    if (remaining > 0) return;

    pinchAnchor.current = null;

    // double-tap detection
    const now = performance.now();
    const dx = Math.abs(e.clientX - lastTapPos.current.x);
    const dy = Math.abs(e.clientY - lastTapPos.current.y);
    const isDoubleTap = now - lastTapTime.current < DOUBLE_TAP_MS && dx < 20 && dy < 20 && !wasSwipe;

    if (isDoubleTap) {
      if (scaleRef.current > 1) {
        resetZoom();
      } else {
        zoomTo(ZOOM_IN_SCALE, e.clientX, e.clientY);
      }
      lastTapTime.current = 0;
      swipeAnchor.current = null;
      setSwipeDelta(0);
      return;
    }

    lastTapTime.current = now;
    lastTapPos.current = { x: e.clientX, y: e.clientY };

    // commit or cancel swipe
    if (wasSwipe) {
      swipeAnchor.current = null;
      setSwipeDelta(0);
      if (Math.abs(swipeDx) >= SWIPE_THRESHOLD) {
        const dir = swipeDx < 0 ? 1 : -1;
        const next = clamp(activeImageIndexRef.current + dir, 0, galleryRef.current.length - 1);
        if (next !== activeImageIndexRef.current) {
          resetZoom(activeImageIndexRef.current);
          setActiveImageIndex(next);
        }
      }
    }
  }, [resetZoom, zoomTo]);

  if (!addOns || addOns.length === 0) return null;

  return (
    <>
      <div role="list" className="flex flex-wrap gap-2">
        {addOns.map((addon, index) => (
          <div key={addon.name} role="listitem" className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => openViewer(index)}
              className="rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#009DFF]"
            >
              <img
                src={addon.image}
                alt={addon.name}
                className="sm:w-47 sm:h-47 max-sm:w-30 max-sm:h-30 md:min-h-[188px] bg-white"
              />
            </button>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center leading-snug">
              {addon.name}
            </span>
          </div>
        ))}
      </div>

      {activeAddOn && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">
          <div className="relative w-full h-full bg-black">

            <button
              type="button"
              onClick={closeViewer}
              className="absolute right-5 top-5 z-30 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2.5 text-white transition-colors"
              aria-label="Close preview"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>

            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 px-4">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => { resetZoom(); setActiveImageIndex(i); }}
                    className={`h-14 w-14 flex-none overflow-hidden rounded-xl border-2 transition-colors ${
                      i === activeImageIndex ? "border-[#009DFF]" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={src} alt={`${activeAddOn.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div
              ref={containerRef}
              className="absolute inset-0"
              style={{ touchAction: "none", userSelect: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div
                className="absolute inset-0 flex"
                style={{
                  transform: `translateX(calc(${-activeImageIndex * 100}% + ${swipeDelta}px))`,
                  transition: swipeDelta === 0 ? "transform 0.28s cubic-bezier(.32,.72,0,1)" : "none",
                  willChange: "transform",
                }}
              >
                {gallery.map((src, i) => (
                  <div
                    key={src}
                    className="min-w-full h-full flex items-center justify-center bg-black overflow-hidden"
                    style={{ paddingBottom: gallery.length > 1 ? "80px" : 0 }}
                  >
                    <img
                      ref={el => { if (el) imgRefs.current.set(i, el); else imgRefs.current.delete(i); }}
                      src={src}
                      alt={`${activeAddOn.name} preview ${i + 1}`}
                      draggable={false}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                      style={{ transformOrigin: "center center", willChange: "transform" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}