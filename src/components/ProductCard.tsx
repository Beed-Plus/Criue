import { formatPrice, Product } from "../data/product";
import { ChevronRightIcon } from "./icons";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="w-full md:max-w-[390px] lg:flex-1 flex flex-col rounded-2xl shadow-[0_4px_28px_rgb(0,0,0,0.1)]">
      <div className="bg-black text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold rounded-t-2xl">{product.name}</h2>
          <p className="text-sm font-normal">{product.desc}</p>
          <p className="text-base font-semibold">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="">
          <ChevronRightIcon />
        </div>
      </div>
      <div className="min-h-[292px] rounded-b-2xl  flex items-center justify-center bg-white">
        <img src={product.image} alt={product.name} className="" />
      </div>
    </div>
  );
};

export { ProductCard };
