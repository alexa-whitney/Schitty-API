const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

/** Route to get all quotes. */
router.get('/', async (req, res) => {
    console.log('Quotes route hit!');
    try {
        const quotes = await Quote.getAll();
        return res.json({ quotes });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to get all quotes by a character. */
router.get('/character/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Quotes by character route hit! characterId=${id}`);
    try {
      const quotes = await Quote.getAllByCharacterId(id);
      res.json(quotes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

/** Route to get one quote by id. */
router.get('/:id', async (req, res) => {
    try {
        const quoteId = req.params.id;
        const quote = await Quote.getById(quoteId);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        return res.json({ quote });
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

/** Route to update an existing quote by id. */
router.put('/:id', async (req, res) => {
    try {
        const updatedQuote = await Quote.getById(req.params.id);

        if (!updatedQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        updatedQuote.text = req.body.text;
        updatedQuote.characterId = req.body.characterId;
        updatedQuote.episode = req.body.episode;
        updatedQuote.season = req.body.season;

        await updatedQuote.save();
        res.json({ quote: updatedQuote });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to delete a quote by id. */
router.delete('/:id', async (req, res) => {
    try {
        const quoteId = req.params.id;
        const quote = await Quote.getById(quoteId);

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        await quote.delete();
        return res.json({
            message: 'Successfully deleted.',
            _id: quoteId,
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;



