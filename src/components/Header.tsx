import { CriueLogo, ShoppingBagIcon } from "./icons";

const Header = () => {
  return (
    <header className="flex px-6 justify-between items-center bg-black py-3">
      <div className="text-white flex items-center gap-2.5 ">
        <div className="h-10 w-5 flex items-center">
          <img src="/src/assets/images/logo.png" />
        </div>

        <h2 className="uppercase font-bold text-base lg:text-lg">Criue</h2>
      </div>
      <ShoppingBagIcon />
    </header>
  );
};

export { Header };
