const express = require('express');
const { registerLocal } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerLocal);

module.exports = router;
