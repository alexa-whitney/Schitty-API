const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: "Character", required: true },
    text: { type: String, required: true },
    season: Number,
    episode: Number
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
