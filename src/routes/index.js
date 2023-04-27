const express = require('express')
const characterRoutes = require('./character.js')
const quoteRoutes = require('./quote.js')

const router = express.Router()

router.use('/characters', characterRoutes)
router.use('/quotes', quoteRoutes)

module.exports = router