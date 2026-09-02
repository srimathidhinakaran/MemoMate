const express = require('express');
const router = express.Router();
const { createSession, getSessionsByUser } = require('../controllers/sessionController');

router.post('/', createSession);
router.get('/:userId', getSessionsByUser);

module.exports = router;
