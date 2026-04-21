import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/catalog', label: 'Catalog' },
  { path: '/research', label: 'Research' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="bg-surface/90 backdrop-blur-[20px] sticky top-0 z-50 transition-all duration-300 border-b border-outline-variant/15">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight">
            Maulana Azad Library
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-headline tracking-tight transition-all duration-300 px-1 pb-1 ${
                  location.pathname === link.path
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant font-medium hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search (desktop) */}
          <div className="hidden lg:flex items-center bg-surface-container-highest rounded-full px-4 py-2 hover:bg-surface-container-high transition-all duration-300">
            <input
              className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant text-sm w-48 font-body"
              placeholder="Search catalog..."
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/catalog?q=${e.target.value}`);
                  e.target.value = '';
                }
              }}
            />
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">search</span>
          </div>

          {/* Login / Dashboard links */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link
                to="/login"
                className="bg-primary text-on-primary hover:bg-primary-container font-body text-sm font-semibold py-2 px-6 rounded-full transition-all duration-300"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  to={`/${user.role}`}
                  className="text-primary hover:bg-surface-container-high transition-all duration-300 px-4 py-2 rounded-full font-medium text-sm font-body border border-primary/30"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-on-surface-variant hover:text-error transition-all duration-300 px-3 py-2 rounded-full font-medium text-sm font-body flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/15 px-8 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 font-headline ${
                location.pathname === link.path
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-[1px] w-full bg-outline-variant/15 my-2"></div>
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-body font-semibold text-primary"
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link
                to={`/${user.role}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-body text-primary font-semibold"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 font-body text-error font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
