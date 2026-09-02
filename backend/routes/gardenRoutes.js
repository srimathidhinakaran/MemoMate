const express = require('express');
const router = express.Router();
const { getGardenProgress, updateGardenProgress } = require('../controllers/gardenController');

router.get('/:userId', getGardenProgress);
router.put('/:userId', updateGardenProgress);

module.exports = router;
