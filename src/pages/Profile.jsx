"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DateHandler from "./DateHandler";
import { motion } from "framer-motion";
import {
  Loader2,
  ShoppingBag,
  User,
  Mail,
  MapPin,
  Phone,
  Pizza,
  Coffee,
  IceCream,
  Sandwich,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-orange-50"
      >
        <p className="text-2xl font-semibold text-orange-600">
          Please log in to view your profile.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1
          className="text-4xl font-bold text-orange-600 mb-8 text-center"
          style={{ fontFamily: "cooper black" }}
        >
          Your Profile
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6 space-y-4">
            <ProfileItem
              icon={<User className="text-orange-500" />}
              label="Name"
              value={user.name}
            />
            <ProfileItem
              icon={<Mail className="text-orange-500" />}
              label="Email"
              value={user.email}
            />
            {user.address && (
              <ProfileItem
                icon={<MapPin className="text-orange-500" />}
                label="Location"
                value={user.address}
              />
            )}
            {user.phone && (
              <ProfileItem
                icon={<Phone className="text-orange-500" />}
                label="Phone"
                value={user.phone}
              />
            )}
            {user.isAdmin && (
              <div className="flex items-center space-x-2 text-green-600 font-semibold">
                <ShoppingBag className="h-5 w-5" />
                <span>You are an Admin</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <Link to="/order-tracking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 flex items-center shadow-lg"
            >
              <Clock className="mr-2" size={24} />
              View Full Order History
            </motion.button>
          </Link>
        </div>

        <h2
          className="text-3xl font-bold text-orange-600 mb-6"
          style={{ fontFamily: "cooper black" }}
        >
          Recent Cravings
        </h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : orders.length === 0 ? (
          <EmptyOrderMessage />
        ) : (
          <OrderList orders={orders.slice(0, 3)} />
        )}
      </motion.div>
    </div>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-red-500 text-center"
  >
    {message}
  </motion.p>
);

const EmptyOrderMessage = () => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-gray-600 text-center"
  >
    You haven't satisfied any cravings yet. Time to treat yourself!
  </motion.p>
);

const OrderList = ({ orders }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    {orders.map((order) => (
      <OrderItem key={order._id} order={order} />
    ))}
  </motion.div>
);

const getFoodIcon = (itemName) => {
  const lowerCaseName = itemName.toLowerCase();
  if (lowerCaseName.includes("pizza"))
    return <Pizza className="h-5 w-5 text-orange-500" />;
  if (lowerCaseName.includes("coffee") || lowerCaseName.includes("tea"))
    return <Coffee className="h-5 w-5 text-orange-500" />;
  if (lowerCaseName.includes("ice cream"))
    return <IceCream className="h-5 w-5 text-orange-500" />;
  return <Sandwich className="h-5 w-5 text-orange-500" />;
};

const OrderItem = ({ order }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white shadow-md rounded-lg overflow-hidden"
  >
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-orange-600">
          Craving #{order._id.slice(-6)}
        </h3>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          {order.status}
        </span>
      </div>
      <DateHandler createdAt={order.createdAt} />
      <p className="text-gray-600">
        Subtotal: ₹{(order.subtotal ?? 0).toFixed(2)}
      </p>
      <p className="text-gray-600">
        Delivery Fee: ₹{(order.deliveryFee ?? 0).toFixed(2)}
      </p>
      <p className="text-gray-600">Tax: ₹{(order.tax ?? 0).toFixed(2)}</p>
      <p className="text-gray-800 font-semibold">
        Total Indulgence: ₹{(order.total ?? 0).toFixed(2)}
      </p>
      <ul className="divide-y divide-gray-200">
        {order.items.map((item, index) => (
          <li key={index} className="py-2">
            {item.menuItem && item.menuItem.name ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getFoodIcon(item.menuItem.name)}
                  <span>
                    {item.menuItem.name} x {item.quantity}
                  </span>
                </div>
                <span>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-gray-500">Craving details unavailable</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);
