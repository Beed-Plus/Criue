import beedPlusImage from "../assets/images/beed_plus1.png";
import influenceIslandImage from "../assets/images/influence_island1.png";
import novalAwardsImage from "../assets/images/noval_awards1.png";
import oneDeskImage from "../assets/images/one_desk1.png";
import oneScreenImage from "../assets/images/one_screen1.png";

export interface Product {
  name: string;
  desc: string;
  price: number;
  image: string;
}
export interface Brand {
  linkText: string;
  link: string;
  image: string;
}

export const PRODUCT = {
  name: "One Screen",
  brand: "Criue",
  tagline: "The ultimate fluid workspace.",
  // Price is stored in the smallest currency unit's major form (e.g. dollars/naira), not kobo/cents.
  // Paystack requires amount in the smallest unit (kobo for NGN, cents for USD) — conversion happens at checkout.
  price: 1299,
  currency: "NGN", // ISO currency code used for Paystack charges. Change to "USD", "GHS", "ZAR" etc. as needed.
  monthlyEstimate: 108.25,
  taxRate: 0.075,

  colorways: [
    { id: "lunar", name: "Lunar White", hex: "#f1f1ee" },
    { id: "graphite", name: "Graphite Black", hex: "#2b2b2d" },
    { id: "dune", name: "Dune Tan", hex: "#cdb48c" },
  ],

  heroSlides: [
    { id: "desktop", scene: "aurora", label: "ONE SCREEN", mode: "standard" },
    { id: "portrait", scene: "studio", label: "PORTRAIT", mode: "portrait" },
    { id: "tabletop", scene: "dark", label: "TABLETOP", mode: "flat" },
  ],

  productSlides: [
    { id: "desktop", scene: "aurora", label: "DESKTOP MODE", mode: "standard" },
    { id: "tabletop", scene: "dark", label: "TABLETOP MODE", mode: "flat" },
    {
      id: "portrait",
      scene: "studio",
      label: "PORTRAIT MODE",
      mode: "portrait",
    },
    { id: "room", scene: "room", label: "IN YOUR SPACE", mode: "standard" },
  ],

  features: [
    {
      label: "The infinite stand",
      title: "Stands wherever you stand.",
      body: "A chrome white base offers pinpoint stability while maintaining a near-invisible footprint. Adjust height and tilt with a single finger touch — no tools, no friction, no limits.",
      scene: "couch",
      mode: "standard",
    },
    {
      label: "Tabletop mode",
      title: "Detach. Set down. Begin.",
      body: "Lift the panel from its stand and use the integrated ergonomic kickstand for an instant tabletop touch experience — perfect for collaborative sessions and quick reviews.",
      scene: "tabletop",
      mode: "flat",
      reverse: true,
    },
    {
      label: "Portrait precision",
      title: "Rotate. Read. Refocus.",
      body: "Rotates 90 degrees for a vertical canvas, ideal for coding, reading, or social feeds. The IMU intelligently adapts instantly to your new perspective.",
      scene: "couch",
      mode: "portrait",
    },
  ],

  connectPoints: [
    {
      title: "Magnetic assembly",
      body: "Proprietary magnetic docking secures a confident lock without the need for tools. Snap it into place and you're ready to go.",
    },
    {
      title: "Instant mobility",
      body: "An integrated handle and lightweight aerospace-grade materials make it effortless to move your entire workspace to any room.",
    },
  ],

  specs: [
    {
      title: '27" 4K OLED',
      body: "True blacks with 100% DCI-P3 color gamut and 1600 nits peak brightness.",
    },
    {
      title: "Aerospace grade",
      body: "Precision milled aluminum chassis with a premium acoustic fabric backing.",
    },
    {
      title: "9-hour battery",
      body: "Internal high-density cell for cordless performance across your home.",
    },
    {
      title: "Universal hub",
      body: "Wi-Fi 6E, Bluetooth 5.4 and a single USB-C port for charging and data.",
    },
    {
      title: "Criue Spatial",
      body: "Dual speaker array integrated behind the fabric panel for immersive 360 audio.",
    },
    {
      title: "Criue OS 2.0",
      body: "Seamless ecosystem integration with custom productivity widgets.",
    },
  ],

  overview: [
    {
      title: "Display",
      body: '27" 4K OLED, touch-enabled, 1600 nits peak brightness.',
    },
    {
      title: "Mobility",
      body: "Magnetic detach, 9-hour battery, sub-12lb panel weight.",
    },
    {
      title: "Modes",
      body: "Desktop, tabletop, and portrait — switch in one motion.",
    },
    {
      title: "Connectivity",
      body: "Wi-Fi 6E, Bluetooth 5.4, single USB-C for power and data.",
    },
  ],

  description:
    "One Screen began with a simple question: why should your workspace stay still when you don't? Every material, hinge, and ounce of weight was reconsidered to create a 27-inch display that detaches, rotates, and resettles in seconds — so the canvas adapts to you, not the other way around. From a quiet morning of reading in portrait, to a full afternoon of layered creative work on the desktop stand, to an evening of collaborative sketching in tabletop mode, One Screen carries the same fluid intelligence everywhere it goes.",

  fullSpecs: [
    {
      label: "Display",
      value:
        "27-inch 4K OLED (3840 × 2160), 10-point capacitive touch, 1600 nits peak brightness, 100% DCI-P3",
    },
    {
      label: "Chassis",
      value:
        "Precision-milled aerospace-grade aluminum with woven acoustic fabric rear panel",
    },
    {
      label: "Stand",
      value:
        "The Infinite Stand — tool-free height and tilt adjustment, magnetic quick-release docking",
    },
    {
      label: "Modes",
      value:
        "Desktop (stand), tabletop (kickstand), portrait (90° rotation with auto IMU detection)",
    },
    {
      label: "Battery",
      value: "Up to 9 hours cordless use, fast charge to 80% in 45 minutes",
    },
    {
      label: "Audio",
      value:
        "Criue Spatial — dual 15W speaker array, 360° immersive sound, dual far-field microphones",
    },
    {
      label: "Connectivity",
      value:
        "Wi-Fi 6E, Bluetooth 5.4, single USB-C 3.2 (100W power delivery + 10Gbps data)",
    },
    {
      label: "Software",
      value:
        "Criue OS 2.0 with cross-device handoff, custom productivity widgets, and gesture controls",
    },
    {
      label: "Dimensions",
      value:
        'Panel: 24.1" × 14.2" × 0.4" — Base: 9.8" diameter — Weight: 11.6 lb panel / 18.3 lb total',
    },
    {
      label: "In the box",
      value:
        "One Screen display, Infinite Stand, USB-C cable, 100W power adapter, quick start guide",
    },
    {
      label: "Warranty",
      value:
        "1-year limited hardware warranty, extendable to 3 years with CriueCare",
    },
  ],
};

export function formatPrice(amount: number, currency = "NGN") {
  const symbols = { NGN: "₦", USD: "$", GHS: "GH₵", ZAR: "R", KES: "KSh" };
  const symbol = symbols[currency as keyof typeof symbols] || currency + " ";
  return (
    symbol +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export const PRODUCTS: Product[] = [
  {
    name: "OneScreen",
    desc: "Detachable Smart Portable TV",
    price: 1499999,
    image: oneScreenImage,
  },
  {
    name: "OneDesk",
    desc: "All-in-one Curved Screen PC",
    price: 1599999,
    image: oneDeskImage,
  },
];

export const BRANDS: Brand[] = [
  {
    image: beedPlusImage,
    linkText: "Beedplus.com",
    link: "https://beedplus.com",
  },
  {
    image: novalAwardsImage,
    linkText: "Novalawards.com",
    link: "https://novalawards.com",
  },
  {
    image: influenceIslandImage,
    linkText: "Influenceisland.com",
    link: "https://influenceisland.com",
  },
];
