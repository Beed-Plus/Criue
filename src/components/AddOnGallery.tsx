import { useEffect, useRef, useState } from "react";
import type { Product } from "../data/product";

type Props = {
  addOns?: Product["addOns"];
};

export function AddOnGallery({ addOns }: Props) {
  const [activeAddOnIndex, setActiveAddOnIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const preloadedImages = useRef(new Set<string>());

  const activeAddOn =
    activeAddOnIndex !== null && addOns ? addOns[activeAddOnIndex] : undefined;
  const gallery =
    activeAddOn?.gallery && activeAddOn.gallery.length
      ? activeAddOn.gallery
      : activeAddOn?.image
        ? [activeAddOn.image]
        : [];

  const openViewer = (index: number) => {
    setActiveAddOnIndex(index);
    setActiveImageIndex(0);
  };

  const closeViewer = () => {
    setActiveAddOnIndex(null);
  };

  useEffect(() => {
    if (!addOns) return;

    addOns.forEach((addon) => {
      const images = addon.gallery && addon.gallery.length ? addon.gallery : [addon.image];
      images.forEach((src) => {
        if (!preloadedImages.current.has(src)) {
          const img = new Image();
          img.src = src;
          img.onload = () => preloadedImages.current.add(src);
        }
      });
    });
  }, [addOns]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (activeAddOn) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeAddOn]);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({
      left: trackRef.current.clientWidth * activeImageIndex,
      behavior: "smooth",
    });
  }, [activeImageIndex, activeAddOn]);

  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <>
      <div role="list" className="flex flex-wrap gap-2">
        {addOns.map((addon, index) => (
          <div
            key={addon.name}
            role="listitem"
            className="flex flex-col items-center gap-1"
          >
            <button
              type="button"
              onClick={() => openViewer(index)}
              className="rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#009DFF]"
            >
              <img
                src={addon.image}
                alt={addon.name}
                className="w-47 h-47 max-sm:w-40 max-sm:h-40 md:min-h-[188px] bg-white"
              />
            </button>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center leading-snug">
              {addon.name}
            </span>
          </div>
        ))}
      </div>

      {activeAddOn && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black py-4">
          <div className="w-full max-w-8xl max-h-[95vh] overflow-hidden rounded-3xl bg-black">
            <button
              type="button"
              onClick={closeViewer}
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

            <div className="flex h-full min-h-[70vh] flex-col items-center justify-center bg-black">
              <div
                ref={trackRef}
                onScroll={() => {
                  if (!trackRef.current) return;
                  const width = trackRef.current.clientWidth;
                  const index = Math.round(trackRef.current.scrollLeft / width);
                  if (index !== activeImageIndex) {
                    setActiveImageIndex(index);
                  }
                }}
                className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {gallery.map((src, index) => (
                  <div
                    key={src}
                    className="min-w-[100vw] flex items-center justify-center snap-center"
                  >
                    <img
                      src={src}
                      alt={`${activeAddOn.name} preview ${index + 1}`}
                      className="max-h-[80vh] md:max-h[75vh] w-auto max-w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-14 w-14 overflow-hidden rounded-xl border ${
                      index === activeImageIndex
                        ? "border-[#009DFF]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${activeAddOn.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
