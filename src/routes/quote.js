const express = require('express');
const router = express.Router();
const db = require('../firebase');
const quotesRef = db.collection('quotes');


/** Route to get all quotes. */
router.get('/', async (req, res) => {
    try {
        const quotesSnapshot = await quotesRef.get();
        const quotes = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ quotes })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to get all quotes by a specific character. */
router.get('/character/:characterId', async (req, res) => {
    try {
        const quotesSnapshot = await quotesRef.where('characterId', '==', req.params.characterId).get();
        const quotes = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ quotes });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to add a new quote. */
router.post('/', async (req, res) => {
    try {
        const newQuote = req.body;
        const quoteDoc = await quotesRef.add(newQuote);
        const addedQuote = { id: quoteDoc.id, ...newQuote };
        res.status(201).json({ quote: addedQuote });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to update an existing quote by id */
router.put('/:quoteId', async (req, res) => {
    try {
        const quoteId = req.params.quoteId;
        const updatedQuoteData = req.body;
        const quoteDocRef = quotesRef.doc(quoteId);

        const quoteDoc = await quoteDocRef.get();
        if (!quoteDoc.exists) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        await quoteDocRef.update(updatedQuoteData);
        const updatedQuote = { id: quoteDoc.id, ...updatedQuoteData };

        res.json({ quote: updatedQuote });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to delete a quote by id. */
router.delete('/:quoteId', async (req, res) => {
    try {
        const quoteId = req.params.quoteId;
        const quoteDocRef = quotesRef.doc(quoteId);

        const quoteDoc = await quoteDocRef.get();
        if (!quoteDoc.exists) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        await quoteDocRef.delete();

        return res.json({
            'message': 'Successfully deleted.',
            '_id': quoteId
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
