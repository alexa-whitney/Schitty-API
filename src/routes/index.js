const express = require('express');
const db = require('../firebase');

const characterRoutes = require('./character.js');
const quoteRoutes = require('./quote.js');

const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.send('Welcome to the Schitty API!')
})

// Characters routes
router.get('/characters', async (req, res) => {
    try {
        const charactersSnapshot = await db.collection('characters').get();
        const characters = charactersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ characters })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

// Use characterRoutes middleware for character API routes
router.use('/api/characters', characterRoutes);

// Quotes routes
router.get('/quotes', async (req, res) => {
    try {
        const quotesSnapshot = await db.collection('quotes').get();
        const quotes = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ quotes })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

router.use('/api/quotes', quoteRoutes);

module.exports = router;
