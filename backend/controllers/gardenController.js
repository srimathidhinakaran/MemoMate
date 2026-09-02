const GardenProgress = require('../models/GardenProgress');

exports.getGardenProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    let garden = await GardenProgress.findOne({ userId });
    
    if (!garden) {
      garden = await GardenProgress.create({
        userId,
        plants: 3,
        flowers: 5,
        trees: 2,
        streak: 4,
        totalActivities: 8
      });
    }

    res.json(garden);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching garden progress', error: error.message });
  }
};

exports.updateGardenProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const { action } = req.body; // e.g. 'water', 'plant', 'complete_activity'
    
    let garden = await GardenProgress.findOne({ userId });
    if (!garden) {
      garden = new GardenProgress({ userId });
    }

    if (action === 'water') {
      garden.flowers += 1;
    } else if (action === 'complete_activity') {
      garden.totalActivities += 1;
      garden.plants += 1;
      if (garden.totalActivities % 3 === 0) garden.flowers += 1;
      if (garden.totalActivities % 5 === 0) garden.trees += 1;
    }
    
    garden.lastUpdated = new Date();
    await garden.save();
    res.json(garden);
  } catch (error) {
    res.status(500).json({ message: 'Error updating garden progress', error: error.message });
  }
};
