const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller/index.js');
const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api', router);
const characterRoutes = require('./controller/character');
const quoteRoutes = require('./controller/quote');
app.use('/api/characters', characterRoutes);
app.use('/api/quotes', quoteRoutes);



// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;

