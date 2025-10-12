const express = require('express');
const multer = require('multer');
const path = require('path');
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/crops/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Get all crops for user
// @route   GET /api/crops
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id, isActive: true })
      .sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      farmer: req.user.id
    };

    const crop = new Crop(cropData);
    const savedCrop = await crop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    Object.assign(crop, req.body);
    const updatedCrop = await crop.save();
    res.json(updatedCrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Upload crop image
// @route   POST /api/crops/:id/images
// @access  Private
router.post('/:id/images', protect, upload.single('image'), async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageData = {
      url: `/uploads/crops/${req.file.filename}`,
      uploadDate: new Date(),
      analysis: {
        diseaseDetected: false,
        confidence: 0,
        diseases: [],
        recommendations: []
      }
    };

    // TODO: Integrate with AI service for disease detection
    // For now, simulate analysis
    const simulatedAnalysis = {
      diseaseDetected: Math.random() > 0.7,
      confidence: Math.random() * 100,
      diseases: Math.random() > 0.5 ? ['Leaf Blight'] : [],
      recommendations: ['Monitor closely', 'Ensure proper drainage']
    };

    imageData.analysis = simulatedAnalysis;
    crop.images.push(imageData);

    // Update health status based on analysis
    if (simulatedAnalysis.diseaseDetected && simulatedAnalysis.confidence > 70) {
      crop.healthStatus.status = 'warning';
      crop.healthStatus.issues.push('Potential disease detected');
      crop.healthStatus.recommendations.push(...simulatedAnalysis.recommendations);
    }

    crop.healthStatus.lastChecked = new Date();
    await crop.save();

    res.json({
      message: 'Image uploaded and analyzed successfully',
      image: imageData,
      healthStatus: crop.healthStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add sensor data
// @route   POST /api/crops/:id/sensor-data
// @access  Private
router.post('/:id/sensor-data', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const sensorData = {
      ...req.body,
      timestamp: new Date()
    };

    crop.sensorData.push(sensorData);

    // Analyze sensor data and update health status
    const { soilMoisture, soilPH, temperature, humidity } = sensorData;
    
    let status = 'healthy';
    let issues = [];
    let recommendations = [];

    if (soilMoisture < 30) {
      status = 'warning';
      issues.push('Low soil moisture');
      recommendations.push('Increase irrigation');
    }

    if (soilPH < 6.0 || soilPH > 7.5) {
      status = 'warning';
      issues.push('Soil pH imbalance');
      recommendations.push('Adjust soil pH');
    }

    if (temperature > 35) {
      status = 'warning';
      issues.push('High temperature stress');
      recommendations.push('Provide shade or increase watering');
    }

    crop.healthStatus = {
      status,
      lastChecked: new Date(),
      issues,
      recommendations
    };

    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add irrigation record
// @route   POST /api/crops/:id/irrigation
// @access  Private
router.post('/:id/irrigation', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    crop.irrigationSchedule.push(req.body);
    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add expense record
// @route   POST /api/crops/:id/expenses
// @access  Private
router.post('/:id/expenses', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    crop.expenses.push({
      ...req.body,
      date: req.body.date || new Date()
    });
    
    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get crop analytics
// @route   GET /api/crops/:id/analytics
// @access  Private
router.get('/:id/analytics', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Calculate analytics
    const totalExpenses = crop.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgSoilMoisture = crop.sensorData.length > 0 
      ? crop.sensorData.reduce((sum, data) => sum + (data.soilMoisture || 0), 0) / crop.sensorData.length 
      : 0;
    
    const analytics = {
      totalExpenses,
      avgSoilMoisture: Math.round(avgSoilMoisture),
      totalIrrigations: crop.irrigationSchedule.length,
      healthScore: crop.healthStatus.status === 'healthy' ? 85 : 
                   crop.healthStatus.status === 'warning' ? 60 : 30,
      daysPlanted: Math.floor((new Date() - new Date(crop.plantingDate)) / (1000 * 60 * 60 * 24)),
      recentSensorData: crop.sensorData.slice(-7), // Last 7 readings
      expenseBreakdown: crop.expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {})
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      farmer: req.user.id 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    crop.isActive = false;
    await crop.save();
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
