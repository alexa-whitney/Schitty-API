const express = require('express');
const router = require('express').Router();
const admin = require('firebase-admin');
const db = require('../firebase');
const Character = require('../models/Character');
const charactersRef = db.collection('characters');
const quotesRef = db.collection('quotes');



/** Route to get all characters. */
router.get('/', async (req, res) => {
    console.log('Character route hit!');
    try {
        const characters = await Character.find();
        return res.json({ characters });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});



/** Route to get one character by id. */
router.get('/:characterId', async (req, res) => {
    console.log(req.params);
    try {
        const characterId = req.params.characterId;
        const characterDoc = await db.collection('characters').doc(characterId).get();

        if (!characterDoc.exists) {
            return res.status(404).json({ error: 'Character not found' });
        }

        const characterData = characterDoc.data();
        const character = { id: characterDoc.id, ...characterData };

        return res.render('character', { character });
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
