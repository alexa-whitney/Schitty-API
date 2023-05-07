const express = require('express');
const db = require('../firebase');
const characterRoutes = require('./character.js');
const quoteRoutes = require('./quote.js');

const router = express.Router();

// Characters routes
router.use('/characters', characterRoutes);

// Quotes routes
router.use('/quotes', quoteRoutes);

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to the Schitty API!')
});

module.exports = router;
