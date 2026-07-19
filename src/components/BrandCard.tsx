import { Link } from "react-router-dom";
import { Brand } from "../data/product";

const BrandCard = ({ brand }: { brand: Brand }) => {
  return (
    <div className="flex flex-col items-center md:max-w-[390px]">
      <div className="">
        <img src={brand.image} alt={brand.linkText} />
      </div>
      <Link to={brand.link}>
        <p className="rounded-[18px] p-1.5 px-6 shadow-[0_4px_28px_rgb(0,0,0,0.1)] min-w-9.5 text-base font-medium mt-6">
          {brand.linkText}
        </p>
      </Link>
    </div>
  );
};

export { BrandCard };
