import { formatPrice, Product } from "../data/product";
import { ChevronRightIcon } from "./icons";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="w-full md:max-w-[390px] lg:flex-1 flex flex-col rounded-2xl shadow-[0_4px_28px_rgb(0,0,0,0.1)]">
      <div className="bg-black text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold rounded-t-2xl">{product.name}</h2>
          <p className="text-[clamp(0.875rem,4vw-0.063rem,1rem)] font-medium">
            {product.desc}
          </p>
          <p className="text-base font-semibold">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="">
          <ChevronRightIcon />
        </div>
      </div>
      <div className="bg-white min-h-[292px]  rounded-b-2xl  flex items-center justify-center bg-white">
        <div className=" max-w-[249px]">
          <img src={product.image} alt={product.name} />
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
