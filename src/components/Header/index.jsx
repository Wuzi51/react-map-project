import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* logo */}
      <div className="flex justify-center" onClick={() => changePage('/')}>
        <div className="hover:cursor-pointer select-none">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent flex items-center gap-2">
            <img src="/ramen-detailed.svg" alt="拉麵" className="w-8 h-8 md:w-10 md:h-10" />
            拉麵地圖
          </h1>
        </div>
      </div>

      {/* 漢堡選單 */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-12 h-12 border rounded group"
        >
          <span
            className={`block h-1 w-8 rounded bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45' : 'mb-1'}`}
          ></span>
          <span
            className={`block h-1 w-8 rounded bg-black transition-all duration-300 ${isMenuOpen ? 'hidden' : 'mb-1'}`}
          ></span>
          <span
            className={`block h-1 w-8 rounded bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 absolute' : ''}`}
          ></span>
        </button>
      </div>

      {/* mobile */}
      {isMenuOpen && (
        <nav className="absolute top-20 right-0 w-8/12 h-full bg-white shadow-lg p-4 z-10 md:hidden">
          <ul className="text-xl">
            <li className="text-gray-700 mb-3 border-b border-solid border-gray-700 p-2" onClick={() => changePage('/')}>
              首頁
            </li>
            <li className="text-gray-700 mb-3 border-b border-solid border-gray-700 p-2" onClick={() => changePage('/favorite')}>
              我的收藏
            </li>
            <li className="text-gray-700 mb-3 border-b border-solid border-gray-700 p-2" onClick={() => changePage('/review')}>
              我的食記
            </li>
          </ul>
        </nav>
      )}

      {/*desktop*/}
      <nav className="hidden md:flex">
        <ul className="flex text-lg items-center">
          <li className="mx-5 text-gray-700 hover:cursor-pointer hover:text-neutral-500" onClick={() => changePage('/')}>
            首頁
          </li>
          <li className="mx-5 text-gray-700 hover:cursor-pointer hover:text-neutral-500" onClick={() => changePage('/favorite')}>
            我的收藏
          </li>
          <li className="mx-5 text-gray-700 hover:cursor-pointer hover:text-neutral-500" onClick={() => changePage('/review')}>
            我的食記
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
