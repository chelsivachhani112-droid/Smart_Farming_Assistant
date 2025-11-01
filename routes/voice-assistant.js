const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get voice assistant response
// @route   POST /api/voice-assistant/query
// @access  Private
router.post('/query', protect, async (req, res) => {
  try {
    const { query, language = 'hi' } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Call Gemini API
    const response = await callGeminiAPI(query, language);

    res.json({
      query,
      response: response.text,
      language,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Voice assistant error:', error);
    res.status(500).json({ message: 'Failed to process voice query', error: error.message });
  }
});

// @desc    Get weather via voice
// @route   GET /api/voice-assistant/weather
// @access  Private
router.get('/weather', protect, async (req, res) => {
  try {
    const { lat, lon, language = 'hi' } = req.query;

    const latitude = lat || req.user.location?.coordinates?.latitude || 28.6139;
    const longitude = lon || req.user.location?.coordinates?.longitude || 77.2090;

    if (process.env.WEATHER_API_KEY) {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

      const weatherData = weatherResponse.data;
      const voiceResponse = generateWeatherVoiceResponse(weatherData, language);

      res.json({
        weather: weatherData,
        voiceResponse: voiceResponse,
        language
      });
    } else {
      res.json({
        message: 'Weather API key not configured',
        voiceResponse: 'मौसम API कॉन्फ़िगर नहीं है। कृपया API की सेटअप करें।'
      });
    }
  } catch (error) {
    console.error('Weather voice error:', error);
    res.status(500).json({ message: 'Failed to fetch weather', error: error.message });
  }
});

// @desc    Get market prices via voice
// @route   GET /api/voice-assistant/market-prices
// @access  Private
router.get('/market-prices', protect, async (req, res) => {
  try {
    const { language = 'hi' } = req.query;

    // Mock market prices (integrate with real API later)
    const prices = {
      wheat: { price: 2200, unit: 'per quintal', change: '+2%' },
      rice: { price: 3000, unit: 'per quintal', change: '+1%' },
      cotton: { price: 5500, unit: 'per quintal', change: '-1%' },
      sugarcane: { price: 320, unit: 'per quintal', change: '+0.5%' }
    };

    const voiceResponse = generateMarketVoiceResponse(prices, language);

    res.json({
      prices,
      voiceResponse: voiceResponse,
      language
    });
  } catch (error) {
    console.error('Market prices voice error:', error);
    res.status(500).json({ message: 'Failed to fetch market prices', error: error.message });
  }
});

// @desc    Get crop recommendations via voice
// @route   POST /api/voice-assistant/crop-recommendation
// @access  Private
router.post('/crop-recommendation', protect, async (req, res) => {
  try {
    const { season, soilType, rainfall, language = 'hi' } = req.body;

    const recommendations = generateCropRecommendations(season, soilType, rainfall);
    const voiceResponse = generateCropVoiceResponse(recommendations, language);

    res.json({
      recommendations,
      voiceResponse: voiceResponse,
      language
    });
  } catch (error) {
    console.error('Crop recommendation error:', error);
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
});

// @desc    Analyze crop image via voice
// @route   POST /api/voice-assistant/analyze-crop
// @access  Private
router.post('/analyze-crop', protect, async (req, res) => {
  try {
    const { imageUrl, cropType, language = 'hi' } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Call Gemini API for image analysis
    const analysis = await analyzeImageWithGemini(imageUrl, cropType);
    const voiceResponse = generateAnalysisVoiceResponse(analysis, language);

    res.json({
      analysis,
      voiceResponse: voiceResponse,
      language
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze image', error: error.message });
  }
});

// Helper Functions

async function callGeminiAPI(query, language) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        text: language === 'hi' 
          ? 'Gemini API कॉन्फ़िगर नहीं है। कृपया API की सेटअप करें।'
          : 'Gemini API is not configured. Please set up the API.'
      };
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: language === 'hi'
              ? `आप एक कृषि सहायक AI हैं। इस प्रश्न का उत्तर सरल और स्पष्ट हिंदी में दें:\n${query}`
              : `You are a farming assistant AI. Answer this question in simple English:\n${query}`
          }]
        }]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return { text };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return {
      text: language === 'hi'
        ? 'क्षमा करें, मैं अभी उत्तर नहीं दे सकता। कृपया बाद में कोशिश करें।'
        : 'Sorry, I cannot answer right now. Please try again later.'
    };
  }
}

function generateWeatherVoiceResponse(weatherData, language) {
  const temp = Math.round(weatherData.main.temp);
  const condition = weatherData.weather[0].main;
  const humidity = weatherData.main.humidity;
  const windSpeed = Math.round(weatherData.wind.speed);

  if (language === 'hi') {
    return `आपके क्षेत्र में मौसम: तापमान ${temp} डिग्री सेल्सियस है। ${condition} की स्थिति है। नमी ${humidity}% है और हवा की गति ${windSpeed} किलोमीटर प्रति घंटा है।`;
  } else {
    return `Weather in your area: Temperature is ${temp}°C. Condition is ${condition}. Humidity is ${humidity}% and wind speed is ${windSpeed} km/h.`;
  }
}

function generateMarketVoiceResponse(prices, language) {
  if (language === 'hi') {
    return `गेहूं की कीमत ${prices.wheat.price} रुपये प्रति क्विंटल है। चावल की कीमत ${prices.rice.price} रुपये है। कपास की कीमत ${prices.cotton.price} रुपये है। गन्ने की कीमत ${prices.sugarcane.price} रुपये है।`;
  } else {
    return `Wheat price is ${prices.wheat.price} rupees per quintal. Rice price is ${prices.rice.price} rupees. Cotton price is ${prices.cotton.price} rupees. Sugarcane price is ${prices.sugarcane.price} rupees.`;
  }
}

function generateCropRecommendations(season, soilType, rainfall) {
  const recommendations = {
    summer: ['गेहूं', 'जौ', 'मटर'],
    monsoon: ['चावल', 'मक्का', 'कपास'],
    winter: ['गेहूं', 'सरसों', 'दालें']
  };

  return recommendations[season] || ['गेहूं', 'चावल', 'मक्का'];
}

function generateCropVoiceResponse(recommendations, language) {
  if (language === 'hi') {
    return `आपके लिए सुझाए गए फसलें: ${recommendations.join(', ')}। ये फसलें आपकी मिट्टी और मौसम के लिए उपयुक्त हैं।`;
  } else {
    return `Recommended crops for you: ${recommendations.join(', ')}. These crops are suitable for your soil and weather conditions.`;
  }
}

function generateAnalysisVoiceResponse(analysis, language) {
  if (language === 'hi') {
    return `आपकी फसल की स्वास्थ्य स्थिति: ${analysis.healthStatus}। आत्मविश्वास स्तर: ${analysis.confidence}%। सिफारिशें: ${analysis.recommendations.join(', ')}`;
  } else {
    return `Your crop health status: ${analysis.healthStatus}. Confidence level: ${analysis.confidence}%. Recommendations: ${analysis.recommendations.join(', ')}`;
  }
}

async function analyzeImageWithGemini(imageUrl, cropType) {
  // Mock analysis - integrate with actual Gemini Vision API
  return {
    healthStatus: 'Healthy',
    confidence: 85,
    detectedIssues: [],
    recommendations: ['Continue current care routine', 'Monitor for any changes'],
    diseaseDetected: false,
    pestDetected: false
  };
}

module.exports = router;
