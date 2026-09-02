const express = require('express');
const router = express.Router();
const { getLatestRecommendation, generateNewRecommendation } = require('../controllers/recommendationController');

router.get('/:userId', getLatestRecommendation);
router.post('/generate', generateNewRecommendation);

module.exports = router;
