const foodPartnerModel = require('../models/foodPartner.model');

// Get Food Partner Profile by ID
exports.getFoodPartnerProfile = async (req, res) => {
  try {
    const foodPartner = await foodPartnerModel.findById(req.params.id);
    if (!foodPartner) {
      return res.status(404).json({ message: 'Food Partner not found' });
    }
    res.json(foodPartner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};