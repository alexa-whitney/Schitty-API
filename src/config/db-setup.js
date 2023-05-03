// const mongoose = require('mongoose');
// require('dotenv/config')

// // connect to mongo db
// const mongoUri = process.env.MONGODB_URI
// // mongoose.connect(mongoUri)
// mongoose.connect("mongodb://localhost:27017/messages-db?authSource=admin", { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connection.on('error', () => {
//   console.log(error);
//   throw new Error(`unable to connect to database: ${mongoUri}`)
// })

// module.exports = mongoose.connection

const admin = require('firebase-admin');
// Required for side-effects
require("firebase/firestore");

// Replace the following path with the path to your downloaded JSON service account key
const serviceAccount = require('./schitty-api-firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
