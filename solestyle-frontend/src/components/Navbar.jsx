import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Sale', to: '/sale' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { wishlistIds } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const wishlistCount = wishlistIds.size;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 py-2 text-center text-sm font-medium text-white">
        Free shipping on orders over ৳5000 | Use code{" "}
        <span className="font-bold">STRIDE20</span> for 20% off your first order
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-gray-900">Stride</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex shrink-0 items-center gap-5">
          <Link to="/shop" aria-label="Search" className="text-gray-700 hover:text-primary-600 transition-colors">
            <Search size={20} />
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative text-gray-700 hover:text-primary-600 transition-colors"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-gray-700 hover:text-primary-600 transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.isStaff && (
                <Link
                  to="/admin"
                  className="text-xs font-bold bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm font-semibold text-gray-800">{user.username}</span>
              <button
                onClick={logout}
                className="text-xs text-gray-500 hover:text-primary-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" aria-label="Login" className="text-gray-700 hover:text-primary-600 transition-colors">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="flex lg:hidden items-center gap-6 overflow-x-auto border-t border-gray-100 px-4 py-2.5">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `shrink-0 text-sm font-medium transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-600'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      </header>
    </>
  );
};

export default Navbar;