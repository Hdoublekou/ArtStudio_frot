import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logoWhite from '../assets/images/logo-white.png';
import logoBlack from '../assets/images/logo-black.png';

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // ✅ 是否是透明状态
  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 flex justify-between items-center px-6 transition-all duration-300 ${
        isHome
          ? scrolled
            ? 'bg-white shadow'
            : 'bg-transparent'
          : 'bg-white shadow'
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={isTransparent ? logoWhite : logoBlack}
          alt="leafArt Logo"
          className="h-10 w-auto"
        />
      </Link>

      {/* Right side */}
      <div className="space-x-4">
        {user ? (
          <span className={`${isTransparent ? 'text-white' : 'text-gray-600'}`}>
            ようこそ{' '}
            <Link
              to="/profile"
              className={`px-4 py-1 rounded-full transition ${
                isTransparent
                  ? 'text-white hover:text-lime-300'
                  : 'text-lime-600 hover:bg-lime-100'
              }`}
            >
              {user.name}
            </Link>
          </span>
        ) : (
          <>
            <Link
              to="/login"
              className={`text-xs px-4 py-1 rounded-full transition ${
                isTransparent
                  ? 'text-white hover:text-lime-300'
                  : 'text-gray-700 hover:bg-black hover:text-white'
              }`}
            >
              ログイン
            </Link>
<Link
  to="/register"
  className={`text-xs px-4 py-1 rounded-full transition ${
    isTransparent
      ? 'text-white hover:text-lime-300'
      : 'text-lime-600 hover:bg-lime-100'
  }`}
>
  サインアップ
</Link>

          </>
        )}
      </div>
    </nav>
  );
}
