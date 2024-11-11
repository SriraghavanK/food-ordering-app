import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DateHandler from "./DateHandler";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Coffee,
  ShoppingBag,
  Clock,
  Users,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Package,
  Truck,
  CheckSquare,
  Tag,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaRupeeSign } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function EnhancedAdminPanel() {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    restaurantId: "",
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    cuisine: "",
    image: "",
    isLateNight: false,
    location: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    monthlySales: [],
  });

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      fetchAllMenuItems();
    }
  }, [restaurants]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateAnalytics();
    }
  }, [orders, selectedMonth, selectedYear]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/restaurants",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants(response.data);
    } catch (error) {
      setError("Error fetching restaurants: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMenuItems = async () => {
    setIsLoading(true);
    try {
      const menuItemsPromises = restaurants.map((restaurant) =>
        axios.get(
          `http://localhost:5000/api/restaurants/${restaurant._id}/menu`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
      const menuItemsResponses = await Promise.all(menuItemsPromises);
      const allMenuItems = menuItemsResponses.flatMap(
        (response) => response.data
      );
      setMenuItems(allMenuItems);
    } catch (error) {
      setError("Error fetching menu items: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === selectedMonth &&
        orderDate.getFullYear() === selectedYear
      );
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const topSellingItems = getTopSellingItems(orders);
    const monthlySales = getMonthlySales(orders);

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topSellingItems,
      monthlySales,
    });
  };

  const getTopSellingItems = (orders) => {
    const itemCounts = {};
    orders.forEach((order) => {
      if (order && order.items) {
        order.items.forEach((item) => {
          if (item && item.menuItem && item.menuItem.name) {
            const itemName = item.menuItem.name;
            itemCounts[itemName] =
              (itemCounts[itemName] || 0) + (item.quantity || 1);
          }
        });
      }
    });
    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));
  };

  const getMonthlySales = (orders) => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const monthlySales = Array(daysInMonth).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const day = date.getDate() - 1; // Array is 0-indexed
      monthlySales[day] += order.total;
    });

    return monthlySales.map((sales, index) => ({
      day: index + 1,
      sales: parseFloat(sales.toFixed(2)),
    }));
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/restaurants/${newItem.restaurantId}/menu`,
        newItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMenuItems([...menuItems, response.data]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        image: "",
        restaurantId: "",
      });
      setSuccess("Menu item added successfully!");
    } catch (error) {
      setError("Error adding menu item: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/restaurants",
        newRestaurant,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants([...restaurants, response.data]);
      setNewRestaurant({
        name: "",
        cuisine: "",
        image: "",
        isLateNight: false,
        location: "",
        phone: "",
        email: "",
      });
      setSuccess("Restaurant added successfully!");
    } catch (error) {
      setError("Error adding restaurant: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.status }
            : order
        )
      );

      setSuccess("Order status updated successfully!");
    } catch (error) {
      setError("Error updating order status: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setIsLoading(true);
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(orders.filter((order) => order._id !== orderId));
        setSuccess("Order deleted successfully!");
      } catch (error) {
        setError("Error deleting order: " + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editMenuItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${editingItem.restaurant}/menu/${editingItem._id}`,
        editingItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMenuItems(
        menuItems.map((item) =>
          item._id === editingItem._id ? response.data : item
        )
      );
      setEditingItem(null);
      setSuccess("Menu item updated successfully!");
    } catch (error) {
      setError("Error updating menu item: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenuItem = async (itemId, restaurantId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setIsLoading(true);
      try {
        await axios.delete(
          `http://localhost:5000/api/restaurants/${restaurantId}/menu/${itemId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMenuItems(menuItems.filter((item) => item._id !== itemId));
        setSuccess("Menu item deleted successfully!");
      } catch (error) {
        setError("Error deleting menu item: " + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editRestaurantHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${editingRestaurant._id}`,
        editingRestaurant,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants(
        restaurants.map((r) =>
          r._id === response.data._id ? response.data : r
        )
      );
      setEditingRestaurant(null);
      setSuccess("Restaurant updated successfully!");
    } catch (error) {
      setError("Error updating restaurant: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRestaurant = async (restaurantId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this restaurant? This will also delete all associated menu items."
      )
    ) {
      setIsLoading(true);
      try {
        await axios.delete(
          `http://localhost:5000/api/restaurants/${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRestaurants(restaurants.filter((r) => r._id !== restaurantId));
        setMenuItems(
          menuItems.filter((item) => item.restaurant !== restaurantId)
        );
        setSuccess(
          "Restaurant and associated menu items deleted successfully!"
        );
      } catch (error) {
        setError("Error deleting restaurant: " + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
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
      default:
        return null;
    }
  };

  const approveRestaurant = async (id) => {
    setIsLoading(true);
    try {
      const restaurant = restaurants.find(r => r._id === id);
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${id}/approve`,
        {
          phone: restaurant.phone,
          email: restaurant.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Approval response:', response.data);
      setSuccess("Restaurant approved successfully!");
      setRestaurants(prevRestaurants => 
        prevRestaurants.filter(restaurant => restaurant._id !== id)
      );
    } catch (error) {
      console.error('Error approving restaurant:', error.response?.data || error.message);
      setError("Error approving restaurant: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  const rejectRestaurant = async (id) => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/restaurants/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Restaurant rejected successfully!");
      setRestaurants(prevRestaurants => 
        prevRestaurants.filter(restaurant => restaurant._id !== id)
      );
    } catch (error) {
      setError("Error rejecting restaurant: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(
    (item) =>
      (selectedRestaurant ? item.restaurant === selectedRestaurant : true) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container mx-auto px-4 py-8 min-h-screen"
      style={{ backgroundColor: "#FFF8F2" }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-orange-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin Panel
      </motion.h1>

      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <AlertTriangle className="mr-2" />
              <p className="font-bold">Error</p>
            </div>
            <p>{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <CheckCircle className="mr-2" />
              <p className="font-bold">Success</p>
            </div>
            <p>{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-center mb-8 space-x-3 space-y-1 sm:space-y-0">
        {["dashboard", "restaurants", "menu", "orders"].map((tab) => (
          <motion.button
            key={tab}
            className={`px-4 py-2  rounded-lg ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 border border-orange-500"
            }`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search
            className="absolute left-3 top-2.5 text-orange-400"
            size={20}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <DashboardCard
              title="Total Revenue"
              value={`₹${analytics.totalRevenue.toFixed(2)}`}
              icon={<FaRupeeSign className="text-green-500" size={24} />}
            />
            <DashboardCard
              title="Total Orders"
              value={analytics.totalOrders}
              icon={<ShoppingBag className="text-blue-500" size={24} />}
            />
            <DashboardCard
              title="Average Order Value"
              value={`₹${analytics.averageOrderValue.toFixed(2)}`}
              icon={<TrendingUp className="text-orange-500" size={24} />}
            />
            <DashboardCard
              title="Top Selling Item"
              value={analytics.topSellingItems[0]?.name || "N/A"}
              icon={<Zap className="text-yellow-500" size={24} />}
            />
            <div className="col-span-full">
              <h3 className="text-xl font-semibold mb-4 text-orange-700">
                Sales Chart
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="mb-4 flex flex-wrap justify-between items-center">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="p-2 border border-orange-300 rounded mb-2 sm:mb-0"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2000, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="p-2 border border-orange-300 rounded"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <Bar
                  data={{
                    labels: analytics.monthlySales.map(
                      (sale) => `Day ${sale.day}`
                    ),
                    datasets: [
                      {
                        label: "Daily Sales",
                        data: analytics.monthlySales.map((sale) => sale.sales),
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                        borderColor: "rgb(255, 159, 64)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `Daily Sales for ${new Date(
                          selectedYear,
                          selectedMonth
                        ).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}`,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Sales (₹)",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Day of Month",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-span-full md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-orange-700">
                Top Selling Items
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <ul className="space-y-2">
                  {analytics.topSellingItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold">
                        {item.quantity} sold
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
        {activeTab === "restaurants" && (
          <motion.div
            key="restaurants"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-orange-700">Restaurant Approvals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.filter(restaurant => !restaurant.isApproved).map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2 text-orange-700">
                      {restaurant.name}
                    </h3>
                    <p className="text-orange-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-sm text-orange-500 mb-2">
                      Phone: {restaurant.phone || "Not provided"}
                    </p>
                    <p className="text-sm text-orange-500 mb-4">
                      Email: {restaurant.email || "Not provided"}
                    </p>
                    <p className="text-sm text-orange-500 mb-4">
                      Status: {restaurant.isApproved ? "Approved" : "Pending"}
                    </p>
                    <div className="flex flex-wrap justify-between">
                      {!restaurant.isApproved && (
                        <motion.button
                          onClick={() => approveRestaurant(restaurant._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300 flex items-center mb-2 sm:mb-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle className="mr-1" size={16} /> Approve
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => rejectRestaurant(restaurant._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle className="mr-1" size={16} /> Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 mt-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-orange-700">
                <Coffee className="mr-2" /> Add New Restaurant
              </h2>
              <form onSubmit={addRestaurant} className="space-y-4">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, name: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Cuisine"
                  value={newRestaurant.cuisine}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newRestaurant.image}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, image: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newRestaurant.phone}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newRestaurant.email}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, email: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isLateNight"
                    checked={newRestaurant.isLateNight}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, isLateNight: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="isLateNight">Available for Late Night Delivery</label>
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={newRestaurant.location}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, location: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300 flex items-center justify-center w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin mr-2" />
                  ) : (
                    <PlusCircle className="mr-2" />
                  )}
                  {isLoading ? "Adding..." : "Add Restaurant"}
                </motion.button>
              </form>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2 text-orange-700">
                      {restaurant.name}
                    </h3>
                    <p className="text-orange-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-sm text-orange-500 mb-4">
                      {restaurant.isLateNight
                        ? "Late Night Available"
                        : "Not Available Late Night"}
                    </p>
                    <p className="text-sm text-orange-500 mb-4">
                      Location: {restaurant.location}
                    </p>
                    <div className="flex flex-wrap justify-between">
                      <motion.button
                        onClick={() => setEditingRestaurant(restaurant)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition duration-300 flex items-center mb-2 sm:mb-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="mr-1" size={16} /> Edit
                      </motion.button>
                      <motion.button
                        onClick={() => deleteRestaurant(restaurant._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="mr-1" size={16} /> Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-orange-700">
                <ShoppingBag className="mr-2" /> Add New Menu Item
              </h2>
              <form onSubmit={addMenuItem} className="space-y-4">
                <select
                  value={newItem.restaurantId}
                  onChange={(e) =>
                    setNewItem({ ...newItem, restaurantId: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounde focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300 flex items-center justify-center w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin mr-2" />
                  ) : (
                    <PlusCircle className="mr-2" />
                  )}
                  {isLoading ? "Adding..." : "Add Item"}
                </motion.button>
              </form>
            </div>

            <div className="mb-4">
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Restaurants</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2 text-orange-700">
                      {item.name}
                    </h3>
                    <p className="text-orange-600 mb-2">{item.description}</p>
                    <p className="text-lg font-semibold mb-4 text-orange-500">
                      Price: ₹{parseFloat(item.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-orange-500 mb-4">
                      Restaurant:{" "}
                      {restaurants.find((r) => r._id === item.restaurant)
                        ?.name || "Unknown"}
                    </p>
                    <div className="flex flex-wrap justify-between">
                      <motion.button
                        onClick={() => setEditingItem(item)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition duration-300 flex items-center mb-2 sm:mb-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="mr-1" size={16} /> Edit
                      </motion.button>
                      <motion.button
                        onClick={() =>
                          deleteMenuItem(item._id, item.restaurant)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="mr-1" size={16} /> Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <h3 className="font-bold text-xl text-orange-700 mb-2 sm:mb-0">
                        Order ID: {order._id}
                      </h3>
                      <motion.div
                        className={`px-3 py-1 rounded-full flex items-center ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Out for Delivery"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "Preparing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium">
                          {order.status}
                        </span>
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Users className="text-orange-500 mr-2" />
                        <p className="text-orange-800">
                          {order.user?.name || "Unknown"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <FaRupeeSign className="text-green-500 mr-2" />
                        <p className="text-green-800 font-semibold">
                          {order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="text-blue-500 mr-2" />
                        <DateHandler createdAt={order.createdAt} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor={`status-${order._id}`}
                        className="block text-sm font-medium text-orange-700 mb-1"
                      >
                        Update Status:
                      </label>
                      <select
                        id={`status-${order._id}`}
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="w-full p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-orange-800"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
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
                                  ₹
                                  {(
                                    (item.menuItem?.price || 0) * item.quantity
                                  ).toFixed(2)}
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

                    <div className="mt-4 flex flex-wrap justify-between items-center">
                      <motion.button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id
                          )
                        }
                        className="text-orange-600 hover:text-orange-800 flex items-center mb-2 sm:mb-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {expandedOrder === order._id ? (
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
                      <motion.button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Delete Order
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {editingItem && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-orange-700">
              Edit Menu Item
            </h3>
            <form onSubmit={editMenuItem} className="space-y-4">
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Item Name"
                required
              />
              <input
                type="text"
                value={editingItem.description}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Item Description"
                required
              />
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: e.target.value })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Item Price"
                required
              />
              <input
                type="text"
                value={editingItem.image}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, image: e.target.value })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Image URL"
                required
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update Item
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

{editingRestaurant && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-orange-700">
              Edit Restaurant
            </h3>
            <form onSubmit={editRestaurantHandler} className="space-y-4">
              <input
                type="text"
                value={editingRestaurant.name}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    name: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Restaurant Name"
                required
              />
              <input
                type="text"
                value={editingRestaurant.cuisine}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    cuisine: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Cuisine Type"
                required
              />
              <input
                type="text"
                value={editingRestaurant.image}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    image: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Image URL"
                required
              />
              <input
                type="tel"
                value={editingRestaurant.phone}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Phone"
                required
              />
              <input
                type="email"
                value={editingRestaurant.email}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    email: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
                required
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsLateNight"
                  checked={editingRestaurant.isLateNight}
                  onChange={(e) =>
                    setEditingRestaurant({
                      ...editingRestaurant,
                      isLateNight: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="editIsLateNight" className="text-orange-700">
                  Available for Late Night Delivery
                </label>
              </div>
              <input
                type="text"
                value={editingRestaurant.location}
                onChange={(e) =>
                  setEditingRestaurant({
                    ...editingRestaurant,
                    location: e.target.value,
                  })
                }
                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Restaurant Location"
                required
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update Restaurant
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setEditingRestaurant(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-orange-700">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-orange-600">{value}</p>
    </motion.div>
  );
}