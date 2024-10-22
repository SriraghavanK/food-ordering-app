import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, Utensils, Truck, ArrowRight } from 'lucide-react';
import wallpaper from '../wallpaper.jpeg';
import '../CSS/home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cover bg-center text-white flex flex-col"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-shadow"
            style={{"color":"white","fontFamily":"cooper black"}}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Satisfy Your Cravings, Delivered to Your Doorstep
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-8 text-shadow"
            style={{"color":"white","fontFamily":"cooper black"}}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the convenience of having your favorite meals delivered right to you. Choose from a wide variety of cuisines and enjoy restaurant-quality food from the comfort of your home.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-12"
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FeatureCard
            icon={<Clock className="w-12 h-12 mx-auto mb-4 text-blue-400" />}
            title="Fast Delivery"
            description="Get your food delivered in 30 minutes or less"
          />
          <FeatureCard
            icon={<Utensils className="w-12 h-12 mx-auto mb-4 text-blue-400" />}
            title="Wide Selection"
            description="Choose from hundreds of restaurants and cuisines"
          />
          <FeatureCard
            icon={<Truck className="w-12 h-12 mx-auto mb-4 text-blue-400" />}
            title="Easy Tracking"
            description="Track your order in real-time from kitchen to doorstep"
          />
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center mt-auto space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/restaurants" className="glow-on-hover bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
            Explore Restaurants <ArrowRight className="inline-block ml-2" />
          </Link>
          {!user && (
            <Link to="/register" className="glow-on-hover bg-green-500 hover:bg-green-600 w-full sm:w-auto">
              Sign up Now
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 text-center backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-opacity-70">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}