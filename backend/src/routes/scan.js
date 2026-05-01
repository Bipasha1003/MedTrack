const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { scanMedicine, uploadMiddleware } = require('../controllers/scanController');

router.post('/', auth, uploadMiddleware, scanMedicine);

module.exports = router;