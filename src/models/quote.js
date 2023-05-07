const admin = require('firebase-admin');

const db = admin.database();

const quoteRef = db.ref('quotes');

const saveQuote = async (quoteData) => {
  const newQuoteRef = quoteRef.push();
  await newQuoteRef.set(quoteData);
  return newQuoteRef.key;
};

const getAllQuotes = async () => {
  const quotesSnapshot = await quoteRef.once('value');
  const quotes = [];
  quotesSnapshot.forEach((childSnapshot) => {
    const id = childSnapshot.key;
    const quote = childSnapshot.val();
    quote.id = id;
    quotes.push(quote);
  });
  return quotes;
};

const getQuoteById = async (id) => {
  const quoteSnapshot = await quoteRef.child(id).once('value');
  if (!quoteSnapshot.exists()) {
    throw new Error('Quote not found');
  }
  const quote = quoteSnapshot.val();
  quote.id = id;
  return quote;
};

const updateQuote = async (id, quoteData) => {
  const quoteRefToUpdate = quoteRef.child(id);
  await quoteRefToUpdate.update(quoteData);
  const updatedQuoteSnapshot = await quoteRefToUpdate.once('value');
  const updatedQuote = updatedQuoteSnapshot.val();
  updatedQuote.id = id;
  return updatedQuote;
};

const deleteQuote = async (id) => {
  const quoteRefToDelete = quoteRef.child(id);
  const quoteSnapshot = await quoteRefToDelete.once('value');
  if (!quoteSnapshot.exists()) {
    throw new Error('Quote not found');
  }
  await quoteRefToDelete.remove();
  return id;
};

module.exports = {
  saveQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};


