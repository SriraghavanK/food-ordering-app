import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  ChefHat,
  Utensils,
  ShoppingBag,
  DollarSign,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Menu as MenuIcon,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FaRupeeSign } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const RestaurantDashboard = () => {
  const { user, token, logout } = useAuth();
  const [isApproved, setIsApproved] = useState(false);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', image: '' });
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statusRes, menuRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/restaurants/${user._id}/status`, { headers: { 'x-auth-token': token } }),
          axios.get(`${API_BASE_URL}/restaurants/${user._id}/menu`, { headers: { 'x-auth-token': token } }),
          axios.get(`${API_BASE_URL}/restaurants/${user._id}/orders`, { headers: { 'x-auth-token': token } })
        ]);
        setIsApproved(statusRes.data.isApproved);
        setMenuItems(menuRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user._id, token, logout]);

  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        logout();
      } else if (err.response.status === 404) {
        setError('Resource not found. Please check your restaurant ID or contact support.');
      } else {
        setError(`An error occurred: ${err.response.data.message || 'Please try again later.'}`);
      }
    } else if (err.request) {
      setError('Unable to connect to the server. Please check your internet connection.');
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/restaurants/${user._id}/menu`,
        newMenuItem,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      setMenuItems([...menuItems, response.data]);
      setNewMenuItem({ name: '', description: '', price: '', image: '' });
      toast.success('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error.response || error);
      toast.error('Failed to add menu item. Please try again.');
    }
  };
  
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/restaurants/${user._id}/menu/${editingMenuItem._id}`,
        editingMenuItem,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      setMenuItems(menuItems.map(item => item._id === response.data._id ? response.data : item));
      setEditingMenuItem(null);
      toast.success('Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item. Please try again.');
    }
  };
  
  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(
          `${API_BASE_URL}/restaurants/${user._id}/menu/${itemId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        setMenuItems(menuItems.filter(item => item._id !== itemId));
        toast.success('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item. Please try again.');
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4">Dashboard Overview</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard icon={<ShoppingBag />} title="Total Orders" value={orders.length} />
              <DashboardCard icon={<FaRupeeSign />} title="Revenue" value={`₹${calculateTotalRevenue()}`} />
              <DashboardCard icon={<Star />} title="Average Rating" value={calculateAverageRating()} />
              <DashboardCard icon={<Utensils />} title="Menu Items" value={menuItems.length} />
            </div>
          </motion.div>
        );
      case 'menu':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4">Menu Management</motion.h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Add New Menu Item</h3>
              <form onSubmit={handleAddMenuItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Add Item
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <motion.div key={item._id} variants={itemVariants} className="bg-white p-4 rounded-lg shadow">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setEditingMenuItem(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      <Edit size={16} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} className="inline mr-1" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4">Recent Orders</motion.h2>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <motion.div key={order._id} variants={itemVariants} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold">Order #{order._id.slice(-6)}</h3>
                  <p>Total: ₹{order.total.toFixed(2)}</p>
                  <p>Status: {order.status}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0).toFixed(2);
  };

  const calculateAverageRating = () => {
    const totalRating = menuItems.reduce((sum, item) => sum + (item.averageRating || 0), 0);
    return (totalRating / menuItems.length || 0).toFixed(1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <ChefHat size={48} className="text-orange-500" />
              <h1 className="text-4xl font-bold text-gray-800">{user.name}'s Dashboard</h1>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              {isApproved ? (
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <CheckCircle size={20} />
                  <span>Approved</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  <AlertTriangle size={20} />
                  <span>Pending Approval</span>
                </div>
              )}

            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex space-x-4 mb-8"
          >
            {['overview', 'menu', 'orders'].map((tab) => (
              <motion.button
                key={tab}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {editingMenuItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleUpdateMenuItem} className="space-y-4">
              <input
                type="text"
                placeholder="Item Name"
                value={editingMenuItem.name}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={editingMenuItem.description}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={editingMenuItem.price}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingMenuItem.image}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, image: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const DashboardCard = ({ icon, title, value }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
  >
    <div className="bg-orange-100 p-3 rounded-full">
      {React.cloneElement(icon, { size: 24, className: "text-orange-500" })}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-orange-500">{value}</p>
    </div>
  </motion.div>
);

export default RestaurantDashboard;