import { ShoppingBagIcon } from "./icons";
import logoImage from "../assets/images/logo.png";
import smallLogoImage from "../assets/images/logoSmall.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className=" bg-black py-3">
      <div className="md:max-w-8xl mx-auto px-6 flex justify-between items-center">
        <Link to={"/"}>
          <div className="text-white flex items-center gap-1.5">
            <div className="h-[19px] w-[14px] lg:h-9 lg:w-7 flex items-center ">
              <img
                src={smallLogoImage}
                alt="Criue"
                className="h-full w-full"
              />
            </div>

            <h2 className="uppercase font-bold text-[17px] lg:text-lg">Criue</h2>
          </div>
        </Link>

        <Link
          to={"https://criue.bumpa.shop"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ShoppingBagIcon />
        </Link>
      </div>
    </header>
  );
};

export { Header };
