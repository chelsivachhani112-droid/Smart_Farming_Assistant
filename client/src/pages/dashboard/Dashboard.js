import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Cloud,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Activity,
  ShoppingCart,
  MessageSquare,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [crops, setCrops] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate API calls
    setWeatherData({
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Today', temp: 28, condition: 'sunny' },
        { day: 'Tomorrow', temp: 30, condition: 'cloudy' },
        { day: 'Friday', temp: 26, condition: 'rainy' }
      ]
    });

    setCrops([
      {
        id: 1,
        name: 'Wheat',
        area: '5 acres',
        status: 'healthy',
        plantingDate: '2024-01-15',
        expectedHarvest: '2024-04-15'
      },
      {
        id: 2,
        name: 'Rice',
        area: '3 acres',
        status: 'warning',
        plantingDate: '2024-02-01',
        expectedHarvest: '2024-05-01'
      }
    ]);

    setNotifications([
      {
        id: 1,
        type: 'weather',
        message: 'Heavy rain expected tomorrow. Consider covering crops.',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'crop',
        message: 'Rice crop showing signs of pest infestation.',
        time: '5 hours ago'
      },
      {
        id: 3,
        type: 'market',
        message: 'Wheat prices increased by 5% in local market.',
        time: '1 day ago'
      }
    ]);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const quickActions = [
    {
      title: 'Monitor Crops',
      description: 'Check crop health and upload images',
      icon: <Sprout className="w-6 h-6" />,
      link: '/crops',
      color: 'bg-green-500'
    },
    {
      title: 'Weather Updates',
      description: 'View detailed weather forecast',
      icon: <Cloud className="w-6 h-6" />,
      link: '/weather',
      color: 'bg-blue-500'
    },
    {
      title: 'Marketplace',
      description: 'Buy/sell agricultural products',
      icon: <ShoppingCart className="w-6 h-6" />,
      link: '/marketplace',
      color: 'bg-purple-500'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other farmers',
      icon: <Users className="w-6 h-6" />,
      link: '/forum',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    {
      title: 'Total Crops',
      value: crops.length,
      icon: <Sprout className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Healthy Crops',
      value: crops.filter(c => c.status === 'healthy').length,
      icon: <Activity className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Alerts',
      value: notifications.length,
      icon: <Bell className="w-8 h-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Forum Posts',
      value: 12,
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Welcome to your Smart Farming dashboard. Here's what's happening with your farm today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className={`${action.color} p-3 rounded-lg text-white mr-4`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Crop Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Crops</h2>
                <Link
                  to="/crops"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {crops.map((crop) => (
                  <div key={crop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crop.status)}`}>
                        {crop.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather Widget */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Today</h2>
              {weatherData && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{weatherData.temperature}°C</p>
                      <p className="text-gray-600">{weatherData.condition}</p>
                    </div>
                    <Sun className="w-12 h-12 text-yellow-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{weatherData.humidity}% Humidity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{weatherData.windSpeed} km/h</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">3-Day Forecast</h3>
                    <div className="space-y-2">
                      {weatherData.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.day}</span>
                          <span className="text-sm font-medium">{day.temp}°C</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to="/weather"
                    className="block w-full mt-4 text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    View Detailed Forecast
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {notification.type === 'weather' && <Cloud className="w-4 h-4 text-blue-500" />}
                      {notification.type === 'crop' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {notification.type === 'market' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/notifications"
                className="block w-full mt-4 text-center text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View All Notifications
              </Link>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
              <p className="text-green-100 mb-4">
                Get instant farming advice and answers to your questions.
              </p>
              <Link
                to="/chatbot"
                className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
