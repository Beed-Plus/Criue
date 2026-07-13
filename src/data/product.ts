import beedPlusImage from "../assets/images/beed_plus1.png";
import influenceIslandImage from "../assets/images/influence_island1.png";
import novalAwardsImage from "../assets/images/noval_awards1.png";
import oneDeskImage from "../assets/images/one_desk2.png";
import oneScreenImage from "../assets/images/one_screen2.png";

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
