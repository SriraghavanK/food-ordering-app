import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Truck, AlertCircle, Gift, Tag } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51Q4FgrHmDAlpseK3wTCXtIUwRYP02keyJsz5QNnKxTglRd6t0j4EbegG0ElTIkIJf6W5KRUjucrlCwtsIAdRdqlq00c2kTKsb3');

const CheckoutForm = ({ onSuccess, total, discount }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Failed to create payment method');
      }

      const response = await axios.post(
        'http://localhost:5000/api/payments',
        { 
          paymentMethodId: paymentMethod.id,
          amount: Math.round((total - discount) * 100), // Convert to cents
          return_url: `${window.location.origin}/order-confirmation`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await createOrder();
        onSuccess();
      } else if (response.data.requires_action) {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          response.data.payment_intent_client_secret
        );

        if (confirmError) {
          throw new Error(confirmError.message || 'Payment confirmation failed');
        } else if (paymentIntent.status === 'succeeded') {
          await createOrder();
          onSuccess();
        } else {
          throw new Error('Payment failed after confirmation');
        }
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Order created successfully:', response.data);
    } catch (err) {
      console.error('Error creating order:', err);
      throw new Error('Failed to create order after successful payment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
            Credit or debit card
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500 mb-4 flex items-center" role="alert">
            <AlertCircle className="mr-2" size={16} />
            {error}
          </div>
        )}
        <motion.button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            (!stripe || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center">
            <CreditCard className="mr-2" size={20} />
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </div>
        </motion.button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    }
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    try {
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

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME20') {
      setDiscount(calculateTotal(cartItems) * 0.2); // 20% discount
    } else {
      setDiscount(0);
      setError('Invalid promo code');
    }
  };

  const handlePaymentSuccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      navigate('/order-tracking');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

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

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
          <p className="font-bold">Notice</p>
          <p>Please log in to proceed with checkout.</p>
        </div>
      </motion.div>
    );
  }

  const total = calculateTotal(cartItems);
  const discountedTotal = total - discount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Truck className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  rows={3}
                  required
                  aria-required="true"
                  placeholder="Enter your delivery address"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center mb-2">
                <span>{item.menuItem.name} x {item.quantity}</span>
                <span>{formatPrice(item.menuItem.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Delivery Fee</span>
              <span>₹30.00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Tax</span>
              <span>{formatPrice(total * 0.05)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center text-xl font-semibold">
              <span>Total</span>
              <span>{formatPrice(discountedTotal + 30 + total * 0.05)}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Promo Code</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={applyPromoCode}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <div className="mt-2 text-green-600 flex items-center">
                <Tag className="mr-2" size={16} />
                <span>Promo code applied successfully!</span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Payment</h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm onSuccess={handlePaymentSuccess} total={discountedTotal + 30 + total * 0.05} discount={discount} />
            </Elements>
          </div>
        </div>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}