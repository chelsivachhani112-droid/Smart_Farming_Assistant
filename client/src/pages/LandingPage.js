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
  BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Crop Health Monitoring",
      description: "AI-powered disease detection and health analysis using sensor data and image recognition."
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Weather Updates",
      description: "Real-time weather forecasts and seasonal predictions to help plan your farming activities."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Crop Advisor",
      description: "Get personalized farming recommendations based on your crop type, location, and conditions."
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Smart Irrigation",
      description: "Optimize water usage with intelligent irrigation scheduling and soil moisture monitoring."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Price Updates",
      description: "Stay updated with real-time mandi rates and connect with buyers and sellers."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Forum",
      description: "Connect with fellow farmers, share experiences, and get answers to your questions."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Resources",
      description: "Access tutorials, guides, and educational content to improve your farming practices."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Multilingual Chatbot",
      description: "Get instant help in your preferred language with voice and text support."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Farmer from Punjab",
      content: "This platform helped me increase my crop yield by 30%. The AI recommendations are spot-on!",
      avatar: "👨‍🌾"
    },
    {
      name: "Priya Sharma",
      role: "Agricultural Advisor",
      content: "I can now help more farmers efficiently. The community forum is a game-changer.",
      avatar: "👩‍🔬"
    },
    {
      name: "Amit Patel",
      role: "Organic Farmer",
      content: "The weather predictions and irrigation tips saved me thousands in water costs.",
      avatar: "🧑‍🌾"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Farmers" },
    { number: "500+", label: "Crop Varieties" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Smart Farming for a 
              <span className="text-green-300"> Sustainable Future</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Harness the power of AI, IoT, and community knowledge to revolutionize your farming experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Sprout className="w-16 h-16 text-green-300" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Cloud className="w-20 h-20 text-green-300" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Farming Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make informed decisions and maximize your agricultural productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover">
                <div className="text-green-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your farming experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up & Setup</h3>
              <p className="text-gray-600">
                Create your account and set up your farm profile with crop details and location
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Monitor & Analyze</h3>
              <p className="text-gray-600">
                Upload crop images, connect sensors, and get AI-powered insights about your crops
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Take Action</h3>
              <p className="text-gray-600">
                Follow personalized recommendations and connect with the farming community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Farmers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our farming community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose Smart Farming Assistant?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Secure & Reliable</h3>
                    <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Award className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Proven Results</h3>
                    <p className="text-gray-600">Trusted by thousands of farmers with measurable outcomes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Multilingual Support</h3>
                    <p className="text-gray-600">Available in multiple Indian languages</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Smartphone className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Mobile Friendly</h3>
                    <p className="text-gray-600">Access from anywhere on any device</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Join the Revolution
                </h3>
                <p className="text-gray-600 mb-6">
                  Be part of the smart farming movement and transform your agricultural practices with cutting-edge technology.
                </p>
                <Link 
                  to="/register" 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 inline-block"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers who are already benefiting from smart farming technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
            >
              Get Started Today
            </Link>
            <Link 
              to="/chatbot" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-200"
            >
              Try Our AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
