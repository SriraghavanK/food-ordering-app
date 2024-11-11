import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  AlertCircle,
  Pizza,
  Utensils,
  Coffee,
  User,
  MapPin,
  Phone,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [error, setError] = useState("");
  const [isRestaurant, setIsRestaurant] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = isRestaurant
        ? { name, email, password, location, phone, cuisine, location }
        : { name, email, password, location, phone };

      await register(userData, isRestaurant);

      if (isRestaurant) {
        navigate("/restaurant-pending");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error registering. Please try again.");
    }
  };

  const foodIcons = [Pizza, Utensils, Coffee];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative"
      >
        {foodIcons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 * index,
              duration: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
            className={`absolute ${
              index === 0
                ? "top-0 left-0 -translate-x-1/2 -translate-y-1/2"
                : index === 1
                ? "bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
                : "top-0 right-0 translate-x-1/2 -translate-y-1/2"
            }`}
          >
            <Icon className="text-white w-16 h-16 sm:w-20 sm:h-20" />
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0.9, rotateY: -15 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
              Create your account
            </h2>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setIsRestaurant(false)}
                className={`px-4 py-2 rounded-l-lg transition-all duration-300 ease-in-out transform ${
                  !isRestaurant
                    ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:scale-105"
                    : "bg-gray-200 text-gray-700 shadow-md hover:bg-gray-300 hover:scale-105"
                }`}
              >
                User
              </button>
              <button
                onClick={() => setIsRestaurant(true)}
                className={`px-4 py-2 rounded-r-lg transition-all duration-300 ease-in-out transform ${
                  isRestaurant
                    ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:scale-105"
                    : "bg-gray-200 text-gray-700 shadow-md hover:bg-gray-300 hover:scale-105"
                }`}
              >
                Restaurant
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 block"
                >
                  {isRestaurant ? "Restaurant Name" : "Name"}
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    placeholder={
                      isRestaurant ? "Enter restaurant name" : "Enter your name"
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email-address"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Email address
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="relative"
                >
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Password
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="relative"
                >
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Location
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="relative"
                >
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    placeholder={
                      isRestaurant ? "Restaurant location" : "Your location"
                    }
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                 <Navigation
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Phone
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="relative"
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </motion.div>
              </div>
              {isRestaurant && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="cuisine"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Cuisine Type
                    </label>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="relative"
                    >
                      <input
                        id="cuisine"
                        name="cuisine"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                        placeholder="Enter cuisine type"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                      />
                      <Utensils
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </motion.div>
                  </div>
                </>
              )}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Register
              </motion.button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 text-center"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <motion.button
                onClick={() => navigate("/login")}
                className="text-orange-600 hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}