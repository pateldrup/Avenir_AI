const express = require('express');
const { scrapeJobUrl, analyzeGap, getAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/scrape', protect, scrapeJobUrl);
router.post('/gap', protect, analyzeGap);
router.get('/:id', protect, getAnalysis);

module.exports = router;
