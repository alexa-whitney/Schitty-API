const admin = require('firebase-admin');
const serviceAccount = require('./src/config/schitty-api-firebase-key.json');
const fs = require('fs');
const charactersData = JSON.parse(fs.readFileSync('data/characters.json', 'utf8'));
const quotesData = JSON.parse(fs.readFileSync('data/quotes.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Delete existing data in order to reseed:
async function deleteAllCharacters() {
    const charactersSnapshot = await db.collection('characters').get();
    const batch = db.batch();
  
    charactersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
  
    await batch.commit();
    console.log('Deleted all characters.');
}
  


// Add characters to Firebase DB:
async function addCharacters(charactersData) {
    const charactersRef = db.collection('characters');

    for (const character of charactersData) {
        const characterDoc = await charactersRef.add(character);
        console.log(`Added character ${character.name} with ID: ${characterDoc.id}`);
    }
}

// Add quotes to Firebase DB:
async function addQuotes(quotesData) {
    const quotesRef = db.collection('quotes');

    for (const quote of quotesData) {
        const quoteDoc = await quotesRef.add(quote);
        console.log(`Added quote "${quote.text}" with ID: ${quoteDoc.id}`);
    }
}

// Call the functions to populate the Firebase DB:
(async () => {
    await deleteAllCharacters();
    await addCharacters(charactersData);
    await addQuotes(quotesData);
})();
