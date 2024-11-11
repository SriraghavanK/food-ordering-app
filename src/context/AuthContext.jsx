import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsRestaurant = localStorage.getItem("isRestaurant");
    if (storedUser && storedToken && storedIsRestaurant) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }
  }, []);

  const register = async (userData, isRestaurant = false) => {
    try {
      const endpoint = isRestaurant ? "/api/restaurants/register" : "/api/users/register";
      console.log(`Attempting registration at: ${endpoint}`);
      console.log('Registration data:', userData);
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, userData);
      
      console.log('Registration response:', response.data);
      
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isRestaurant", JSON.stringify(isRestaurant));
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      axios.defaults.headers.common["x-auth-token"] = response.data.token;
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          throw new Error(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error("No response received from server. Please try again later.");
        } else {
          console.error('Error setting up request:', error.message);
          throw new Error(`Error setting up request: ${error.message}`);
        }
      } else {
        console.error('Unexpected error:', error);
        throw new Error("An unexpected error occurred during registration.");
      }
    }
  };

  const login = async (email, password, isRestaurant = false) => {
    try {
      const endpoint = isRestaurant ? "/api/restaurants/login" : "/api/users/login";
      console.log(`Attempting login at endpoint: ${endpoint}`);
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      
      console.log('Login response:', response.data);
  
      if (response.data.user && response.data.token) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isRestaurant", JSON.stringify(isRestaurant));
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        axios.defaults.headers.common["x-auth-token"] = response.data.token;
        
        return response.data;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || "An unexpected error occurred during login");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isRestaurant");
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};