import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import DateHandler from "./DateHandler";
import { useAuth } from "../context/AuthContext";
import {
  Package,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckSquare,
  XCircle,
  RefreshCw,
  Search,
  Tag,
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
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
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order. Please try again.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="text-yellow-500" />;
      case "Preparing":
        return <Package className="text-blue-500" />;
      case "Out for Delivery":
        return <Truck className="text-purple-500" />;
      case "Delivered":
        return <CheckSquare className="text-green-500" />;
      case "Cancelled":
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen bg-orange-50"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen bg-orange-50"
      >
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg"
          role="alert"
        >
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <p className="font-bold">Error</p>
          </div>
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
      className="container mx-auto px-4 py-8 bg-orange-50 min-h-screen"
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-orange-600"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Your Orders
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
          <Search
            className="absolute left-3 top-2.5 text-orange-400"
            size={20}
          />
        </div>
      </motion.div>

      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Package className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <p className="text-xl text-orange-600">
            You haven't placed any orders yet.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-orange-700">
                    Order #{order._id}
                  </h3>
                  <motion.div
                    className={`px-3 py-1 rounded-full flex items-center ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Out for Delivery"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "Preparing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-sm font-medium">
                      {order.status}
                    </span>
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="text-orange-500 mr-2" />
                    <DateHandler createdAt={order.createdAt} />
                  </div>
                  <div className="flex items-center">
                    <FaRupeeSign className="text-green-500 mr-2" />
                    <p className="text-green-800 font-semibold">
                      {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {expandedOrders[order._id] && (
                    <motion.div
                      key={`details-${order._id}`}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={{
                        expanded: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden mt-4 bg-orange-50 p-4 rounded-md"
                    >
                      <h4 className="font-semibold mb-2 text-orange-700">
                        Order Items:
                      </h4>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center text-orange-800"
                          >
                            <span>
                              {item.menuItem?.name || "Unknown item"} x{" "}
                              {item.quantity}
                            </span>
                            <span className="font-medium">
                              ₹{((item.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-orange-200">
                        <div className="flex justify-between items-center text-orange-800">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-orange-800">
                          <span>Delivery Fee:</span>
                          <span>₹{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-orange-800">
                          <span>Tax:</span>
                          <span>₹{order.tax.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span className="flex items-center">
                              <Tag className="mr-1" size={16} />
                              Discount:
                            </span>
                            <span>-₹{order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center font-semibold text-orange-800 mt-2">
                          <span>Total:</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 flex justify-between items-center">
                  <motion.button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-orange-600 hover:text-orange-800 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedOrders[order._id] ? (
                      <>
                        <ChevronUp className="mr-1" size={20} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1" size={20} />
                        Show Details
                      </>
                    )}
                  </motion.button>
                  {order.status === "Pending" && (
                    <motion.button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle className="mr-2" size={16} />
                      Cancel Order
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button
        onClick={fetchOrders}
        className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw size={24} />
      </motion.button>
    </motion.div>
  );
}
