const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @route   GET api/restaurants/:restaurantId/status
// @desc    Get restaurant status
// @access  Private
router.get('/:restaurantId/status', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json({ isApproved: restaurant.isApproved });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/restaurants/:restaurantId/menu
// @desc    Get restaurant menu
// @access  Private
router.get('/:restaurantId/menu', auth, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/restaurants/:restaurantId/menu
// @desc    Add a new menu item
// @access  Private (Admin or Restaurant Owner)
router.post(
  '/:restaurantId/menu',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required and must be a number').isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const restaurant = await Restaurant.findById(req.params.restaurantId);
      if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
      }

      // Check if user is admin or restaurant owner
      if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to add menu items to this restaurant' });
      }

      const newMenuItem = new MenuItem({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        restaurant: req.params.restaurantId
      });

      await newMenuItem.save();
      res.json(newMenuItem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/restaurants/:restaurantId/menu/:menuItemId
// @desc    Update a menu item
// @access  Private (Admin or Restaurant Owner)
router.put(
  '/:restaurantId/menu/:menuItemId',
  [auth],
  async (req, res) => {
    try {
      let menuItem = await MenuItem.findById(req.params.menuItemId);

      if (!menuItem) {
        return res.status(404).json({ msg: 'Menu item not found' });
      }

      // Check if user is admin or restaurant owner
      const restaurant = await Restaurant.findById(menuItem.restaurant);
      if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
      }
      if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to update menu items in this restaurant' });
      }


      menuItem.name = req.body.name || menuItem.name;
      menuItem.description = req.body.description || menuItem.description;
      menuItem.price = req.body.price || menuItem.price;
      menuItem.image = req.body.image || menuItem.image;

      await menuItem.save();
      res.json(menuItem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/restaurants/:restaurantId/menu/:menuItemId
// @desc    Delete a menu item
// @access  Private (Admin or Restaurant Owner)
router.delete(
  '/:restaurantId/menu/:menuItemId',
  [auth],
  async (req, res) => {
    try {
      let menuItem = await MenuItem.findById(req.params.menuItemId);

      if (!menuItem) {
        return res.status(404).json({ msg: 'Menu item not found' });
      }

      // Check if user is admin or restaurant owner
      const restaurant = await Restaurant.findById(menuItem.restaurant);
      if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
      }
      if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to delete menu items in this restaurant' });
      }

      await menuItem.remove();
      res.json({ msg: 'Menu item removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/restaurants/:restaurantId/orders
// @desc    Get restaurant orders
// @access  Private
router.get('/:restaurantId/orders', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json(restaurant.orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;