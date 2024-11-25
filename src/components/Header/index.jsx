import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 漢堡選單開關
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 導航功能
  const changePage = (url) => {
    navigate(url);
    setIsMenuOpen(false); // 點擊後關閉選單
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 shadow-md">
      
      {/* logo */}
      <div className="flex justify-center" onClick={() => changePage("/")}>
        <img
          className="w-[8rem] md:w-[15rem] hover:cursor-pointer"
          src="/src/images/vote-eat-high-resolution-logo-grayscale-transparent.png"
          alt="logo"
        />
      </div>

      {/* 漢堡選單 */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-12 h-12 border rounded group"
        >
          <span
            className={`block h-1 w-8 rounded bg-black transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : "mb-1"
            }`}
          ></span>
          <span
            className={`block h-1 w-8 rounded bg-black transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* mobile */}
      {isMenuOpen && (
        <nav className="absolute top-20 right-0 w-full h-full bg-white shadow-lg p-4 z-10 md:hidden">
          <ul className="text-xl">
            <li className="text-gray-700 mb-3 border-b border-solid  border-gray-700 p-2">登入</li>
            <li className="text-gray-700 mb-3 border-b border-solid  border-gray-700 p-2">候選清單</li>
          </ul>
        </nav>
      )}

      {/*desktop*/}
      <nav className="hidden md:flex space-x-4">
        <ul className="flex text-lg">
          <li className="mx-5 text-gray-700 hover:cursor-pointer hover:text-neutral-500">候選清單</li>
          <li className="mx-2 text-gray-700 hover:cursor-pointer hover:text-neutral-500">登入</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
