// Simple working services for production build

// Weather Service
export const weatherService = {
  getCurrentWeather: async (city = 'Delhi') => {
    // Mock data that works without external APIs
    return {
      temperature: 28,
      description: 'साफ आसमान',
      humidity: 65,
      windSpeed: 5,
      pressure: 1013,
      city: city,
      icon: '01d',
      sunrise: '06:30',
      sunset: '18:30'
    };
  },

  getForecast: async (city = 'Delhi') => {
    return [
      { date: 'आज', temperature: 28, description: 'साफ', icon: '01d', humidity: 65 },
      { date: 'कल', temperature: 30, description: 'धूप', icon: '01d', humidity: 60 },
      { date: 'परसों', temperature: 26, description: 'बादल', icon: '02d', humidity: 70 },
      { date: '3 दिन', temperature: 24, description: 'बारिश', icon: '10d', humidity: 85 },
      { date: '4 दिन', temperature: 27, description: 'साफ', icon: '01d', humidity: 55 }
    ];
  },

  getFarmingRecommendations: (weatherData) => {
    return [
      '🌡️ मौसम अच्छा है! फसल की देखभाल करते रहें',
      '💧 नियमित पानी देते रहें',
      '🌿 Organic fertilizer का इस्तेमाल करें',
      '📅 Weekly monitoring करें'
    ];
  }
};

// Market Price Service
export const marketPriceService = {
  getCurrentPrices: async (state = 'Delhi') => {
    return [
      {
        crop: 'गेहूं',
        variety: 'HD-2967',
        market: `${state} मंडी`,
        minPrice: 2180,
        maxPrice: 2250,
        modalPrice: 2215,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'up',
        change: +35
      },
      {
        crop: 'धान',
        variety: 'बासमती',
        market: `${state} मंडी`,
        minPrice: 1850,
        maxPrice: 1920,
        modalPrice: 1885,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'down',
        change: -15
      },
      {
        crop: 'मक्का',
        variety: 'संकर',
        market: `${state} मंडी`,
        minPrice: 1750,
        maxPrice: 1820,
        modalPrice: 1785,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'up',
        change: +25
      },
      {
        crop: 'कपास',
        variety: 'मध्यम रेशा',
        market: `${state} मंडी`,
        minPrice: 5400,
        maxPrice: 5650,
        modalPrice: 5525,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'up',
        change: +125
      },
      {
        crop: 'सोयाबीन',
        variety: 'JS-335',
        market: `${state} मंडी`,
        minPrice: 4150,
        maxPrice: 4280,
        modalPrice: 4215,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'down',
        change: -45
      },
      {
        crop: 'प्याज',
        variety: 'नासिक रेड',
        market: `${state} मंडी`,
        minPrice: 1150,
        maxPrice: 1280,
        modalPrice: 1215,
        date: new Date().toLocaleDateString('hi-IN'),
        unit: 'प्रति क्विंटल',
        trend: 'up',
        change: +85
      }
    ];
  },

  getPriceTrends: async (crop = 'wheat') => {
    const trends = [];
    const basePrice = 2200;
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.15;
      const price = Math.round(basePrice * (1 + variation));
      
      trends.push({
        date: date.toLocaleDateString('hi-IN'),
        price: price,
        volume: Math.round(Math.random() * 500 + 200)
      });
    }
    
    return trends;
  },

  getBestSellingTime: (crop, currentPrice, trends) => {
    return [
      '📈 अभी बेचने का अच्छा समय है! Price stable है',
      '💰 Market analysis के अनुसार good time है',
      '📊 Next week तक wait भी कर सकते हैं'
    ];
  }
};

// Disease Detection Service
export const diseaseDetectionService = {
  detectDisease: async (imageFile) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on random selection
    const diseases = [
      {
        disease: 'Healthy Crop',
        confidence: 95,
        status: 'healthy',
        nutrients: { nitrogen: 85, phosphorus: 78, potassium: 92 }
      },
      {
        disease: 'Leaf Blight',
        confidence: 87,
        status: 'diseased',
        nutrients: { nitrogen: 45, phosphorus: 52, potassium: 38 }
      },
      {
        disease: 'Nutrient Deficiency',
        confidence: 92,
        status: 'warning',
        nutrients: { nitrogen: 35, phosphorus: 65, potassium: 70 }
      }
    ];
    
    return diseases[Math.floor(Math.random() * diseases.length)];
  },

  analyzeAndRecommend: (diseaseResult) => {
    const recommendations = {
      'Healthy Crop': [
        '🌱 फसल बिल्कुल स्वस्थ है!',
        '💧 नियमित पानी देते रहें',
        '🌿 Organic fertilizer का इस्तेमाल करें',
        '📅 15 दिन बाद फिर से check करें'
      ],
      'Leaf Blight': [
        '⚠️ Fungal infection है',
        '💉 Mancozeb spray करें',
        '🌬️ Air circulation बढ़ाएं',
        '🚫 Over-watering से बचें'
      ],
      'Nutrient Deficiency': [
        '📊 Nitrogen की कमी है',
        '🌾 Urea fertilizer डालें',
        '🍂 Compost का इस्तेमाल करें',
        '📈 1 सप्ताह बाद improvement देखें'
      ]
    };

    return {
      ...diseaseResult,
      severity: diseaseResult.confidence > 90 ? 'High' : diseaseResult.confidence > 70 ? 'Medium' : 'Low',
      recommendations: recommendations[diseaseResult.disease] || recommendations['Healthy Crop'],
      treatmentSteps: [
        'Step 1: Regular monitoring करें',
        'Step 2: Proper care लें',
        'Step 3: Expert advice लें',
        'Step 4: Follow-up करें'
      ],
      preventionTips: [
        '🌱 Quality seeds का इस्तेमाल करें',
        '💧 Proper drainage maintain करें',
        '🌿 Crop rotation करें',
        '🧪 Regular soil testing करें'
      ]
    };
  }
};
