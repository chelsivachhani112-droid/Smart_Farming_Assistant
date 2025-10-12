const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  variety: String,
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: Date,
  fieldSize: {
    type: Number,
    required: true
  },
  location: {
    fieldName: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  healthStatus: {
    status: {
      type: String,
      enum: ['healthy', 'warning', 'critical', 'unknown'],
      default: 'unknown'
    },
    lastChecked: Date,
    issues: [String],
    recommendations: [String]
  },
  images: [{
    url: String,
    uploadDate: Date,
    analysis: {
      diseaseDetected: Boolean,
      confidence: Number,
      diseases: [String],
      recommendations: [String]
    }
  }],
  sensorData: [{
    timestamp: Date,
    soilMoisture: Number,
    soilPH: Number,
    temperature: Number,
    humidity: Number,
    lightIntensity: Number
  }],
  irrigationSchedule: [{
    date: Date,
    amount: Number,
    method: String,
    completed: Boolean
  }],
  fertilizers: [{
    name: String,
    type: String,
    applicationDate: Date,
    quantity: Number,
    cost: Number
  }],
  pesticides: [{
    name: String,
    type: String,
    applicationDate: Date,
    targetPest: String,
    quantity: Number,
    cost: Number
  }],
  expenses: [{
    category: String,
    description: String,
    amount: Number,
    date: Date
  }],
  notes: [{
    date: Date,
    content: String,
    images: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);
