import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const RestaurantPending = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your restaurant registration is pending approval. We'll review your information and get back to you soon.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RestaurantPending;