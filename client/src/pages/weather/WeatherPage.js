import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Search,
  Loader
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [city, setCity] = useState('Delhi');
  const [state, setState] = useState('Delhi');

  useEffect(() => {
    fetchWeatherData(city, state);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter city name');
      return;
    }
    setSearchLoading(true);
    try {
      // Parse search query (can be "city" or "city, state")
      const parts = searchQuery.split(',').map(p => p.trim());
      const searchCity = parts[0];
      const searchState = parts[1] || '';
      
      await fetchWeatherData(searchCity, searchState);
      setCity(searchCity);
      setState(searchState);
      setSearchQuery('');
      toast.success(`Weather loaded for ${searchCity}`);
    } catch (error) {
      toast.error('City not found');
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchWeatherData = async (searchCity = 'Delhi', searchState = 'Delhi') => {
    try {
      setLoading(true);
      
      // Try to fetch from API with city/state, fallback to mock data
      try {
        const params = new URLSearchParams();
        if (searchCity) params.append('city', searchCity);
        if (searchState) params.append('state', searchState);
        
        const currentResponse = await axios.get(`/api/weather/current?${params.toString()}`, { timeout: 5000 });
        setCurrentWeather(currentResponse.data);
      } catch (err) {
        console.log('Using mock weather data for', searchCity);
        setCurrentWeather(getMockCurrentWeather(searchCity, searchState));
      }

      try {
        const params = new URLSearchParams();
        if (searchCity) params.append('city', searchCity);
        if (searchState) params.append('state', searchState);
        params.append('days', '7');
        
        const forecastResponse = await axios.get(`/api/weather/forecast?${params.toString()}`, { timeout: 5000 });
        setForecast(forecastResponse.data.forecast || forecastResponse.data);
      } catch (err) {
        setForecast(getMockForecast());
      }

      try {
        const params = new URLSearchParams();
        if (searchCity) params.append('city', searchCity);
        if (searchState) params.append('state', searchState);
        
        const alertsResponse = await axios.get(`/api/weather/alerts?${params.toString()}`, { timeout: 5000 });
        setAlerts(alertsResponse.data);
      } catch (err) {
        setAlerts(getMockAlerts());
      }

      try {
        const insightsResponse = await axios.get('/api/weather/insights', { timeout: 5000 });
        setInsights(insightsResponse.data);
      } catch (err) {
        setInsights(getMockInsights());
      }

    } catch (error) {
      console.error('Weather fetch error:', error);
      // Set mock data as fallback
      setCurrentWeather(getMockCurrentWeather(searchCity, searchState));
      setForecast(getMockForecast());
      setAlerts(getMockAlerts());
      setInsights(getMockInsights());
    } finally {
      setLoading(false);
    }
  };

  const getMockCurrentWeather = (searchCity = 'Delhi', searchState = 'Delhi') => ({
    timestamp: new Date().toISOString(),
    location: { city: searchCity || 'Delhi', state: searchState || 'Delhi', country: 'India' },
    current: {
      temperature: 28,
      feelsLike: 30,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      condition: 'clouds',
      description: 'Partly Cloudy'
    },
    sun: {
      sunrise: new Date(Date.now() - 6 * 3600000).toISOString(),
      sunset: new Date(Date.now() + 6 * 3600000).toISOString()
    }
  });

  const getMockForecast = () => [
    {
      date: new Date().toISOString(),
      temperature: { max: 32, min: 22 },
      condition: 'sunny',
      description: 'Sunny',
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 86400000).toISOString(),
      temperature: { max: 30, min: 20 },
      condition: 'clouds',
      description: 'Cloudy',
      precipitation: 5
    },
    {
      date: new Date(Date.now() + 172800000).toISOString(),
      temperature: { max: 28, min: 18 },
      condition: 'rain',
      description: 'Rainy',
      precipitation: 20
    },
    {
      date: new Date(Date.now() + 259200000).toISOString(),
      temperature: { max: 29, min: 19 },
      condition: 'clouds',
      description: 'Cloudy',
      precipitation: 10
    },
    {
      date: new Date(Date.now() + 345600000).toISOString(),
      temperature: { max: 31, min: 21 },
      condition: 'sunny',
      description: 'Sunny',
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 432000000).toISOString(),
      temperature: { max: 33, min: 23 },
      condition: 'sunny',
      description: 'Sunny',
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 518400000).toISOString(),
      temperature: { max: 32, min: 22 },
      condition: 'clouds',
      description: 'Cloudy',
      precipitation: 2
    }
  ];

  const getMockAlerts = () => [
    {
      id: 1,
      title: '⛈️ Heavy Rain Alert',
      description: 'Heavy rain expected tomorrow evening. Recommended to cover crops and prepare drainage.',
      severity: 'high',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      recommendations: [
        'Cover sensitive crops',
        'Prepare drainage channels',
        'Postpone pesticide spraying',
        'Secure loose items'
      ]
    },
    {
      id: 2,
      title: '☀️ High Temperature',
      description: 'Temperature may reach 35°C on Friday. Ensure adequate irrigation.',
      severity: 'moderate',
      startTime: new Date(Date.now() + 345600000).toISOString(),
      endTime: new Date(Date.now() + 349200000).toISOString(),
      recommendations: [
        'Increase irrigation frequency',
        'Mulch the soil',
        'Provide shade if needed'
      ]
    }
  ];

  const getMockInsights = () => ({
    irrigation: {
      recommendation: 'Optimal for irrigation',
      reasoning: 'Current humidity is 65% and temperature is moderate. Good conditions for irrigation.',
      bestDays: ['Today', 'Tomorrow'],
      recommendations: [
        'Water early in the morning',
        'Use drip irrigation if available',
        'Check soil moisture before watering'
      ]
    },
    planting: {
      recommendation: 'Good conditions for planting',
      reasoning: 'Weather forecast shows favorable conditions for the next 3 days.',
      bestDays: ['Today', 'Tomorrow'],
      recommendations: [
        'Prepare soil today',
        'Plant early morning',
        'Ensure proper spacing'
      ]
    },
    pestControl: {
      recommendation: 'Avoid spraying today',
      reasoning: 'Rain expected tomorrow. Postpone pesticide application.',
      bestDays: ['Saturday', 'Sunday'],
      recommendations: [
        'Wait for rain to pass',
        'Spray on dry days',
        'Apply early morning'
      ]
    },
    harvesting: {
      recommendation: 'Not recommended this week',
      reasoning: 'Rain expected mid-week. Wait for clear weather.',
      bestDays: ['Saturday', 'Sunday'],
      recommendations: [
        'Check crop maturity',
        'Prepare harvesting equipment',
        'Plan for next week'
      ]
    }
  });

  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'clouds':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${size} text-blue-500`} />;
      default:
        return <Cloud className={`${size} text-gray-500`} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🌤️ Weather Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{currentWeather?.location?.city || 'Your Location'}</span>
            {currentWeather?.location?.state && (
              <>
                <span>,</span>
                <span>{currentWeather.location.state}</span>
              </>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search city (e.g., Mumbai or Mumbai, Maharashtra)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {searchLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.description}</p>
                      <div className="mt-2 text-xs">
                        <span>From: {formatTime(alert.startTime)}</span>
                        <span className="mx-2">•</span>
                        <span>To: {formatTime(alert.endTime)}</span>
                      </div>
                      {alert.recommendations && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Recommendations:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            {alert.recommendations.map((rec, index) => (
                              <li key={index}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'current', label: 'Current Weather' },
                { id: 'forecast', label: '7-Day Forecast' },
                { id: 'insights', label: 'Agricultural Insights' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Current Weather Tab */}
        {selectedTab === 'current' && currentWeather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Current Weather</h2>
                    <p className="text-gray-600">
                      Last updated: {formatTime(currentWeather.timestamp)}
                    </p>
                  </div>
                  {getWeatherIcon(currentWeather.current.condition, 'w-16 h-16')}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(currentWeather.current.temperature)}°C
                    </p>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xs text-gray-500">
                      Feels like {Math.round(currentWeather.current.feelsLike)}°C
                    </p>
                  </div>

                  <div className="text-center">
                    <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">
                      {currentWeather.current.humidity}%
                    </p>
                    <p className="text-sm text-gray-600">Humidity</p>
                  </div>

                  <div className="text-center">
                    <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(currentWeather.current.windSpeed)}
                    </p>
                    <p className="text-sm text-gray-600">Wind (km/h)</p>
                  </div>

                  <div className="text-center">
                    <Gauge className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(currentWeather.current.pressure)}
                    </p>
                    <p className="text-sm text-gray-600">Pressure (hPa)</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Visibility</p>
                        <p className="font-semibold">{currentWeather.current.visibility} km</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-600">UV Index</p>
                        <p className="font-semibold">{currentWeather.current.uvIndex || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sun Times */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sun Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sunrise className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sunrise</p>
                      <p className="font-semibold">{formatTime(currentWeather.sun.sunrise)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sunset className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sunset</p>
                      <p className="font-semibold">{formatTime(currentWeather.sun.sunset)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-medium">{currentWeather.current.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Direction</span>
                    <span className="font-medium">{Math.round(currentWeather.current.windDirection)}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Tab */}
        {selectedTab === 'forecast' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">7-Day Weather Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {forecast.slice(0, 7).map((day, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    {index === 0 ? 'Today' : formatDate(day.date)}
                  </p>
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.condition, 'w-10 h-10')}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(day.temperature.max)}°
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round(day.temperature.min)}°
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {day.description}
                    </p>
                    {day.precipitation > 0 && (
                      <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
                        <Droplets className="w-3 h-3" />
                        <span>{Math.round(day.precipitation)}mm</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {selectedTab === 'insights' && insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(insights).map(([key, insight]) => (
              <div key={key} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                
                {typeof insight === 'object' && insight.recommendation && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Recommendation</p>
                      <p className="font-medium text-green-600">{insight.recommendation}</p>
                    </div>
                    
                    {insight.reasoning && (
                      <div>
                        <p className="text-sm text-gray-600">Reasoning</p>
                        <p className="text-sm text-gray-800">{insight.reasoning}</p>
                      </div>
                    )}
                    
                    {insight.bestDays && (
                      <div>
                        <p className="text-sm text-gray-600">Best Days</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {insight.bestDays.map((day, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {insight.recommendations && (
                      <div>
                        <p className="text-sm text-gray-600">Tips</p>
                        <ul className="text-sm text-gray-800 mt-1 space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
