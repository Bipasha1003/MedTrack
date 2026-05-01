const prisma = require('../lib/prisma');

// GET all medicines for logged in user
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      where: { userId: req.user.userId },
      orderBy: { expiryDate: 'asc' } // soonest expiring first
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch medicines' });
  }
};

// GET single medicine
exports.getMedicine = async (req, res) => {
  try {
    const medicine = await prisma.medicine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId // ensure user owns this medicine
      }
    });

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch medicine' });
  }
};

// POST add new medicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, dosage, category, quantity, expiryDate } = req.body;

    // Validate required fields
    if (!name || !expiryDate) {
      return res.status(400).json({ error: 'Name and expiry date are required' });
    }

    const medicine = await prisma.medicine.create({
      data: {
        userId: req.user.userId,
        name,
        dosage,
        category,
        quantity: parseInt(quantity) || 0,
        expiryDate: new Date(expiryDate)
      }
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Could not add medicine' });
  }
};

// PUT update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { name, dosage, category, quantity, expiryDate } = req.body;

    const medicine = await prisma.medicine.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.userId
      },
      data: {
        name,
        dosage,
        category,
        quantity: parseInt(quantity) || 0,
        expiryDate: new Date(expiryDate)
      }
    });

    res.json({ message: 'Medicine updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not update medicine' });
  }
};

// DELETE medicine
exports.deleteMedicine = async (req, res) => {
  try {
    await prisma.medicine.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete medicine' });
  }
};

// GET expiry status helper
exports.getExpiryStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0)   return { status: 'expired',  daysLeft, color: 'red'    };
  if (daysLeft <= 30) return { status: 'warning',  daysLeft, color: 'orange' };
  return                     { status: 'good',     daysLeft, color: 'green'  };
};