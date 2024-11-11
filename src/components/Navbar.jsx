import React, { useState, useEffect } from 'react';
import logo from '../logo.png';
import { Link , useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, Menu as MenuIcon, X, Moon, Home, Utensils, Shield , LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isLateNight, setIsLateNight] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLateNightHours = () => {
      const currentHour = new Date().getHours();
      setIsLateNight(currentHour >= 22 || currentHour < 6);
    };

    checkLateNightHours();
    const interval = setInterval(checkLateNightHours, 1000); 

    return () => clearInterval(interval);
  }, []);

  const linkClass = "flex items-center text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group relative";
  const underlineClass = "absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left";
  const mobileLinkClass = "flex items-center text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 group";
  const mobileUnderlineClass = "absolute left-0 bottom-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left";
  const isRestaurantDashboard = location.pathname.startsWith('/restaurant-dashboard');

 
  if (isRestaurantDashboard) {
    return (
      <nav className="bg-white shadow-lg font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex-shrink-0">
              <motion.img
                className="h-10 rounded w-auto"
                src="/logo.png"
                alt="Company Logo"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <button
              onClick={logout}
              className="flex items-center text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <LogOut className="mr-2" size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <motion.img
                className="h-10 rounded w-auto"
                src={logo}
                alt="Company Logo"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={linkClass}>
                  <Home className="mr-2" size={20} />
                  Home
                  <span className={underlineClass}></span>
                </Link>
                <Link to="/restaurants" className={linkClass}>
                  <Utensils className="mr-2" size={20} />
                  Restaurants
                  <span className={underlineClass}></span>
                </Link>
                {isLateNight && (
                  <Link to="/late-night" className={linkClass}>
                    <Moon className="mr-2" size={20} />
                    Late Night
                    <span className={underlineClass}></span>
                  </Link>
                )}
                {user && user.isAdmin && (
                  <Link to="/admin" className={linkClass}>
                    <Shield className="mr-2" size={20} />
                    Admin Panel
                    <span className={underlineClass}></span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/cart" className={linkClass}>
                <ShoppingCart className="mr-2" size={20} />
                Cart
                <span className={underlineClass}></span>
              </Link>

              {user ? (
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <Link to="/profile" className={linkClass}>
                      <UserIcon className="mr-2" size={20} />
                      Profile
                      <span className={underlineClass}></span>
                    </Link>
                    <button
                      onClick={logout}
                      className="ml-2 relative text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center ml-2 relative text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <UserIcon className="mr-2" size={20} />
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className={`md:hidden overflow-hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        id="mobile-menu"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={mobileLinkClass}>
            <span className="relative">
              <Home className="mr-2 inline" size={20} />
              Home
              <span className={`${mobileUnderlineClass} w-full`}></span>
            </span>
          </Link>
          <Link to="/restaurants" className={mobileLinkClass}>
            <span className="relative">
              <Utensils className="mr-2 inline" size={20} />
              Restaurants
              <span className={`${mobileUnderlineClass} w-full`}></span>
            </span>
          </Link>
          <Link to="/cart" className={mobileLinkClass}>
            <span className="relative">
              <ShoppingCart className="mr-2 inline" size={20} />
              Cart
              <span className={`${mobileUnderlineClass} w-full`}></span>
            </span>
          </Link>
          {isLateNight && (
            <Link to="/late-night" className={mobileLinkClass}>
              <span className="relative">
                <Moon className="mr-2 inline" size={20} />
                Late Night
                <span className={`${mobileUnderlineClass} w-full`}></span>
              </span>
            </Link>
          )}
          {user && user.isAdmin && (
            <Link to="/admin" className={mobileLinkClass}>
              <span className="relative">
                <Shield className="mr-2 inline" size={20} />
                Admin Panel
                <span className={`${mobileUnderlineClass} w-full`}></span>
              </span>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className={mobileLinkClass}>
                <span className="relative">
                  <UserIcon className="mr-2 inline" size={20} />
                  Profile
                  <span className={`${mobileUnderlineClass} w-full`}></span>
                </span>
              </Link>
              <button onClick={logout} className={`${mobileLinkClass} w-full text-left`}>
                <span className="relative">
                  <X className="mr-2 inline" size={20} />
                  Logout
                  <span className={`${mobileUnderlineClass} w-full`}></span>
                </span>
              </button>
            </>
          ) : (
            <Link to="/login" className={`${mobileLinkClass} text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}>
              <span className="relative">
                <UserIcon className="mr-2 inline" size={20} />
                Login
                <span className={`${mobileUnderlineClass} w-full bg-current`}></span>
              </span>
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;