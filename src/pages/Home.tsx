// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { BRANDS, PRODUCTS } from "../data/product";
import { ProductCard } from "../components/ProductCard";
import { BrandCard } from "../components/BrandCard";
import { ShoppingBagIcon } from "../components/icons";
import { BrandCarousel } from "../components/BrandCarousel";

export default function Home() {
  return (
    <div className=" bg-[#F5F5F7] pt-2" id="page-home">
      <BrandCarousel />

      <div className="flex flex-wrap gap-6 justify-center mt-6 px-6">
        {PRODUCTS.map((product) => {
          return <ProductCard product={product} key={product.name} />;
        })}
      </div>

      <div className="flex justify-center my-10">
        <Link
          to={"https://criue.bumpa.shop"}
          rel="noopener noreferrer"
          className="bg-[#009DFF] text-white rounded-[27px] py-2 px-6 shadow-[0_0px_24px_rgb(69,183,255,1)] min-w-9.5 text-[13px] font-bold flex items-center gap-1"
        >
          <p className="text-white">Visit our Store</p>
          <ShoppingBagIcon />
        </Link>
      </div>

      <div className="bg-white pb-10 pt-6 ">
        <h3 className="text-2xl lg:text-[32px] max-sm:max-w-[259px] mx-auto text-center font-poppins font-bold">
          Creating and Curating the Future
        </h3>

        <div className="flex flex-wrap gap-6 justify-center mt-8 px-6 mb-5">
          {BRANDS.map((brand) => {
            return <BrandCard brand={brand} key={brand.linkText} />;
          })}
        </div>
      </div>
    </div>
  );
}
