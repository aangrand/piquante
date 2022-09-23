const express = require('express');

const router = express.Router();
const sauceCtrl = require('.');

// Routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

module.exports = router;