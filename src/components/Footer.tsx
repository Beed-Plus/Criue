import { Link } from "react-router-dom";
import { InstagramIcon, FacebookIcon, TiktokIcon, TwitterIcon } from "./icons";

const Footer = () => {
  return (
    <footer className="bg-black text-white flex flex-col items-center justify-between h-[272px] pt-12 pb-2">
      <div className="text-center space-y-1">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold">Contact Us</h3>
        <Link to="mailto:contact@cruie.com">
          <p className="font-normal underline text-sm sm:text-base md:text-lg lg:text-2xl">contact@criue.com</p>
        </Link>
        <div className="flex justify-between w-[136px] mx-auto mt-6 items-center">
          <Link
            to="https://www.instagram.com/beedplus?igsh=MW5maG1zcHJxejd1Yg=="
            target="_blank"  rel="noopener noreferrer"
          >
            <InstagramIcon />
          </Link>
          <Link to="#"  rel="noopener noreferrer">
            <FacebookIcon />
          </Link>
          <Link to="https://www.tiktok.com/@beedplus?_r=1&_t=ZS-97yx5etLJXs" >
            <TiktokIcon />
          </Link>
          <Link to="#"   rel="noopener noreferrer">
            <TwitterIcon />
          </Link>
        </div>
      </div>

      <div className="text-center text-xs">
        <p className="">© 2026 CRIUE NETWORK LIMITED.</p>
        <p className="">ALL RIGHT RESERVED.</p>
      </div>
    </footer>
  );
};

export { Footer };
