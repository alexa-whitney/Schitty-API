const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const Character = require('../models/Character');

/** Route to get all quotes. */
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find();
        return res.json({ quotes })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to get all quotes by a specific character. */
router.get('/character/:characterId', async (req, res) => {
    try {
        const quotes = await Quote.find({ characterId: req.params.characterId });
        return res.json({ quotes });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to add a new quote. */
router.post('/', async (req, res) => {
    try {
        const newQuote = new Quote(req.body);
        await newQuote.save();
        res.status(201).json({ quote: newQuote });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to update an existing quote by id */
router.put('/:quoteId', async (req, res) => {
    try {
        const updatedQuote = await Quote.findByIdAndUpdate(req.params.quoteId, req.body, { new: true });
        if (!updatedQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        res.json({ quote: updatedQuote});
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to delete a quote by id. */
router.delete('/:quoteId', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.quoteId);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        await quote.remove();
        return res.json({
            'message': 'Successfully deleted.',
            '_id': req.params.quoteId
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;