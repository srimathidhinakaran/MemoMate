const express = require('express');
const router = express.Router();
const { getElderlyUsers, getElderlyUserDetails } = require('../controllers/caregiverController');

router.get('/users', getElderlyUsers);
router.get('/user/:userId', getElderlyUserDetails);

module.exports = router;
