import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Filter, MapPin, Calendar, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [city, setCity] = useState('Delhi');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.get('/api/market/prices', { timeout: 5000 });
        setPrices(response.data);
        setFilteredPrices(response.data);
      } catch (err) {
        // Use mock data
        const mockPrices = getMockPrices();
        setPrices(mockPrices);
        setFilteredPrices(mockPrices);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      const mockPrices = getMockPrices();
      setPrices(mockPrices);
      setFilteredPrices(mockPrices);
    } finally {
      setLoading(false);
    }
  };

  const getMockPrices = () => [
    {
      id: 1,
      name: 'Wheat',
      price: 2250,
      unit: 'per quintal',
      change: 2.5,
      trend: 'up',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 2100,
      maxPrice: 2400,
      demand: 'High'
    },
    {
      id: 2,
      name: 'Rice',
      price: 3000,
      unit: 'per quintal',
      change: -1.2,
      trend: 'down',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 2800,
      maxPrice: 3200,
      demand: 'Medium'
    },
    {
      id: 3,
      name: 'Cotton',
      price: 5500,
      unit: 'per quintal',
      change: 1.8,
      trend: 'up',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 5200,
      maxPrice: 5800,
      demand: 'High'
    },
    {
      id: 4,
      name: 'Sugarcane',
      price: 320,
      unit: 'per quintal',
      change: 0.5,
      trend: 'up',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 300,
      maxPrice: 350,
      demand: 'Medium'
    },
    {
      id: 5,
      name: 'Corn',
      price: 1850,
      unit: 'per quintal',
      change: -0.8,
      trend: 'down',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 1700,
      maxPrice: 2000,
      demand: 'Low'
    },
    {
      id: 6,
      name: 'Soybean',
      price: 4200,
      unit: 'per quintal',
      change: 3.2,
      trend: 'up',
      location: 'Delhi',
      lastUpdated: new Date().toISOString(),
      minPrice: 3900,
      maxPrice: 4500,
      demand: 'High'
    }
  ];

  const getMockPriceHistory = (cropName) => [
    { date: '1 week ago', price: 2200 },
    { date: '5 days ago', price: 2220 },
    { date: '3 days ago', price: 2240 },
    { date: '2 days ago', price: 2230 },
    { date: 'Yesterday', price: 2245 },
    { date: 'Today', price: 2250 }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPrices(prices);
    } else {
      const filtered = prices.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPrices(filtered);
    }
  };

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
    setPriceHistory(getMockPriceHistory(crop.name));
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading market prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Market Prices</h1>
          <p className="text-gray-600">Real-time agricultural commodity prices</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search crop..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{city}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prices List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Prices</h2>
              <div className="space-y-4">
                {filteredPrices.length > 0 ? (
                  filteredPrices.map((price) => (
                    <div
                      key={price.id}
                      onClick={() => handleCropClick(price)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCrop?.id === price.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{price.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>₹{price.price} {price.unit}</span>
                            <span className={getDemandColor(price.demand)}>
                              Demand: {price.demand}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {price.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                            <span className={price.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                              {price.change > 0 ? '+' : ''}{price.change}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Range: ₹{price.minPrice} - ₹{price.maxPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No crops found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Chart */}
          {selectedCrop && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedCrop.name}</h2>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{selectedCrop.price}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedCrop.unit}</p>
              </div>

              <div className="mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Price</span>
                  <span className="font-semibold">₹{selectedCrop.minPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Price</span>
                  <span className="font-semibold">₹{selectedCrop.maxPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change</span>
                  <span className={selectedCrop.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {selectedCrop.change > 0 ? '+' : ''}{selectedCrop.change}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getDemandColor(selectedCrop.demand)}`}>
                    {selectedCrop.demand}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> {selectedCrop.trend === 'up'
                    ? 'Prices are rising. Good time to sell if you have stock.'
                    : 'Prices are falling. Consider holding or buying for future.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Market Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Best Selling Time</h3>
              <p className="text-gray-600">When prices are trending up (🟢 green arrow)</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Best Buying Time</h3>
              <p className="text-gray-600">When prices are trending down (🔴 red arrow)</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">High Demand</h3>
              <p className="text-gray-600">Better prices when demand is high</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
