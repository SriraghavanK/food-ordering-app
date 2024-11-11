import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaClock, FaUtensils } from "react-icons/fa"; // Import icons

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(
        "https://food-ordering-app-vee4.onrender.com/api/restaurants"
      );
      const restaurantsWithMenuItems = await Promise.all(
        response.data.map(async (restaurant) => {
          const menuResponse = await axios.get(
            `https://food-ordering-app-vee4.onrender.com/api/restaurants/${restaurant._id}/menu`
          );
          return { ...restaurant, menuItems: menuResponse.data };
        })
      );
      setRestaurants(restaurantsWithMenuItems);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to fetch restaurants. Please try again later.");
      setIsLoading(false);
    }
  };

  const calculateAverageRating = (menuItems) => {
    if (!menuItems || menuItems.length === 0) return 0;
    const totalRating = menuItems.reduce(
      (acc, item) => acc + (item.averageRating || 0),
      0
    );
    const averageRating = totalRating / menuItems.length;
    return Number(averageRating.toFixed(1));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Explore Restaurants
      </h1>

      {restaurants.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          No restaurants available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => {
            const averageRating = calculateAverageRating(restaurant.menuItems);

            return (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="block"
              >
                <motion.div
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={
                        restaurant.image ||
                        "/placeholder.svg?height=300&width=400"
                      }
                      alt={restaurant.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=400";
                        e.target.alt = "Restaurant image placeholder";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {restaurant.name}
                    </h2>
                    <div className="flex items-center mb-2">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold mr-2">
                        {averageRating > 0 ? averageRating : "N/A"}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({restaurant.menuItems.length} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaUtensils className="mr-2" style={{ color: "grey" }} />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaClock className="mr-2" style={{ color: "black" }} />
                      <span>{restaurant.deliveryTime || "25-30 mins"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt
                        className="mr-2"
                        style={{ color: "red" }}
                      />
                      <span className="truncate">{restaurant.location}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
