const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require("../models/Restaurant")
const adminOrRestaurantAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    const admin = await User.findOne({ _id: decoded._id, isAdmin: true });
    
    // Check if user is a restaurant owner
    const restaurant = await Restaurant.findOne({ _id: decoded._id });
    
    if (!admin && !restaurant) {
      throw new Error();
    }

    req.token = token;
    req.user = admin || restaurant;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as an admin or restaurant owner.' });
  }
};