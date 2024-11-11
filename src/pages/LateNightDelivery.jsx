import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Clock, Moon, Search, Star, MapPin, Coffee } from "lucide-react";

export default function Component() {
  const [lateNightRestaurants, setLateNightRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLateNightRestaurants();
  }, []);

  const fetchLateNightRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      const lateNightOptions = response.data.filter(
        (restaurant) => restaurant.isLateNight
      );
      setLateNightRestaurants(lateNightOptions);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching late-night restaurants:", err);
      setError("Failed to fetch restaurants. Please try again later.");
      setIsLoading(false);
    }
  };

  const filteredRestaurants = lateNightRestaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen "
      >
        <div className="text-orange-600 text-2xl">
          <Moon className="animate-pulse inline-block mr-2" size={32} />
          Loading late-night options...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen "
        style={{ backgroundColor: "#FFF8F2" }}
      >
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br  text-orange-800 py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFF8F2" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-2 text-orange-600"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Late Night Cravings?
        </motion.h1>
        <motion.p
          className="text-2xl text-orange-500 text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Satisfy your midnight munchies with these delicious options!
        </motion.p>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for late-night food..."
              className="w-full px-4 py-3 rounded-full bg-white bg-opacity-20 focus:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-800 placeholder-orange-400 transition duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-3 text-orange-400"
              size={20}
            />
          </div>
        </div>

        <AnimatePresence>
          {filteredRestaurants.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-xl text-orange-500"
            >
              No late-night restaurants available at the moment.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {filteredRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  className="bg-white bg-opacity-70 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-orange-700">
                      {restaurant.name}
                    </h2>
                    <p className="text-orange-600 mb-4">{restaurant.cuisine}</p>
                    <div className="flex items-center mb-4">
                      <Clock className="text-orange-500 mr-2" size={20} />
                      <span className="text-sm">Open Late</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <MapPin className="text-orange-500 mr-2" size={20} />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center mb-6">
                      <Star className="text-orange-500 mr-2" size={20} />
                      <span className="text-sm">
                        {(Math.random() * (5 - 3.5) + 3.5).toFixed(1)} Stars
                      </span>
                    </div>
                    <Link
                      to={`/restaurants/${restaurant._id}`}
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-center"
                    >
                      Order Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-orange-600 mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            to="/restaurants"
            className="inline-block bg-white text-orange-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-orange-100 hover:text-orange-700"
          >
            <Coffee className="inline-block mr-2" size={20} />
            View All Restaurants
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
