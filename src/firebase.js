const admin = require('firebase-admin');
const serviceAccount = require('./config/schitty-api-firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = admin.firestore();

module.exports = db;