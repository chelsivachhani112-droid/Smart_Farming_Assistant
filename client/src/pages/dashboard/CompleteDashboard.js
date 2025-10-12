import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  TrendingUp, 
  Camera, 
  Mic, 
  BarChart3, 
  MapPin, 
  Bell,
  Leaf,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle,
  Upload,
  RefreshCw
} from 'lucide-react';
import { weatherService, marketPriceService, diseaseDetectionService } from '../../services/simpleServices';
import ARCropScanner from '../../components/ARCropScanner';

const CompleteDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showARScanner, setShowARScanner] = useState(false);
  const [diseaseResults, setDiseaseResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [notifications, setNotifications] = useState([]);

  const cities = ['Delhi', 'Mumbai', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh'];

  useEffect(() => {
    loadWeatherData();
    loadMarketPrices();
    generateNotifications();
  }, [selectedCity]);

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const weather = await weatherService.getCurrentWeather(selectedCity);
      const forecast = await weatherService.getForecast(selectedCity);
      const recommendations = weatherService.getFarmingRecommendations(weather);
      
      setWeatherData({
        current: weather,
        forecast: forecast,
        recommendations: recommendations
      });
    } catch (error) {
      console.error('Weather loading failed:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadMarketPrices = async () => {
    setPriceLoading(true);
    try {
      const prices = await marketPriceService.getCurrentPrices(selectedCity);
      setMarketPrices(prices);
    } catch (error) {
      console.error('Market prices loading failed:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const generateNotifications = () => {
    const alerts = [
      {
        id: 1,
        type: 'weather',
        title: 'मौसम अलर्ट',
        message: 'कल बारिश की संभावना है। फसल को cover करें।',
        time: '2 घंटे पहले',
        icon: <Cloud className="w-5 h-5" />,
        color: 'text-blue-600 bg-blue-100'
      },
      {
        id: 2,
        type: 'price',
        title: 'मार्केट अपडेट',
        message: 'गेहूं की कीमत ₹35 बढ़ी है। बेचने का अच्छा समय!',
        time: '1 घंटा पहले',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-green-600 bg-green-100'
      },
      {
        id: 3,
        type: 'disease',
        title: 'फसल स्वास्थ्य',
        message: 'आपकी टमाटर की फसल healthy है। Keep it up!',
        time: '30 मिनट पहले',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-600 bg-green-100'
      }
    ];
    setNotifications(alerts);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await diseaseDetectionService.detectDisease(file);
      const analysis = diseaseDetectionService.analyzeAndRecommend(result);
      
      setDiseaseResults(prev => [{
        id: Date.now(),
        timestamp: new Date().toLocaleString('hi-IN'),
        image: URL.createObjectURL(file),
        ...analysis
      }, ...prev.slice(0, 4)]);
      
      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        type: 'analysis',
        title: 'फोटो एनालिसिस',
        message: `${result.disease} detected with ${result.confidence}% confidence`,
        time: 'अभी',
        icon: <Camera className="w-5 h-5" />,
        color: result.status === 'healthy' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
      }, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Disease detection failed:', error);
      alert('फोटो analyze करने में problem हुई। Please try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🌱 Smart Farming Dashboard
              </h1>
              <p className="text-gray-600">
                Complete farming solution at your fingertips
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  loadWeatherData();
                  loadMarketPrices();
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <button
            onClick={() => setShowARScanner(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            <Camera className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">AR Scanner</div>
            <div className="text-xs opacity-80">Live Crop Check</div>
          </button>
          
          <label className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:scale-105 transition-transform shadow-lg cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Photo Upload</div>
            <div className="text-xs opacity-80">Disease Detection</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl hover:scale-105 transition-transform shadow-lg">
            <Mic className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Voice Assistant</div>
            <div className="text-xs opacity-80">Hindi Support</div>
          </button>
          
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:scale-105 transition-transform shadow-lg">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Analytics</div>
            <div className="text-xs opacity-80">Farm Reports</div>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Current Weather */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-500" />
                मौसम की जानकारी
              </h2>
              
              {weatherLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : weatherData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold">{weatherData.current.temperature}°C</div>
                        <div className="text-blue-100">{weatherData.current.description}</div>
                      </div>
                      <Sun className="w-12 h-12 text-yellow-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-200">Humidity</div>
                        <div className="font-semibold">{weatherData.current.humidity}%</div>
                      </div>
                      <div>
                        <div className="text-blue-200">Wind</div>
                        <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">5-Day Forecast</h3>
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium">{day.date}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{day.temperature}°C</span>
                          <span className="text-xs text-gray-500">{day.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Weather data loading...</div>
              )}
              
              {/* Farming Recommendations */}
              {weatherData?.recommendations && (
                <div className="mt-6 bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-3">🌾 Farming Recommendations</h3>
                  <div className="space-y-2">
                    {weatherData.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Market Prices */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                मार्केट प्राइस
              </h2>
              
              {priceLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {marketPrices.slice(0, 6).map((price, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{price.crop}</div>
                        <div className="text-sm text-gray-600">{price.variety} - {price.market}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{price.modalPrice}</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          price.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`w-4 h-4 ${price.trend === 'down' ? 'rotate-180' : ''}`} />
                          {price.change > 0 ? '+' : ''}{price.change}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Notifications
              </h2>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${notification.color}`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{notification.title}</div>
                      <div className="text-xs text-gray-600 mb-1">{notification.message}</div>
                      <div className="text-xs text-gray-400">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disease Detection Results */}
            {diseaseResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Recent Analysis
                </h2>
                
                <div className="space-y-4">
                  {diseaseResults.map((result) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={result.image} 
                          alt="Analyzed crop" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-sm">{result.disease}</div>
                          <div className="text-xs text-gray-500">{result.timestamp}</div>
                        </div>
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                        result.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.confidence}% Confidence
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        {result.recommendations[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AR Scanner Modal */}
      <ARCropScanner 
        isOpen={showARScanner} 
        onClose={() => setShowARScanner(false)} 
      />
    </div>
  );
};

export default CompleteDashboard;
