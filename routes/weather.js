const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    const latitude = lat || req.user.location?.coordinates?.latitude || 28.6139;
    const longitude = lon || req.user.location?.coordinates?.longitude || 77.2090;
    
    await getWeatherData(latitude, longitude, res);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ message: 'Failed to fetch weather data', error: error.message });
  }
});

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Private
router.get('/forecast', protect, async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    
    const defaultLat = req.user.location?.coordinates?.latitude || 28.6139;
    const defaultLon = req.user.location?.coordinates?.longitude || 77.2090;
    
    const latitude = lat || defaultLat;
    const longitude = lon || defaultLon;
    
    if (process.env.WEATHER_API_KEY) {
      // Use OpenWeatherMap API
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      
      const forecast = response.data.list.slice(0, days * 8).map(item => ({
        date: new Date(item.dt * 1000),
        temperature: {
          min: item.main.temp_min,
          max: item.main.temp_max,
          current: item.main.temp
        },
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: item.rain ? item.rain['3h'] || 0 : 0
      }));
      
      res.json({
        location: {
          latitude,
          longitude,
          city: response.data.city?.name || 'Unknown'
        },
        forecast
      });
    } else {
      // Return mock data
      const mockForecast = generateMockForecast(days);
      res.json({
        location: {
          latitude,
          longitude,
          city: 'Demo Location'
        },
        forecast: mockForecast
      });
    }
  } catch (error) {
    console.error('Weather forecast error:', error.message);
    // Return mock data on error
    const mockForecast = generateMockForecast(req.query.days || 5);
    res.json({
      location: {
        latitude: req.query.lat || 28.6139,
        longitude: req.query.lon || 77.2090,
        city: 'Demo Location'
      },
      forecast: mockForecast
    });
  }
});

// @desc    Get weather alerts
// @route   GET /api/weather/alerts
// @access  Private
router.get('/alerts', protect, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    const defaultLat = req.user.location?.coordinates?.latitude || 28.6139;
    const defaultLon = req.user.location?.coordinates?.longitude || 77.2090;
    
    const latitude = lat || defaultLat;
    const longitude = lon || defaultLon;
    
    // Mock weather alerts - in production, integrate with weather service
    const alerts = [
      {
        id: 1,
        type: 'heavy_rain',
        severity: 'moderate',
        title: 'Heavy Rain Expected',
        description: 'Heavy rainfall expected in the next 24 hours. Consider protecting crops.',
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        endTime: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours from now
        recommendations: [
          'Cover sensitive crops',
          'Ensure proper drainage',
          'Postpone harvesting activities'
        ]
      },
      {
        id: 2,
        type: 'high_temperature',
        severity: 'low',
        title: 'High Temperature Alert',
        description: 'Temperature expected to reach 38°C tomorrow.',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        recommendations: [
          'Increase irrigation frequency',
          'Provide shade for livestock',
          'Avoid midday field work'
        ]
      }
    ];
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get agricultural weather insights
// @route   GET /api/weather/insights
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const { cropType } = req.query;
    
    // Mock insights based on current weather and crop type
    const insights = {
      irrigation: {
        recommendation: 'Moderate irrigation needed',
        frequency: 'Every 2-3 days',
        amount: '25-30mm per session',
        reasoning: 'Based on current humidity levels and temperature forecast'
      },
      planting: {
        suitability: 'Good',
        bestDays: ['Tomorrow', 'Day after tomorrow'],
        reasoning: 'Favorable temperature and humidity conditions'
      },
      harvesting: {
        suitability: 'Avoid next 2 days',
        bestDays: ['In 3 days', 'In 4 days'],
        reasoning: 'Rain expected in next 48 hours'
      },
      pestManagement: {
        risk: 'Medium',
        recommendations: [
          'Monitor for fungal diseases due to high humidity',
          'Apply preventive treatments before rain'
        ]
      },
      fertilizer: {
        application: 'Postpone',
        reasoning: 'Heavy rain expected - nutrients may wash away',
        bestTime: 'After rain stops in 3 days'
      }
    };
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get weather data
async function getWeatherData(lat, lon, res) {
  try {
    if (process.env.WEATHER_API_KEY) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      
      const weatherData = {
        location: {
          latitude: lat,
          longitude: lon,
          city: response.data.name,
          country: response.data.sys.country
        },
        current: {
          temperature: response.data.main.temp,
          feelsLike: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          windSpeed: response.data.wind.speed,
          windDirection: response.data.wind.deg,
          visibility: response.data.visibility / 1000, // Convert to km
          uvIndex: 0, // Not available in current weather API
          condition: response.data.weather[0].main,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon
        },
        sun: {
          sunrise: new Date(response.data.sys.sunrise * 1000),
          sunset: new Date(response.data.sys.sunset * 1000)
        },
        timestamp: new Date()
      };
      
      res.json(weatherData);
    } else {
      // Return mock data when API key is not available
      const mockWeather = {
        location: {
          latitude: lat,
          longitude: lon,
          city: 'Demo City',
          country: 'IN'
        },
        current: {
          temperature: 28 + Math.random() * 10,
          feelsLike: 30 + Math.random() * 8,
          humidity: 60 + Math.random() * 20,
          pressure: 1010 + Math.random() * 20,
          windSpeed: 5 + Math.random() * 10,
          windDirection: Math.random() * 360,
          visibility: 8 + Math.random() * 2,
          uvIndex: Math.floor(Math.random() * 11),
          condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'Partly cloudy',
          icon: '02d'
        },
        sun: {
          sunrise: new Date(Date.now() - 6 * 60 * 60 * 1000),
          sunset: new Date(Date.now() + 12 * 60 * 60 * 1000)
        },
        timestamp: new Date()
      };
      
      res.json(mockWeather);
    }
  } catch (error) {
    throw new Error(`Weather API error: ${error.message}`);
  }
}

// Helper function to generate mock forecast
function generateMockForecast(days) {
  const forecast = [];
  const baseTemp = 25;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const temp = baseTemp + Math.random() * 10 - 5;
    const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    forecast.push({
      date,
      temperature: {
        min: temp - 3,
        max: temp + 5,
        current: temp
      },
      humidity: 50 + Math.random() * 30,
      pressure: 1010 + Math.random() * 20,
      windSpeed: 5 + Math.random() * 10,
      windDirection: Math.random() * 360,
      condition,
      description: condition.toLowerCase(),
      icon: '02d',
      precipitation: condition === 'Rain' ? Math.random() * 10 : 0
    });
  }
  
  return forecast;
}

module.exports = router;
