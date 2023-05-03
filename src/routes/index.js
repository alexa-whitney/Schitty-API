const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../config/schitty-api-firebase-key.json');
const db = require('../firebase'); // Import the Firebase instance

const characterRoutes = require('./character.js');
const quoteRoutes = require('./quote.js');

const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.send('Welcome to the Schitty API!')
})

// Characters routes
router.get('/characters', (req, res) => {
  db.collection('characters')
    .get()
    .then((snapshot) => {
      const characters = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(characters);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// Quotes routes
router.get('/quotes', (req, res) => {
  db.collection('quotes')
    .get()
    .then((snapshot) => {
      const quotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(quotes);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = router;



