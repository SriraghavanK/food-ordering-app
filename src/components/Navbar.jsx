import React, { useState, useEffect } from 'react';
import logo from '../logo.jpg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, Menu as MenuIcon, X, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isLateNight, setIsLateNight] = useState(false);

  useEffect(() => {
    const checkLateNightHours = () => {
      const currentHour = new Date().getHours();
      setIsLateNight(currentHour >= 22 || currentHour < 6);
    };

    checkLateNightHours();
    const interval = setInterval(checkLateNightHours, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const linkClass = "relative text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group";

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
                {/* Home Link */}
                <Link to="/" className={linkClass}>
                  Home
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>

                {/* Restaurants Link */}
                <Link to="/restaurants" className={linkClass}>
                  Restaurants
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>

                {/* Late Night Link */}
                {isLateNight && (
                  <Link to="/late-night" className={linkClass}>
                    <Moon className="inline-block mr-1" size={16} />
                    Late Night
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                )}

                {/* Admin Panel Link */}
                {user && user.isAdmin && (
                  <Link to="/admin" className={linkClass}>
                    Admin Panel
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <motion.div whileHover="hover">
                <motion.div variants={{ hover: { scale: 1.1, transition: { duration: 0.2 } } }}>
                  <Link to="/cart" className="text-gray-700 hover:text-orange-500 p-2 px-10 rounded-full transition-colors duration-200">
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                </motion.div>
              </motion.div>

              {user ? (
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <motion.div whileHover="hover">
                      <motion.div variants={{ hover: { scale: 1.1, transition: { duration: 0.2 } } }}>
                        <Link to="/profile" className="text-gray-700 hover:text-orange-500 p-2 px-12 rounded-full transition-colors duration-200">
                          <UserIcon className="h-6 w-6" />
                        </Link>
                      </motion.div>
                    </motion.div>
                    <button
  onClick={logout}
  className="relative text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
>
  Logout
</button>


                  </div>
                </div>
              ) : (
                <Link
  to="/login"
  className="relative text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
>
  Login
</Link>

              )}
            </div>
          </div>

          {/* Mobile menu button */}
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
        className="md:hidden"
        id="mobile-menu"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={linkClass}>
            Home
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/restaurants" className={linkClass}>
            Restaurants
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/cart" className={linkClass}>
            Cart
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/late-night" className={linkClass}>
            Late Night
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          {user && user.isAdmin && (
            <Link to="/admin" className={linkClass}>
              Admin Panel
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className={linkClass}>
                Profile
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
              <button onClick={logout} className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="relative text-orange-500 border border-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
