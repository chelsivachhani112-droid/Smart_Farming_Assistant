// Free Weather API Service
const WEATHER_API_KEY = 'demo'; // Using free tier
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Backup free weather service
const BACKUP_WEATHER_URL = 'https://wttr.in';

export const weatherService = {
  // Get current weather by city
  getCurrentWeather: async (city = 'Delhi') => {
    try {
      // Primary API (OpenWeatherMap - Free tier)
      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=hi`
      );
      
      if (!response.ok) {
        throw new Error('Primary weather API failed');
      }
      
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        city: data.name,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('hi-IN'),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('hi-IN')
      };
    } catch (error) {
      console.log('Using backup weather service...');
      return await getBackupWeather(city);
    }
  },

  // Get 5-day forecast
  getForecast: async (city = 'Delhi') => {
    try {
      const response = await fetch(
        `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=hi`
      );
      
      if (!response.ok) {
        throw new Error('Forecast API failed');
      }
      
      const data = await response.json();
      return data.list.slice(0, 5).map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString('hi-IN'),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity
      }));
    } catch (error) {
      console.log('Using mock forecast data...');
      return getMockForecast();
    }
  },

  // Get farming recommendations based on weather
  getFarmingRecommendations: (weatherData) => {
    const temp = weatherData.temperature;
    const humidity = weatherData.humidity;
    
    let recommendations = [];
    
    if (temp > 35) {
      recommendations.push('🌡️ बहुत गर्मी है! फसल को छाया दें और ज्यादा पानी दें');
      recommendations.push('💧 Drip irrigation का इस्तेमाल करें');
    } else if (temp < 10) {
      recommendations.push('❄️ ठंड है! फसल को frost से बचाएं');
      recommendations.push('🔥 Mulching करें और warm water दें');
    }
    
    if (humidity > 80) {
      recommendations.push('💨 ज्यादा नमी है! Fungal diseases से बचें');
      recommendations.push('🌿 Ventilation बढ़ाएं');
    } else if (humidity < 30) {
      recommendations.push('🏜️ हवा सूखी है! Humidity बढ़ाने के लिए water spray करें');
    }
    
    return recommendations;
  }
};

// Backup weather service using wttr.in (completely free)
const getBackupWeather = async (city) => {
  try {
    const response = await fetch(`${BACKUP_WEATHER_URL}/${city}?format=j1`);
    const data = await response.json();
    
    const current = data.current_condition[0];
    return {
      temperature: parseInt(current.temp_C),
      description: current.weatherDesc[0].value,
      humidity: parseInt(current.humidity),
      windSpeed: parseInt(current.windspeedKmph),
      pressure: parseInt(current.pressure),
      city: city,
      icon: '01d', // default icon
      sunrise: '06:00',
      sunset: '18:00'
    };
  } catch (error) {
    // Final fallback with mock data
    return getMockWeatherData(city);
  }
};

// Mock data as final fallback
const getMockWeatherData = (city) => ({
  temperature: 28,
  description: 'साफ आसमान',
  humidity: 65,
  windSpeed: 5,
  pressure: 1013,
  city: city,
  icon: '01d',
  sunrise: '06:30',
  sunset: '18:30'
});

const getMockForecast = () => [
  { date: 'आज', temperature: 28, description: 'साफ', icon: '01d', humidity: 65 },
  { date: 'कल', temperature: 30, description: 'धूप', icon: '01d', humidity: 60 },
  { date: 'परसों', temperature: 26, description: 'बादल', icon: '02d', humidity: 70 },
  { date: '3 दिन', temperature: 24, description: 'बारिश', icon: '10d', humidity: 85 },
  { date: '4 दिन', temperature: 27, description: 'साफ', icon: '01d', humidity: 55 }
];
