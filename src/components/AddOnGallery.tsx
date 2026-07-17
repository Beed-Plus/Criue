import { useState } from "react";
import type { Product } from "../data/product";

type Props = {
  addOns?: Product["addOns"];
};

export function AddOnGallery({ addOns }: Props) {
  const [activeAddOnIndex, setActiveAddOnIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    setActiveImageIndex(0);
  };

  const showPrevious = () => {
    if (!gallery.length) return;
    setActiveImageIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    if (!gallery.length) return;
    setActiveImageIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1,
    );
  };

  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <>
      <div role="list" className="flex flex-wrap gap-2 px-4">
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
                className="w-30 h-30 md:w-47 md:h-47 object-contain bg-white"
              />
            </button>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center leading-snug">
              {addon.name}
            </span>
          </div>
        ))}
      </div>

      {activeAddOn && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-white">
            <button
              type="button"
              onClick={closeViewer}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/80 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Close
            </button>

            <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-4">
              <div className="relative flex w-full items-center justify-center">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-2xl font-bold shadow-md"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 19.5L8.25 12L15.75 4.5"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <img
                  src={gallery[activeImageIndex]}
                  alt={`${activeAddOn.name} preview ${activeImageIndex + 1}`}
                  className="max-h-[78vh] w-auto max-w-full object-contain"
                />

                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-2xl font-bold shadow-md"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 19.5L15.75 12L8.25 4.5"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
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
