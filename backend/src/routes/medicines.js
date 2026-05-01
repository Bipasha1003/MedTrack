const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');

// All routes require login
router.get('/',      auth, getMedicines);
router.get('/:id',   auth, getMedicine);
router.post('/',     auth, addMedicine);
router.put('/:id',   auth, updateMedicine);
router.delete('/:id',auth, deleteMedicine);

module.exports = router;