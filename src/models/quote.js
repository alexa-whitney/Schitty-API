const admin = require('firebase-admin');
const db = admin.firestore();

class Quote {
  constructor(data) {
    this.id = data.id;
    this.text = data.text;
    this.characterId = data.characterId;
    this.episode = data.episode;
    this.season = data.season;
  }

  static async getAll() {
    const snapshot = await db.collection('quotes').get();
    const quotes = [];
    snapshot.forEach((doc) => {
      quotes.push(new Quote({ ...doc.data(), id: doc.id }));
    });
    return quotes;
  }

  static async getById(id) {
    const doc = await db.collection('quotes').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    data.id = doc.id;
    return new Quote(data);
  }

  async save() {
    const data = { text: this.text, characterId: this.characterId, episode: this.episode, season: this.season };
    if (this.id) {
      await db.collection('quotes').doc(this.id).set(data, { merge: true });
    } else {
      const quoteRef = await db.collection('quotes').add(data);
      this.id = quoteRef.id;
    }
    return this;
  }

  async delete() {
    const quoteRef = db.collection('quotes').doc(this.id);
    await quoteRef.delete();
  }
}

module.exports = Quote;

