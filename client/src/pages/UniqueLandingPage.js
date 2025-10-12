import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Eye, 
  Mic, 
  Camera, 
  Globe, 
  TrendingUp,
  Shield,
  Smartphone,
  Cpu,
  Leaf,
  Sun,
  CloudRain,
  BarChart3,
  Brain,
  Waves,
  Satellite,
  Gamepad2,
  Headphones,
  Scan,
  MapPin,
  Rocket
} from 'lucide-react';
import ARCropScanner from '../components/ARCropScanner';

const UniqueLandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [showARScanner, setShowARScanner] = useState(false);

  // Unique Features that no other farming website has
  const uniqueFeatures = [
    {
      id: 1,
      icon: <Brain className="w-12 h-12" />,
      title: "🧠 AI Farm Brain",
      subtitle: "Dil se Samjhega Aapki Kheti Ko",
      description: "Duniya ka pehla AI jo Hindi mein baat karta hai aur aapki har samasya ka hal deta hai",
      color: "from-purple-500 to-pink-500",
      features: ["Voice Commands in Hindi", "24/7 AI Support", "Personalized Solutions"]
    },
    {
      id: 2,
      icon: <Eye className="w-12 h-12" />,
      title: "👁️ X-Ray Vision Scanner",
      subtitle: "Dekho Jo Aankhon Se Nahi Dikhta",
      description: "Sirf photo kheenchiye, AI batayega crop ki internal health, disease, aur nutrients ki kami",
      color: "from-green-500 to-blue-500",
      features: ["Disease Detection", "Nutrient Analysis", "Growth Prediction"]
    },
    {
      id: 3,
      icon: <Satellite className="w-12 h-12" />,
      title: "🛰️ Space Weather Prophet",
      subtitle: "Satellite Se Direct Weather Updates",
      description: "NASA ke satellites se direct data - 15 din pehle batayenge kab barish hogi",
      color: "from-blue-500 to-cyan-500",
      features: ["Satellite Weather", "15-Day Forecast", "Rain Alerts"]
    },
    {
      id: 4,
      icon: <Gamepad2 className="w-12 h-12" />,
      title: "🎮 Virtual Farm Game",
      subtitle: "Khel Khel Mein Seekho Farming",
      description: "3D game mein apna virtual farm banayiye aur real farming techniques seekhiye",
      color: "from-orange-500 to-red-500",
      features: ["3D Farm Simulation", "Learning Games", "Rewards System"]
    },
    {
      id: 5,
      icon: <Waves className="w-12 h-12" />,
      title: "🌊 Smart Water Wizard",
      subtitle: "Paani Ki Har Boond Ka Hisaab",
      description: "IoT sensors se real-time soil moisture, automatic irrigation, aur water saving tips",
      color: "from-cyan-500 to-teal-500",
      features: ["IoT Integration", "Auto Irrigation", "Water Conservation"]
    },
    {
      id: 6,
      icon: <TrendingUp className="w-12 h-12" />,
      title: "📈 Market Price Prophet",
      subtitle: "Future Mein Kya Hoga Price",
      description: "AI se predict kariye next month ka market price aur best selling time",
      color: "from-yellow-500 to-orange-500",
      features: ["Price Prediction", "Best Selling Time", "Market Trends"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Farmers", icon: "👨‍🌾" },
    { number: "99.9%", label: "Accuracy Rate", icon: "🎯" },
    { number: "24/7", label: "AI Support", icon: "🤖" },
    { number: "15+", label: "Languages", icon: "🗣️" }
  ];

  const testimonials = [
    {
      name: "राजेश कुमार",
      location: "पंजाब",
      content: "इस AI ने मेरी फसल 40% बढ़ा दी! अब मैं crorepati हूं! 🚜💰",
      avatar: "👨‍🌾",
      rating: 5,
      crop: "गेहूं"
    },
    {
      name: "प्रिया शर्मा", 
      location: "हरियाणा",
      content: "Voice assistant Hindi में बात करता है! बहुत आसान हो गया! 🎤✨",
      avatar: "👩‍🌾",
      rating: 5,
      crop: "धान"
    },
    {
      name: "अमित पटेल",
      location: "गुजरात",
      content: "Satellite weather ने मेरी फसल बारिश से बचाई! Amazing! 🛰️🌧️",
      avatar: "🧑‍🌾",
      rating: 5,
      crop: "कपास"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % uniqueFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsVoiceActive(false);
        alert("Voice command received: 'Meri fasal ki health check karo'");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 opacity-20"
        >
          <Leaf className="w-16 h-16 text-green-400" />
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-40 right-20 opacity-20"
        >
          <Sun className="w-20 h-20 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-40 left-1/4 opacity-20"
        >
          <CloudRain className="w-14 h-14 text-blue-400" />
        </motion.div>
      </div>

      {/* Hero Section with 3D Effect */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="text-center z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              किसान का
              <br />
              <span className="text-yellow-500">AI साथी</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-semibold">
              🚀 Duniya Ka Pehla <span className="text-green-600">Hindi AI</span> Farming Assistant
            </p>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
              Voice commands, Satellite weather, Disease scanner, Market predictor - 
              <br />सब कुछ एक जगह, सब कुछ Hindi में! 🇮🇳
            </p>
          </motion.div>

          {/* Interactive Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
            >
              🚀 Free में शुरू करें
            </motion.button>
            
            <motion.button
              onClick={handleVoiceCommand}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 flex items-center gap-3`}
            >
              <Mic className={`w-6 h-6 ${isVoiceActive ? 'animate-bounce' : ''}`} />
              {isVoiceActive ? '🎤 सुन रहा हूं...' : '🗣️ Hindi में बोलें'}
            </motion.button>
          </motion.div>

          {/* Live Stats Counter */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3D Floating Farm Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <div className="text-2xl opacity-30">
                {['🌾', '🌱', '🌿', '🍃', '🌻', '🌽'][Math.floor(Math.random() * 6)]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Unique Features Showcase */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-800 mb-4">
              🌟 Unique Features
            </h2>
            <p className="text-xl text-gray-600">
              Jo Kisi Aur Website Pe Nahi Milega! 
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                }}
                className={`bg-gradient-to-br ${feature.color} p-8 rounded-3xl text-white shadow-2xl cursor-pointer transform-gpu`}
              >
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-lg font-semibold mb-4 opacity-90">{feature.subtitle}</p>
                <p className="text-sm mb-6 opacity-80">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-16"
          >
            <h2 className="text-5xl font-black mb-6">🎮 Live Demo</h2>
            <p className="text-xl mb-8">Try करके देखिए - बिल्कुल Free!</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, rotateX: 10 }}
              onClick={() => setShowARScanner(true)}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 cursor-pointer hover:bg-white/30 transition-all"
            >
              <Camera className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">📸 AR Scanner</h3>
              <p className="text-sm opacity-80">Live camera se crop health check kariye</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotateX: 10 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 cursor-pointer"
            >
              <Mic className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">🎤 Voice Command</h3>
              <p className="text-sm opacity-80">Hindi mein boliye, AI samjhega</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotateX: 10 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 cursor-pointer"
            >
              <Satellite className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">🛰️ Weather Check</h3>
              <p className="text-sm opacity-80">Live satellite weather dekho</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials with Video Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-800 mb-4">
              💬 Farmers Ki Awaaz
            </h2>
            <p className="text-xl text-gray-600">
              Real Stories, Real Results! 
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-200"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">{testimonial.avatar}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                </div>
                
                <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  "{testimonial.content}"
                </p>
                
                <div className="text-center">
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-green-600 font-semibold">{testimonial.location}</div>
                  <div className="text-sm text-gray-500">Crop: {testimonial.crop}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Animation */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <h2 className="text-6xl font-black mb-6">
              🚀 Ready Ho?
            </h2>
            <p className="text-2xl mb-8">
              Join करिए 50,000+ Happy Farmers का Club!
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-black shadow-2xl"
            >
              🎯 अभी शुरू करें - FREE!
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border-4 border-white text-white px-12 py-6 rounded-2xl text-2xl font-black hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              📱 Demo देखें
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* AR Crop Scanner Modal */}
      <ARCropScanner 
        isOpen={showARScanner} 
        onClose={() => setShowARScanner(false)} 
      />
    </div>
  );
};

export default UniqueLandingPage;
