const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = require('../firebase');
const Character = require('../models/Character');
const charactersRef = db.collection('characters');

/** Route to get all characters. */
router.get('/', async (req, res) => {
    console.log('Characters route hit!');
    try {
        const characters = await Character.getAll();
        return res.json({ characters });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to get one character by id. */
router.get('/:id', async (req, res) => {
    console.log('Get character by id route hit!');
    try {
        const characterId = req.params.id;
        const characterDoc = await charactersRef.doc(characterId).get();

        if (!characterDoc.exists) {
            return res.status(404).json({ error: 'Character not found' });
        }

        const characterData = characterDoc.data();
        const character = { id: characterDoc.id, ...characterData };

        return res.json({ character });
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
router.put('/:id', async (req, res) => {
    try {
        const updatedCharacter = await Character.getById(req.params.id);
        if (!updatedCharacter) {
            return res.status(404).json({ error: 'Character not found' });
        }

        updatedCharacter.name = req.body.name;
        updatedCharacter.imageUrl = req.body.imageUrl;
        updatedCharacter.occupation = req.body.occupation;
        updatedCharacter.bio = req.body.bio;
    
        await updatedCharacter.save();
        res.json({ character: updatedCharacter });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

/** Route to delete a character by id. */
router.delete('/:id', async (req, res) => {
    try {
        const characterId = req.params.id;
        const characterName = req.body.name;
        const characterDoc = await charactersRef.doc(characterId).get();
        if (!characterDoc.exists) {
            return res.status(404).json({ error: 'Character not found' });
        }

        await charactersRef.doc(characterId).delete();
        return res.json({ message: `Character ${characterName} successfully deleted` });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;


