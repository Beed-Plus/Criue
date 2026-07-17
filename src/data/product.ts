import beedPlusImage from "../assets/images/beed_plus1.png";
import influenceIslandImage from "../assets/images/influence_island1.png";
import novalAwardsImage from "../assets/images/noval_awards1.png";
import oneDeskImage from "../assets/images/one_desk3.png";
import oneScreenImage from "../assets/images/one_screen3.png";
import oneScreen1 from "../assets/images/one_screen_1.png";
import oneScreen2 from "../assets/images/one_screen_2.png";
import oneScreen3 from "../assets/images/one_screen_3.png";
import oneScreen4 from "../assets/images/one_screen_4.png";
import oneScreen5 from "../assets/images/one_screen_5.png";
import oneScreen6 from "../assets/images/one_screen_6.png";
import oneScreen7 from "../assets/images/one_screen_7.png";
import oneScreen8 from "../assets/images/one_screen_8.png";
import oneScreen9 from "../assets/images/one_screen_9.png";
import oneScreen10 from "../assets/images/one_screen_10.png";
import oneScreen11 from "../assets/images/one_screen_11.png";
import oneScreen12 from "../assets/images/one_screen_12.png";
import oneScreen13 from "../assets/images/one_screen_13.png";
import oneDesk1 from "../assets/images/one_desk_1.png";
import oneDesk2 from "../assets/images/one_desk_2.png";
import oneDesk3 from "../assets/images/one_desk_3.png";
import oneDesk4 from "../assets/images/one_desk_4.png";
import oneDesk5 from "../assets/images/one_desk_5.png";
import oneDesk6 from "../assets/images/one_desk_6.png";
import oneDesk7 from "../assets/images/one_desk_7.png";
import oneDesk8 from "../assets/images/one_desk_8.png";
import oneDesk9 from "../assets/images/one_desk_9.png";
import oneDesk10 from "../assets/images/one_desk_10.png";
import oneDesk11 from "../assets/images/one_desk_11.png";
import oneDesk12 from "../assets/images/one_desk_12.png";
import remote from "../assets/images/remote.png";
import remote1 from "../assets/images/remote_1.png";
import remote2 from "../assets/images/remote_2.png";
import mouse from "../assets/images/ring_mouse.png";
import ringMouse1 from "../assets/images/ring_mouse_1.png";
import ringMouse2 from "../assets/images/ring_mouse_2.png";
import ringMouse3 from "../assets/images/ring_mouse_3.png";
import ringMouse4 from "../assets/images/ring_mouse_4.png";
import ringMouse5 from "../assets/images/ring_mouse_5.png";
import speaker from "../assets/images/speaker.png";
import speaker1 from "../assets/images/speaker_1.png";
import speaker2 from "../assets/images/speaker_2.png";
import speaker3 from "../assets/images/speaker_3.png";
import speaker4 from "../assets/images/speaker_4.png";
import speaker5 from "../assets/images/speaker_5.png";
import speaker6 from "../assets/images/speaker_6.png";
import speaker7 from "../assets/images/speaker_7.png";
import speaker8 from "../assets/images/speaker_8.png";

export interface Product {
  name: string;
  desc: string;
  price: number;
  previewImage: string;
  bumpaUrl: string;
  images: string[];
  addOns?: {
    name: string;
    image: string;
    gallery?: string[];
  }[];
  specs: {
    type: string;
    features: {
      name: string;
      values: string[];
    }[];
  }[];
}
export interface Brand {
  linkText: string;
  link: string;
  image: string;
}

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
  // ── ONE SCREEN ──────────────────────────────────────────────────────
  {
    name: "OneScreen",
    desc: "Detachable Smart Portable TV",
    price: 1499999,
    previewImage: oneScreenImage,
    images: [
      oneScreen1,
      oneScreen2,
      oneScreen3,
      oneScreen4,
      oneScreen5,
      oneScreen6,
      oneScreen7,
      oneScreen8,
      oneScreen9,
      oneScreen10,
      oneScreen11,
      oneScreen12,
      oneScreen13,
    ],
    bumpaUrl: "https://criue.bumpa.shop/products/one-screen", // ← update when live
    addOns: [
      {
        name: "Remote",
        image: remote,
        gallery: [remote1, remote2],
      },
      {
        name: "Ring Mouse",
        image: mouse,
        gallery: [ringMouse1, ringMouse2, ringMouse3, ringMouse4, ringMouse5],
      },
      {
        name: "Speaker",
        image: speaker,
        gallery: [speaker1, speaker2, speaker3, speaker4, speaker5, speaker6, speaker7, speaker8],
      },
    ],
    specs: [
      {
        type: "Product Specification",
        features: [
          {
            name: "System",
            values: [
              "CPU - MTK8788",
              "RAM - 6GB/8GB",
              "ROM - 1288GB",
              "Operating System  - Android 13",
            ],
          },
          {
            name: "Panel",
            values: [
              "Display Size - 27inch",
              "Resoltuion - 1920*1080",
              "Touch Method - PCAP touch",
              "Screen Ratio - 16:9",
            ],
          },
          {
            name: "Network",
            values: ["2.4G & 5G WiFi"],
          },
          {
            name: "Bluetooth",
            values: ["Support bluetooth 4.0"],
          },
          {
            name: "Ports",
            values: [
              "Video Port - HDMI in*",
              "USB port - USB 2.0*1",
              "Type C - Type C *1 (OTG)",
              "Audio Out - 3.5mm audio port",
              "DC - 1, connect power cord",
            ],
          },
          {
            name: "Other",
            values: [
              "DC 12v - Option power cord on the base, it for floor standing type only.",
              "Power Switch - One button on the back of",
              "Gravity Sensor - Support",
              "Speaker - 4Ω5W*2",
              "Built - in camera - 13MP",
              "Microphone - Support",
              "Adapter Input - 100-240V ~ 50/60Hz 2.0A MAX",
              "Adapter Output - +13.5V 6.0A 81.0W",
              "Internal Battery Capacity - 10000MAH (4-5hrs approx.)",
            ],
          },
        ],
      },
    ],
  },

  // ── ONE DESK ────────────────────────────────────────────────────────
  {
    name: "OneDesk",
    desc: "All-in-one Curved Screen PC",
    price: 1599999,
    previewImage: oneDeskImage,
    images: [
      oneDesk1,
      oneDesk2,
      oneDesk3,
      oneDesk4,
      oneDesk5,
      oneDesk6,
      oneDesk7,
      oneDesk8,
      oneDesk9,
      oneDesk10,
      oneDesk11,
      oneDesk12,
    ],
    bumpaUrl: "https://criue.bumpa.shop/products/one-desk",
    specs: [
      {
        type: "Product Specification",
        features: [
          {
            name: "Processor",
            values: ["13th Gen Intel® Core™ i7 13650HX 2.60 GHz"],
          },
          {
            name: "Installed RAM",
            values: ["16.0GB(15.7gb usable)"],
          },
          {
            name: "System Type",
            values: ["64bits operating system x64-based processor"],
          },
          {
            name: "SSD",
            values: ["512GB"],
          },
          {
            name: "Display Size",
            values: ["27inch Curved"],
          },
        ],
      },
      {
        type: "Windows Specification",
        features: [
          {
            name: "Edition",
            values: ["Windows 11 pro"],
          },
          {
            name: "Version",
            values: ["23H2"],
          },
        ],
      },
      {
        type: "Keyboard & Mouse Combo",
        features: [
          {
            name: "Features",
            values: [
              "Dual mode (Bluetooth +2.4G wireless",
              "Type c rechargeable keyboard and mouse",
              "ABS material ,78keys",
              "Slim and portable design",
              "Grey /silver color are available",
            ],
          },
        ],
      },
    ],
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
