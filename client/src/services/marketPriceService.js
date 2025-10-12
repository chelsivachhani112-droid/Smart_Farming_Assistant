// Market Price Service using free APIs
export const marketPriceService = {
  // Get current market prices
  getCurrentPrices: async (state = 'Delhi') => {
    try {
      // Try government API first
      const govData = await fetchGovernmentPrices(state);
      if (govData) return govData;
      
      // Fallback to mock data with realistic prices
      return getMockPriceData(state);
    } catch (error) {
      console.error('Market price fetch error:', error);
      return getMockPriceData(state);
    }
  },

  // Get price trends and predictions
  getPriceTrends: async (crop = 'wheat') => {
    try {
      const trends = await fetchPriceTrends(crop);
      return trends;
    } catch (error) {
      return getMockTrendData(crop);
    }
  },

  // Get best selling recommendations
  getBestSellingTime: (crop, currentPrice, trends) => {
    const recommendations = [];
    const avgPrice = trends.reduce((sum, item) => sum + item.price, 0) / trends.length;
    
    if (currentPrice > avgPrice * 1.1) {
      recommendations.push('📈 अभी बेचने का अच्छा समय है! Price high है');
      recommendations.push('💰 Current price average से 10% ज्यादा है');
    } else if (currentPrice < avgPrice * 0.9) {
      recommendations.push('⏳ थोड़ा wait करें, price बढ़ सकती है');
      recommendations.push('📊 Market analysis के अनुसार price low है');
    } else {
      recommendations.push('⚖️ Price stable है, आप चाहें तो बेच सकते हैं');
      recommendations.push('📈 Next week तक wait कर सकते हैं');
    }
    
    return recommendations;
  },

  // Get nearby mandis with prices
  getNearbyMandis: async (location = 'Delhi') => {
    return getMockMandiData(location);
  }
};

// Fetch from government price API (free)
const fetchGovernmentPrices = async (state) => {
  try {
    // Using data.gov.in API (free government data)
    const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=demo&format=json&filters[state]=${state}`);
    
    if (!response.ok) throw new Error('Government API failed');
    
    const data = await response.json();
    return processGovernmentData(data);
  } catch (error) {
    console.log('Government API not available, using backup...');
    return null;
  }
};

// Process government API data
const processGovernmentData = (data) => {
  if (!data.records || data.records.length === 0) return null;
  
  return data.records.slice(0, 10).map(record => ({
    crop: record.commodity || 'Unknown',
    variety: record.variety || 'Common',
    market: record.market || 'Local Market',
    minPrice: parseInt(record.min_price) || 0,
    maxPrice: parseInt(record.max_price) || 0,
    modalPrice: parseInt(record.modal_price) || 0,
    date: record.arrival_date || new Date().toLocaleDateString('hi-IN'),
    unit: 'प्रति क्विंटल',
    trend: Math.random() > 0.5 ? 'up' : 'down',
    change: Math.round((Math.random() - 0.5) * 200)
  }));
};

// Fetch price trends
const fetchPriceTrends = async (crop) => {
  // Mock API call - in real scenario, this would fetch historical data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateTrendData(crop));
    }, 1000);
  });
};

// Generate realistic trend data
const generateTrendData = (crop) => {
  const basePrice = getCropBasePrice(crop);
  const trends = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const price = Math.round(basePrice * (1 + variation));
    
    trends.push({
      date: date.toLocaleDateString('hi-IN'),
      price: price,
      volume: Math.round(Math.random() * 1000 + 500) // quintals
    });
  }
  
  return trends;
};

// Get base price for different crops
const getCropBasePrice = (crop) => {
  const basePrices = {
    'wheat': 2200,
    'rice': 1900,
    'corn': 1800,
    'sugarcane': 350,
    'cotton': 5500,
    'soybean': 4200,
    'mustard': 5800,
    'gram': 5200,
    'onion': 1200,
    'potato': 800,
    'tomato': 1500,
    'cabbage': 600
  };
  
  return basePrices[crop.toLowerCase()] || 2000;
};

// Mock price data with realistic Indian crop prices
const getMockPriceData = (state) => {
  const crops = [
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
    },
    {
      crop: 'आलू',
      variety: 'कुफरी बादशाह',
      market: `${state} मंडी`,
      minPrice: 750,
      maxPrice: 850,
      modalPrice: 800,
      date: new Date().toLocaleDateString('hi-IN'),
      unit: 'प्रति क्विंटल',
      trend: 'down',
      change: -25
    },
    {
      crop: 'टमाटर',
      variety: 'हाइब्रिड',
      market: `${state} मंडी`,
      minPrice: 1400,
      maxPrice: 1600,
      modalPrice: 1500,
      date: new Date().toLocaleDateString('hi-IN'),
      unit: 'प्रति क्विंटल',
      trend: 'up',
      change: +150
    }
  ];
  
  return crops;
};

// Mock trend data
const getMockTrendData = (crop) => {
  const basePrice = getCropBasePrice(crop);
  const trends = [];
  
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
};

// Mock mandi data
const getMockMandiData = (location) => {
  return [
    {
      name: `${location} मुख्य मंडी`,
      distance: '2.5 km',
      contact: '+91-9876543210',
      timings: '06:00 - 14:00',
      facilities: ['वेटिंग', 'ग्रेडिंग', 'पैकिंग'],
      avgPrice: '₹2,200/क्विंटल',
      rating: 4.5
    },
    {
      name: `${location} कृषि बाजार`,
      distance: '5.8 km',
      contact: '+91-9876543211',
      timings: '05:30 - 13:30',
      facilities: ['कोल्ड स्टोरेज', 'ट्रांसपोर्ट'],
      avgPrice: '₹2,180/क्विंटल',
      rating: 4.2
    },
    {
      name: `${location} फार्मर्स मार्केट`,
      distance: '8.2 km',
      contact: '+91-9876543212',
      timings: '06:30 - 15:00',
      facilities: ['डायरेक्ट सेलिंग', 'ऑनलाइन बिडिंग'],
      avgPrice: '₹2,250/क्विंटल',
      rating: 4.7
    }
  ];
};
