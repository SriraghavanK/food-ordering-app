import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Star,
  ShoppingCart,
  Clock,
  X,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Menu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          axios.get(
            `https://food-ordering-app-vee4.onrender.com/api/restaurants/${restaurantId}`
          ),
          axios.get(
            `https://food-ordering-app-vee4.onrender.com/api/restaurants/${restaurantId}/menu`
          ),
        ]);
        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
        const initialQuantities = {};
        menuResponse.data.forEach((item) => {
          initialQuantities[item._id] = 0;
        });
        setQuantities(initialQuantities);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to fetch restaurant and menu items. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const handleQuantityChange = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] + change),
    }));
  };

  const addToCart = async (menuItemId) => {
    try {
      if (quantities[menuItemId] === 0) return;

      await axios.post(
        "https://food-ordering-app-vee4.onrender.com/api/cart",
        {
          menuItemId,
          quantity: quantities[menuItemId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddedToCart((prev) => ({ ...prev, [menuItemId]: true }));

      setTimeout(() => {
        setQuantities((prev) => ({ ...prev, [menuItemId]: 0 }));
        setAddedToCart((prev) => ({ ...prev, [menuItemId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  const rateMenuItem = async (menuItemId, rating) => {
    try {
      await axios.post(
        `https://food-ordering-app-vee4.onrender.com/api/menu/${menuItemId}/rate`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserRatings({ ...userRatings, [menuItemId]: rating });
      const menuResponse = await axios.get(
        `https://food-ordering-app-vee4.onrender.com/api/restaurants/${restaurantId}/menu`
      );
      setMenuItems(menuResponse.data);
    } catch (err) {
      console.error("Failed to rate menu item:", err);
      setError("Failed to rate menu item. Please try again.");
    }
  };

  const handleBackClick = () => {
    navigate("/restaurants");
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen bg-white"
      >
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12 bg-white"
      >
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleBackClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Back to Restaurants
        </button>
      </motion.div>
    );
  }

  if (!restaurant) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12 bg-white"
      >
        Restaurant not found.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 bg-white"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleBackClick}
        className="mb-4 flex items-center text-orange-500 hover:text-orange-600 transition duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Restaurants
      </motion.button>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-orange-50 rounded-lg shadow-lg p-6 mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-orange-800">
          {restaurant.name}
        </h1>
        <p className="text-xl mb-4 text-orange-600">
          {restaurant.cuisine} Cuisine
        </p>
        <div className="flex items-center space-x-4 text-sm text-orange-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>30-40 min</span>
          </div>
        </div>
      </motion.div>

      {menuItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xl text-orange-600"
        >
          No menu items available for this restaurant.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {menuItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-200 flex flex-col max-h-[600px]"
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setFullScreenImage(item.image)}
                  />
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 rounded-bl-lg">
                    {item.averageRating.toFixed(1)} ★
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-2 text-orange-800">
                    {item.name}
                  </h2>
                  <p className="text-orange-600 mb-4 text-sm line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-2xl font-bold text-orange-500">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <=
                            (userRatings[item._id] || item.averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          } cursor-pointer transition-colors duration-200`}
                          onClick={() => rateMenuItem(item._id, star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center bg-orange-100 rounded-full">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="bg-orange-200 text-orange-600 hover:bg-orange-300 p-2 rounded-full transition duration-200"
                        disabled={quantities[item._id] === 0}
                      >
                        <Minus className="w-5 h-5" />
                      </motion.button>
                      <span className="px-4 text-lg font-semibold text-orange-800">
                        {quantities[item._id]}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="bg-orange-200 text-orange-600 hover:bg-orange-300 p-2 rounded-full transition duration-200"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={
                        quantities[item._id] > 0 && !addedToCart[item._id]
                          ? { scale: 1.05 }
                          : {}
                      }
                      whileTap={
                        quantities[item._id] > 0 && !addedToCart[item._id]
                          ? { scale: 0.95 }
                          : {}
                      }
                      onClick={() => addToCart(item._id)}
                      className={`py-2 px-4 rounded-full transition duration-300 flex items-center ${
                        addedToCart[item._id]
                          ? "bg-green-500 text-white"
                          : quantities[item._id] > 0
                          ? "bg-orange-500 hover:bg-orange-600 text-white font-bold"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={quantities[item._id] === 0}
                    >
                      {addedToCart[item._id] ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          Added ✓
                        </motion.span>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 inline mr-1" />
                          Add to Cart
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {fullScreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setFullScreenImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-full p-4"
          >
            <img
              src={fullScreenImage}
              alt="Full screen view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-orange-500 transition-colors duration-200"
              onClick={() => setFullScreenImage(null)}
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
