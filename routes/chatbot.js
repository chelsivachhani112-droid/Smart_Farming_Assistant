const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get chatbot response
// @route   POST /api/chatbot/message
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const { message, language = 'en', context } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // In a real implementation, you would integrate with an AI service like OpenAI
    // For now, we'll provide rule-based responses
    const response = await generateChatbotResponse(message, language, context, req.user);

    res.json({
      response: response.text,
      suggestions: response.suggestions,
      language,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get conversation history
// @route   GET /api/chatbot/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    // In a real app, you'd store conversation history in database
    // For now, return mock data
    const history = [
      {
        id: 1,
        message: 'What fertilizer should I use for wheat?',
        response: 'For wheat crops, I recommend using NPK fertilizer with a ratio of 12:32:16 during sowing, followed by urea application during tillering stage.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        language: 'en'
      },
      {
        id: 2,
        message: 'How often should I water tomatoes?',
        response: 'Tomatoes need consistent watering. Water deeply 2-3 times per week, providing about 1-2 inches of water weekly. Avoid overhead watering to prevent diseases.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        language: 'en'
      }
    ];

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get chatbot capabilities
// @route   GET /api/chatbot/capabilities
// @access  Private
router.get('/capabilities', protect, async (req, res) => {
  try {
    const capabilities = {
      languages: [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'kn', name: 'Kannada' },
        { code: 'bn', name: 'Bengali' }
      ],
      topics: [
        {
          category: 'Crop Management',
          topics: [
            'Planting and sowing',
            'Fertilizer recommendations',
            'Pest and disease control',
            'Irrigation scheduling',
            'Harvest timing'
          ]
        },
        {
          category: 'Weather & Climate',
          topics: [
            'Weather forecasts',
            'Seasonal planning',
            'Climate adaptation',
            'Drought management',
            'Flood protection'
          ]
        },
        {
          category: 'Market Information',
          topics: [
            'Crop prices',
            'Market trends',
            'Selling strategies',
            'Quality standards',
            'Transportation'
          ]
        },
        {
          category: 'Government Schemes',
          topics: [
            'Subsidies and grants',
            'Insurance schemes',
            'Loan programs',
            'Training programs',
            'Certification processes'
          ]
        },
        {
          category: 'Technology & Tools',
          topics: [
            'Farm equipment',
            'Mobile apps',
            'IoT sensors',
            'Precision farming',
            'Organic farming'
          ]
        }
      ],
      features: [
        'Voice input and output',
        'Image analysis for crop diseases',
        'Multilingual support',
        'Personalized recommendations',
        'Real-time weather integration',
        'Market price updates',
        'Government scheme information'
      ]
    };

    res.json(capabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Analyze crop image
// @route   POST /api/chatbot/analyze-image
// @access  Private
router.post('/analyze-image', protect, async (req, res) => {
  try {
    const { imageUrl, cropType } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // In a real implementation, you would use AI/ML services for image analysis
    // For now, provide mock analysis
    const analysis = {
      cropType: cropType || 'Unknown',
      healthStatus: 'Healthy',
      confidence: 85,
      detectedIssues: [],
      recommendations: [
        'Crop appears healthy',
        'Continue current care routine',
        'Monitor for any changes'
      ],
      diseaseDetected: false,
      pestDetected: false,
      nutritionDeficiency: false
    };

    // Simulate some random issues for demo
    if (Math.random() > 0.7) {
      analysis.healthStatus = 'Warning';
      analysis.detectedIssues = ['Possible leaf spot disease'];
      analysis.diseaseDetected = true;
      analysis.recommendations = [
        'Apply fungicide spray',
        'Improve air circulation',
        'Reduce watering frequency',
        'Remove affected leaves'
      ];
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get quick suggestions
// @route   GET /api/chatbot/suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const { category } = req.query;

    const allSuggestions = {
      general: [
        'What crops should I plant this season?',
        'How do I improve soil health?',
        'What are the current market prices?',
        'How to apply for government subsidies?'
      ],
      crops: [
        'Best fertilizer for wheat?',
        'When to harvest tomatoes?',
        'How to control pests in rice?',
        'Organic farming techniques?'
      ],
      weather: [
        'Will it rain this week?',
        'Best time to plant crops?',
        'How to protect crops from frost?',
        'Drought management tips?'
      ],
      market: [
        'Current wheat prices?',
        'Best time to sell crops?',
        'How to find buyers?',
        'Quality standards for export?'
      ],
      government: [
        'Available subsidies for farmers?',
        'How to get crop insurance?',
        'Loan schemes for agriculture?',
        'Training programs available?'
      ]
    };

    const suggestions = category ? allSuggestions[category] || [] : allSuggestions.general;

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate chatbot responses
async function generateChatbotResponse(message, language, context, user) {
  const lowerMessage = message.toLowerCase();
  
  // Weather-related queries
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
    return {
      text: `Based on current weather data for your location, here's what I can tell you: The temperature is around 28°C with 65% humidity. There's a chance of rain in the next 2 days. I recommend checking the detailed weather forecast in the Weather section for better planning.`,
      suggestions: [
        'Show detailed weather forecast',
        'Best crops for current weather',
        'Irrigation tips for rainy season'
      ]
    };
  }

  // Crop-related queries
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return {
      text: `For crop-related advice, I can help you with planting schedules, fertilizer recommendations, and pest control. Based on your location and the current season, I suggest considering crops like wheat, rice, or vegetables. Would you like specific advice for any particular crop?`,
      suggestions: [
        'Wheat farming tips',
        'Rice cultivation guide',
        'Vegetable farming advice',
        'Organic farming methods'
      ]
    };
  }

  // Fertilizer queries
  if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return {
      text: `For fertilizer recommendations, I need to know your crop type and soil condition. Generally, NPK fertilizers work well for most crops. For organic options, consider compost, vermicompost, or bio-fertilizers. Always do a soil test before applying fertilizers.`,
      suggestions: [
        'NPK fertilizer guide',
        'Organic fertilizer options',
        'Soil testing importance',
        'Fertilizer application timing'
      ]
    };
  }

  // Market price queries
  if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
    return {
      text: `Current market prices vary by location and crop quality. I recommend checking the Marketplace section for real-time prices. Generally, wheat is trading at ₹2,100-2,300 per quintal, and rice at ₹2,800-3,200 per quintal. Prices fluctuate based on demand and quality.`,
      suggestions: [
        'View current market prices',
        'Best time to sell crops',
        'Quality improvement tips',
        'Find nearby buyers'
      ]
    };
  }

  // Government scheme queries
  if (lowerMessage.includes('subsidy') || lowerMessage.includes('government') || lowerMessage.includes('scheme')) {
    return {
      text: `There are several government schemes available for farmers including PM-KISAN, crop insurance, and fertilizer subsidies. You can apply online through the respective portals. I can help you understand eligibility criteria and application processes.`,
      suggestions: [
        'PM-KISAN scheme details',
        'Crop insurance information',
        'Fertilizer subsidy application',
        'Loan schemes for farmers'
      ]
    };
  }

  // Disease/pest queries
  if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
    return {
      text: `For disease and pest identification, I recommend uploading a photo of the affected crop. Common issues include leaf spot, aphids, and fungal infections. Prevention is better than cure - maintain proper spacing, use resistant varieties, and follow integrated pest management practices.`,
      suggestions: [
        'Upload crop photo for analysis',
        'Common crop diseases',
        'Organic pest control methods',
        'Integrated pest management'
      ]
    };
  }

  // Irrigation queries
  if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('drip')) {
    return {
      text: `Proper irrigation is crucial for crop success. Drip irrigation is most efficient, saving 30-50% water. For most crops, water deeply but less frequently. Check soil moisture before watering. Consider mulching to retain moisture.`,
      suggestions: [
        'Drip irrigation setup',
        'Water scheduling tips',
        'Soil moisture testing',
        'Water conservation methods'
      ]
    };
  }

  // Default response
  return {
    text: `Hello! I'm your Smart Farming Assistant. I can help you with crop management, weather information, market prices, government schemes, and much more. What would you like to know about farming today?`,
    suggestions: [
      'Crop recommendations for my area',
      'Current weather forecast',
      'Market price updates',
      'Government schemes for farmers'
    ]
  };
}

module.exports = router;
