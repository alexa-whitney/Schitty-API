const admin = require('firebase-admin');
const serviceAccount = require('./config/schitty-api-firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://schitty-api-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

module.exports = db;