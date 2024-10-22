'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, AlertCircle, Pizza, Utensils, Coffee, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password. Please try again or reset your password.')
    }
  }

  const foodIcons = [Pizza, Utensils, Coffee]

  const handleRegister = () => {
    navigate('/register') // Navigates to the register page
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {foodIcons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5 + index * 0.2,
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 5
            }}
            className={`absolute ${index === 0 ? '-top-16 -left-16' : index === 1 ? '-bottom-16 -left-16' : '-top-16 -right-16'}`}
          >
            <Icon size={64} className="text-white opacity-50" />
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0.9, rotateY: -15 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-8"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email address
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </motion.div>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Sign in
                </button>
              </motion.div>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center"
          >
            <motion.button
              onClick={() => setShowHelp(!showHelp)}
              className="text-orange-600 hover:underline flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle size={18} className="mr-1" />
              Need help signing in?
            </motion.button>
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-sm text-gray-600"
                >
                  <p>If you're having trouble signing in:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Make sure your email and password are correct</li>
                    <li>Check if Caps Lock is on</li>
                    <li>Try resetting your password</li>
                    <li>Contact support if issues persist</li>
                  </ul>
                  <a href="#" className="block mt-2 text-orange-600 hover:underline">Reset your password</a>
                  <a href="#" className="block mt-1 text-orange-600 hover:underline">Contact support</a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Register Link Here */}
            <div className="mt-4">
              <motion.button
                onClick={handleRegister}
                className="text-orange-600 hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Don't have an account? Register
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
