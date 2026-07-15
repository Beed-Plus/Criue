// src/data/products.js
//
// Replace image string paths with your actual imports once you add image assets.
// e.g.:  import oneScreenImg from '../assets/one-screen.jpg'
//        then set  images: [oneScreenImg, ...]

// ─── Types (JSDoc for IDE support without TypeScript) ───────────────────
/**
 * @typedef {Object} AddOn
 * @property {string}   name        - Display name
 * @property {string}   image       - Image URL / import
 * @property {number}   [price]     - Optional separate price in kobo-major (Naira)
 * @property {string}   [desc]      - Short description shown on chip
 * @property {string}   [bumpaUrl]  - Direct Bumpa add-on product URL
 */

/**
 * @typedef {Object} SpecFeature
 * @property {string} name   - Left column label
 * @property {string} value  - Right column content (supports multi-line with \n)
 */

/**
 * @typedef {Object} SpecGroup
 * @property {string}          type      - Group heading shown in accordion
 * @property {SpecFeature[]}   features  - Rows inside the accordion
 * @property {boolean}         [defaultOpen] - Accordion open by default
 */

/**
 * @typedef {Object} Product
 * @property {string}      id          - URL-safe slug  e.g. "one-screen"
 * @property {string}      name        - Display name   e.g. "OneScreen"
 * @property {string}      desc        - One-line tagline
 * @property {number}      price       - Price in Naira (full, not kobo)
 * @property {string[]}    images      - Carousel image array (1+ items)
 * @property {string}      [bumpaUrl]  - Full Bumpa product page URL
 * @property {AddOn[]}     [addOns]    - Optional accessories shown below price
 * @property {SpecGroup[]} specs       - Accordion spec groups
 */

// ─── Price formatter ────────────────────────────────────────────────────
/** @param {number} naira */
export function formatNaira(naira) {
  return "₦" + naira.toLocaleString("en-NG");
}

// ─── Products ────────────────────────────────────────────────────────────
/** @type {Product[]} */
export const PRODUCTS = [
  // ── ONE SCREEN ──────────────────────────────────────────────────────
  {
    id: "one-screen",
    name: "OneScreen",
    desc: "Detachable Smart Portable TV",
    price: 1499999,
    images: [
      // Replace with real image imports / URLs:
      // oneScreenHero,
      // oneScreenTabletop,
      // oneScreenPortrait,
    ],
    bumpaUrl: "https://criue.bumpa.shop/products/one-screen", // ← update when live
    addOns: [
      {
        name: "Remote",
        image: "",          // replace with real image
        price: 15000,
        desc: "OneScreen wireless remote",
        bumpaUrl: "https://criue.bumpa.shop/products/one-remote",
      },
      {
        name: "Mouse Tracker",
        image: "",
        price: 25000,
        desc: "Magnetic precision tracker",
        bumpaUrl: "https://criue.bumpa.shop/products/mouse-tracker",
      },
    ],
    specs: [
      {
        type: "Product Specification",
        defaultOpen: true,
        features: [
          { name: "System",       value: "CPU - MTK8788" },
          { name: "OS",           value: "Android 11" },
          { name: "RAM",          value: "4 GB LPDDR4X" },
          { name: "Storage",      value: "64 GB eMMC 5.1" },
          { name: "Display",      value: '27" 4K OLED (3840 × 2160)\n10-point capacitive touch\n1600 nits peak brightness, 100% DCI-P3' },
          { name: "Battery",      value: "10,000 mAh — up to 9 hrs cordless\nFast charge 65 W (0–80% in 45 min)" },
          { name: "Modes",        value: "Desktop (stand) · Tabletop (kickstand)\nPortrait — auto IMU detection" },
        ],
      },
      {
        type: "Network",
        features: [
          { name: "Wi-Fi",        value: "Wi-Fi 6E (802.11ax), 2.4 / 5 / 6 GHz" },
          { name: "Bluetooth",    value: "Bluetooth 5.4" },
          { name: "USB",          value: "1× USB-C 3.2 Gen 2 (100 W PD + 10 Gbps)" },
        ],
      },
      {
        type: "Audio",
        features: [
          { name: "Speakers",     value: "Criue Spatial — dual 15 W, 360° sound" },
          { name: "Microphone",   value: "Dual far-field mic array" },
          { name: "Headphone",    value: "3.5 mm combo jack" },
        ],
      },
      {
        type: "Stand",
        features: [
          { name: "Type",         value: "The Infinite Stand" },
          { name: "Adjustment",   value: "Tool-free height & tilt, magnetic quick-release dock" },
          { name: "Material",     value: "Aerospace-grade aluminium + chrome white base" },
        ],
      },
      {
        type: "Other",
        features: [
          { name: "Weight",       value: "Panel: 5.3 kg · Full assembly: 8.3 kg" },
          { name: "Dimensions",   value: "Panel: 612 × 362 × 10 mm" },
          { name: "Colors",       value: "Lunar White · Graphite Black · Dune Tan" },
          { name: "In the box",   value: "OneScreen · Infinite Stand · USB-C cable\n100 W adapter · Quick-start guide" },
          { name: "Warranty",     value: "1-year limited hardware warranty\n+2 yrs with CriueCare" },
        ],
      },
    ],
  },

  // ── ONE DESK ────────────────────────────────────────────────────────
  {
    id: "one-desk",
    name: "OneDesk",
    desc: "All-in-one Curved Screen PC",
    price: 1599999,
    images: [
      // oneDeskHero,
      // oneDeskSide,
    ],
    bumpaUrl: "https://criue.bumpa.shop/products/one-desk",
    addOns: [
      {
        name: "Desk Hub+",
        image: "",
        price: 35000,
        desc: "4× USB-C + dual Qi2 pads",
        bumpaUrl: "https://criue.bumpa.shop/products/desk-hub",
      },
      {
        name: "Light Bar",
        image: "",
        price: 18000,
        desc: "Criue OS ambient light",
        bumpaUrl: "https://criue.bumpa.shop/products/light-bar",
      },
    ],
    specs: [
      {
        type: "Product Specification",
        defaultOpen: true,
        features: [
          { name: "Processor",    value: "13th Gen Intel® Core™ i7-13650HX\n2.60 GHz base / 4.90 GHz turbo, 14-core" },
          { name: "RAM",          value: "16 GB DDR5 5600 MHz (up to 64 GB)" },
          { name: "Storage",      value: "512 GB NVMe PCIe 4.0 SSD" },
          { name: "Display",      value: '27" QHD Curved IPS (2560 × 1440)\n165 Hz, 1 ms GTG, 99% sRGB, 400 nits' },
          { name: "GPU",          value: "Intel® Arc™ A730M 12 GB GDDR6" },
          { name: "OS",           value: "Windows 11 Home + Criue OS Hub" },
        ],
      },
      {
        type: "Connectivity",
        features: [
          { name: "Ports",        value: "4× USB-C 3.2 · 2× USB-A 3.0 · HDMI 2.1\n1× SD card · 1× 3.5 mm audio" },
          { name: "Wi-Fi",        value: "Wi-Fi 6E (802.11ax)" },
          { name: "Bluetooth",    value: "Bluetooth 5.3" },
          { name: "Wireless",     value: "Dual Qi2 surface charging (15 W each)" },
        ],
      },
      {
        type: "Stand & Build",
        features: [
          { name: "Height",       value: "Electric 65–128 cm, 4 memory presets, 45 dB" },
          { name: "Surface",      value: "180 × 80 cm bamboo-aluminium composite, matte" },
          { name: "Load",         value: "Up to 80 kg static" },
          { name: "Cable mgmt",   value: "Internal routing channels, magnetic tray" },
        ],
      },
      {
        type: "Other",
        features: [
          { name: "Weight",       value: "Desk assembly: 42 kg" },
          { name: "Colors",       value: "Midnight Black · Pearl White" },
          { name: "Compatibility", value: "Pairs wirelessly with OneScreen via Criue OS" },
          { name: "Warranty",     value: "2-year limited hardware warranty" },
        ],
      },
    ],
  },
];

/** @param {string} id @returns {Product | undefined} */
export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
