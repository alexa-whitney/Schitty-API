const admin = require('firebase-admin');
const db = admin.firestore();

class Character {
  constructor(data) {
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.occupation = data.occupation;
    this.bio = data.bio;
  }

  static async getAll() {
    const snapshot = await db.collection('characters').get();
    const characters = snapshot.docs.map((doc) => new Character({ ...doc.data(), id: doc.id }));
    return characters;
  }

  static async getById(id) {
    const doc = await db.collection('characters').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return new Character({ ...doc.data(), id: doc.id });
  }

  async save() {
    const characterRef = db.collection('characters').doc();
    const data = { name: this.name, imageUrl: this.imageUrl, occupation: this.occupation, bio: this.bio };
    await characterRef.set(data, { merge: true });
    this.id = characterRef.id;
    return this;
  }

  async delete() {
    const characterRef = db.collection('characters').doc(this.id);
    await characterRef.delete();
  }
}

module.exports = Character;


