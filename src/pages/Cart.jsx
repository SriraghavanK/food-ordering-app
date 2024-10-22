import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ChevronRight, Clock, Truck, CreditCard, ShieldCheck, Gift, Utensils, AlertTriangle, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  const fetchCartItems = async () => {
    try {
      if (!token) {
        setError('Please log in to view your cart.');
        setIsLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to fetch cart items. Please try again later.');
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, 
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME20') {
      setDiscount(0.2); // 20% discount
    } else {
      setDiscount(0);
      setError('Invalid promo code');
    }
  };

  const total = calculateTotal(cartItems);
  const discountedTotal = total * (1 - discount);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
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
        className="flex justify-center items-center h-screen"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-orange-600">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12 bg-white rounded-lg shadow-md"
        >
          <Utensils className="mx-auto h-24 w-24 text-orange-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/restaurants" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg inline-flex items-center"
          >
            <Utensils className="mr-2" size={20} />
            Explore Restaurants
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ul className="bg-white rounded-lg shadow-md overflow-hidden">
            <AnimatePresence>
  {cartItems.map((item) => (
    <motion.li 
      key={item._id} 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-b border-gray-200 last:border-b-0"
    >
      <div className="flex items-center space-x-4">
        <img 
          className="h-24 w-24 rounded-lg object-cover shadow-md" 
          src={item.menuItem.image} 
          alt={item.menuItem.name} 
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{item.menuItem.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{item.menuItem.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-orange-600 font-medium">{formatPrice(item.menuItem.price)}</p>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                className="text-gray-500 hover:text-orange-500"
              >
                <Minus size={18} />
              </motion.button>
              <span className="font-semibold text-gray-700">{item.quantity}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="text-gray-500 hover:text-orange-500"
              >
                <Plus size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  ))}
</AnimatePresence>

            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹30.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{(total * 0.05).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span>-₹{(total * discount).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-orange-600">{formatPrice(discountedTotal + 30 + total * 0.05)}</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-orange-500 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-orange-600 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Proceed to Checkout <ChevronRight size={18} className="inline ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Clock className="text-orange-500 mr-4" size={24} />
          <div>
            <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
            <p className="text-sm text-gray-600">30 min or free</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Truck className="text-orange-500 mr-4" size={24} />
          <div>
            <h3 className="font-semibold text-gray-800">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over ₹500</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <CreditCard className="text-orange-500 mr-4" size={24} />
          <div>
            <h3 className="font-semibold text-gray-800">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure checkout</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <ShieldCheck className="text-orange-500 mr-4" size={24} />
          <div>
            <h3 className="font-semibold text-gray-800">Quality Guarantee</h3>
            <p className="text-sm text-gray-600">Fresh and delicious</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-orange-100 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-orange-800 flex items-center">
          <Gift className="mr-2" size={24} />
          Special Offer
        </h2>
        <p className="text-orange-700 mb-4">
          Get 20% off on your first order! Use code <span className="font-bold">WELCOME20</span> at checkout.
        </p>
        <Link
          to="/restaurants"
          className="inline-block bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
        >
          Order Now
        </Link>
      </div>
      
      {cartItems.length > 0 && (
        <div className="mt-12 bg-yellow-100 rounded-lg p-6 shadow-md flex items-start">
          <AlertTriangle className="text-yellow-500 mr-4  flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Please Note</h3>
            <p className="text-yellow-700 text-sm">
              Prices and availability are subject to change. Your order will be confirmed once you complete the checkout process.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}