const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Stripe = require('stripe');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

dns.setServers(['8.8.8.8', '8.8.4.4']);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const CartItem = require('./models/CartItem');
const User = require('./models/User');
const Order = require('./models/Order');

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, isAdmin: true });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as an admin.' });
  }
};
const adminOrRestaurantAuth = async (req, res, next) => {
  try {
    // Get the secret pass (token) from the request
    const token = req.header('Authorization').replace('Bearer ', '');
    // Check if the pass is real
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // See if this person is an admin
    const admin = await User.findOne({ _id: decoded._id, isAdmin: true });
    
    // Or if they're a restaurant owner
    const restaurant = await Restaurant.findOne({ _id: decoded._id });
    
    // If they're neither admin nor restaurant owner, don't let them in
    if (!admin && !restaurant) {
      throw new Error();
    }

    // If they passed the check, let them continue
    req.token = token;
    req.user = admin || restaurant;
    next();
  } catch (error) {
    // If something went wrong, tell them they need to prove who they are
    res.status(401).send({ error: 'Please authenticate as an admin or restaurant owner.' });
  }
};
// Routes
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
});
// Add menu item
app.post('/api/restaurants/:id/menu', adminOrRestaurantAuth, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const menuItem = new MenuItem({ name, description, price, image, restaurant: req.params.id });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  }
});

// Update menu item
app.put('/api/restaurants/:restaurantId/menu/:id', adminOrRestaurantAuth, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.params.restaurantId },
      { name, description, price, image },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
});

// Delete menu item
app.delete('/api/restaurants/:restaurantId/menu/:id', adminOrRestaurantAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurant: req.params.restaurantId });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

app.post('/api/menu/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Remove any existing rating by this user
    menuItem.ratings = menuItem.ratings.filter(r => !r.user.equals(req.user._id));
    
    // Add the new rating
    menuItem.ratings.push({ user: req.user._id, rating });
    
    // Recalculate average rating
    menuItem.averageRating = menuItem.ratings.reduce((sum, r) => sum + r.rating, 0) / menuItem.ratings.length;
    
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    console.error('Error rating menu item:', error);
    res.status(500).json({ message: 'Error rating menu item' });
  }
});
// Restaurant registration route
app.post('/api/restaurants/register', async (req, res) => {
  try {
    const { name, email, password, cuisine, phone, location } = req.body;
    console.log('Attempting to register restaurant:', { name, email });

    // Check if restaurant already exists
    let restaurant = await Restaurant.findOne({ email });
    if (restaurant) {
      console.log('Restaurant already exists:', email);
      return res.status(400).json({ message: 'Restaurant with this email already exists' });
    }

    // Create new restaurant - IMPORTANT: Don't hash password here
    // Let the mongoose pre-save middleware handle the hashing
    restaurant = new Restaurant({
      name,
      email,
      password, // Raw password - will be hashed by pre-save hook
      cuisine,
      phone,
      location,
      isApproved: false,
      isLateNight: false,
      image: 'https://via.placeholder.com/150'
    });

    // Save restaurant - password will be hashed by pre-save hook
    await restaurant.save();
    console.log('Restaurant registered successfully:', restaurant.name);

    const token = jwt.sign(
      { _id: restaurant._id, isRestaurant: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        isRestaurant: true,
        isApproved: restaurant.isApproved
      }
    });
  } catch (err) {
    console.error('Restaurant registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});
app.post('/api/restaurants', adminAuth, async (req, res) => {
  try {
    const { name, cuisine, image , isLateNight , location } = req.body;
    const restaurant = new Restaurant({ name, cuisine, image , isLateNight , location });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Error adding restaurant', error: error.message });
  }
});

// Restaurant login route
app.post('/api/restaurants/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for restaurant:', email);

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      console.log('Restaurant not found:', email);
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Use bcrypt.compare() directly - no manual hashing needed
    const isMatch = await bcrypt.compare(password, restaurant.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for restaurant:', email);
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    if (!restaurant.isApproved) {
      console.log('Restaurant not approved:', email);
      return res.status(401).json({ message: 'Restaurant is not approved yet' });
    }

    const token = jwt.sign(
      { _id: restaurant._id, isRestaurant: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for restaurant:', email);
    res.json({
      token,
      user: {
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        isRestaurant: true,
        isApproved: restaurant.isApproved
      }
    });
  } catch (error) {
    console.error('Restaurant login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET route to check approval status
app.get('/api/restaurants/:id/status', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ isApproved: restaurant.isApproved });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving approval status", error });
  }
});

app.put('/api/restaurants/:id', adminAuth, async (req, res) => {
  try {
    const { name, cuisine, image , isLateNight,location } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, cuisine, image , isLateNight,location },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
});

// Delete restaurant
app.delete('/api/restaurants/:id', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    // Also delete all menu items associated with this restaurant
    await MenuItem.deleteMany({ restaurant: req.params.id });
    res.json({ message: 'Restaurant and associated menu items deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
  }
});
app.put('/api/restaurants/:id/approve', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    if (restaurant.isApproved) {
      return res.status(400).json({ message: 'Restaurant is already approved' });
    }
    
    restaurant.isApproved = true;
    // We don't need to set other fields as they should already exist
    
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    console.error('Error approving restaurant:', error);
    res.status(500).json({ message: 'Error approving restaurant', error: error.message });
  }
});
app.put('/api/restaurants/:id/approve', adminAuth, async (req, res) => {
  try {
    const { phone, email } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    restaurant.isApproved = true;
    
    // Update phone and email only if they are provided
    if (phone) restaurant.phone = phone;
    if (email) restaurant.email = email;
    
    await restaurant.save();
    
    res.json(restaurant);
  } catch (error) {
    console.error('Error approving restaurant:', error);
    res.status(500).json({ message: 'Error approving restaurant', error: error.message });
  }
});


app.put('/api/restaurants/:id/reject', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting restaurant' });
  }
});
app.post('/api/restaurants/:id/menu', adminAuth, async (req, res) => {
  try {
    const { name, description, price, image,location } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const menuItem = new MenuItem({ name, description, price, image, location,restaurant: req.params.id });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item' });
  }
});

app.put('/api/restaurants/:restaurantId/menu/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, image , location } = req.body;
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.params.restaurantId },
      { name, description, price, image, location },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

app.delete('/api/restaurants/:restaurantId/menu/:id', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurant: req.params.restaurantId });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.menuItem', 'name price');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.put('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

app.delete('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Restaurant authentication middleware
const restaurantAuth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findOne({ _id: decoded._id });

    if (!restaurant) {
      throw new Error();
    }

    req.token = token;
    req.restaurant = restaurant;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as a restaurant owner.' });
  }
};

// Get restaurant status
app.get('/api/restaurants/:id/status', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ isApproved: restaurant.isApproved });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant menu
app.get('/api/restaurants/:id/menu', restaurantAuth, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant orders
app.get('/api/restaurants/:id/orders', restaurantAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.menuItem': { $in: await MenuItem.find({ restaurant: req.params.id }).distinct('_id') } })
      .populate('user', 'name email')
      .populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item
app.post('/api/restaurants/:id/menu', restaurantAuth, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const menuItem = new MenuItem({ name, description, price, image, restaurant: req.params.id });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  }
});

// Update menu item
app.put('/api/restaurants/:restaurantId/menu/:id', restaurantAuth, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.params.restaurantId },
      { name, description, price, image },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
});

// Delete menu item
app.delete('/api/restaurants/:restaurantId/menu/:id', restaurantAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurant: req.params.restaurantId });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});




app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, Location, phone, isAdmin } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, email, password: hashedPassword, Location, phone, isAdmin: isAdmin || false });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Error logging in' });
  }
});

app.post('/api/users/google-login', async (req, res) => {
  const { tokenId } = req.body;
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { name, email, picture } = ticket.getPayload();
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({
        name,
        email,
        profilePicture: picture,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 8), // Generate a random password
      });
      await user.save();
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
});

app.get('/api/cart', auth, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate('menuItem');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

app.post('/api/cart', auth, async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    let cartItem = await CartItem.findOne({ user: req.user._id, menuItem: menuItemId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({
        menuItem: menuItemId,
        quantity,
        user: req.user._id,
      });
      await cartItem.save();
    }
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

app.put('/api/cart/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { quantity },
      { new: true }
    );
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

app.delete('/api/cart/:id', auth, async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing cart item' });
  }
});

app.post('/api/orders', auth, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate('menuItem');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const deliveryFee = 30; // Fixed delivery fee
    const taxRate = 0.05; // 5% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;

    const order = new Order({
      user: req.user._id,
      items: cartItems.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
        price: item.menuItem.price
      })),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total,
      status: 'Pending'
    });

    await order.save();
    
    // Clear the cart after successfully creating the order
    await CartItem.deleteMany({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.menuItem', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});


app.delete('/api/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is not pending' });
    }

    // Update only the status field
    order.status = 'Cancelled';
    await order.save({ validateBeforeSave: false });

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order. Please try again.' });
  }
});

app.post('/api/payments', auth, async (req, res) => {
  try {
    const { paymentMethodId, return_url } = req.body;
    
    if (!paymentMethodId) {
      return res.status(400).json({ success: false, message: 'Payment method ID is required' });
    }

    if (!return_url) {
      return res.status(400).json({ success: false, message: 'Return URL is required' });
    }

    // Fetch the user's cart items
    const cartItems = await CartItem.find({ user: req.user._id }).populate('menuItem');
    
    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    console.log('Creating PaymentIntent for total:', total);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects the amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      return_url: return_url,
    });

    console.log('PaymentIntent created:', paymentIntent.id);

    if (paymentIntent.status === 'succeeded') {
      res.json({ success: true });
    } else if (paymentIntent.status === 'requires_action') {
      // 3D Secure authentication is required
      res.json({ 
        success: false, 
        requires_action: true, 
        payment_intent_client_secret: paymentIntent.client_secret 
      });
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});