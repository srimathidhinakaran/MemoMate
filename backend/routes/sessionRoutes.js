const express = require('express');
const router = express.Router();
const { createSession, getSessionsByUser, getLiveActivities } = require('../controllers/sessionController');

router.post('/', createSession);
router.get('/live-activities', getLiveActivities);
router.get('/:userId', getSessionsByUser);

module.exports = router;
