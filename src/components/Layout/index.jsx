import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import StatsPanel from '../StatsPanel';

const Layout = () => {
  const location = useLocation();
  const showStats = location.pathname !== '/'; // 不在首頁時顯示統計

  return (
    <div>
      <Header />
      {showStats && (
        <div className="max-w-6xl mx-auto px-4 py-2">
          <StatsPanel />
        </div>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
