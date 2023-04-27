const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const Quote = require('../models/Quote');

/** Route to get all characters. */
router.get('/', async (req, res) => {
    try {
        const characters = await Character.find();
        return res.json({ characters })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to get one character by id. */
router.get('/:characterId', async (req, res) => {
    try {
        const character = await Character.findById(req.params.characterId);
        return res.json({ character })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to add a new character. */
router.post('/', async (req, res) => {
    try {
        const newCharacter = new Character(req.body);
        await newCharacter.save();
        res.status(201).json({ character: newCharacter });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to update an existing character by id. */
router.put('/:characterId', async (req, res) => {
    try {
        const updatedCharacter = await Character.findByIdAndUpdate(req.params.characterId, req.body, { new: true });
        if (!updatedCharacter) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json({ character: updatedCharacter });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to delete a character by id. */
router.delete('/:characterId', async (req, res) => {
    try {
        const character = await Character.findById(req.params.characterId);

        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Remove all associated quotes before deleting the character
        await Quote.deleteMany({ characterId: req.params.characterId });

        await character.remove();

        return res.json({
            'message': 'Successfully deleted.',
            '_id': req.params.characterId
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
