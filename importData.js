const Character = require('./models/Character');
const Quote = require('./models/Quote');
const charactersData = require('./data/characters.json');
const quotesData = require('./data/quotes.json');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/schitty-api', { useNewUrlParser: true, useUnifiedTopology: true });

// Import characters and quotes
async function importData() {
  try {
    // Import characters
    const characters = await Character.insertMany(charactersData);

    // Iterate over quotes data
    for (const quoteData of quotesData) {
      // Find the associated character
      const character = characters.find(char => char.name === quoteData.characterName);

      // Create a new quote with the characterId
      const quote = new Quote({
        characterId: character._id,
        text: quoteData.text,
        season: quoteData.season,
        episode: quoteData.episode
      });

      // Save the quote to the database
      await quote.save();
    }

    console.log('Data import complete');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

importData();