const foodPartnerModel = require('../models/foodPartner.model');


exports.getFoodPartnerProfile = async (req, res) => {
  try {
    const foodPartner = await foodPartnerModel.findById(req.params.id);
    if (!foodPartner) {
      return res.status(404).json({ message: 'Food Partner not found' });
    }
    res.json({
      name:foodPartner.name,
      restaurantName:foodPartner.restaurantName,
      email:foodPartner.email,
      phone:foodPartner.phone,
      address:foodPartner.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};