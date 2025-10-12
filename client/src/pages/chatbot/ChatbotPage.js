import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Image,
  Bot,
  User,
  Loader,
  Globe,
  Camera,
  MessageSquare,
  Lightbulb,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en');
  const [suggestions, setSuggestions] = useState([]);
  const [capabilities, setCapabilities] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCapabilities();
    fetchSuggestions();
    loadChatHistory();
    
    // Add welcome message
    setMessages([{
      id: 1,
      type: 'bot',
      content: `Hello ${user?.name}! I'm your Smart Farming Assistant. I can help you with crop management, weather information, market prices, and much more. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'What crops should I plant this season?',
        'Current weather forecast',
        'Market price updates',
        'Government schemes for farmers'
      ]
    }]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCapabilities = async () => {
    try {
      const response = await axios.get('/api/chatbot/capabilities');
      setCapabilities(response.data);
    } catch (error) {
      console.error('Failed to fetch capabilities:', error);
    }
  };

  const fetchSuggestions = async (category = 'general') => {
    try {
      const response = await axios.get(`/api/chatbot/suggestions?category=${category}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('/api/chatbot/history');
      const history = response.data.map((item, index) => [
        {
          id: `user-${index}`,
          type: 'user',
          content: item.message,
          timestamp: new Date(item.timestamp)
        },
        {
          id: `bot-${index}`,
          type: 'bot',
          content: item.response,
          timestamp: new Date(item.timestamp),
          language: item.language
        }
      ]).flat();
      
      if (history.length > 0) {
        setMessages(prev => [...history, ...prev]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: messageText,
        language,
        context: {
          userRole: user?.role,
          location: user?.location
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        suggestions: response.data.suggestions,
        language: response.data.language
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response from chatbot');
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create a preview message
    const imageMessage = {
      id: Date.now(),
      type: 'user',
      content: 'Analyzing uploaded image...',
      timestamp: new Date(),
      image: URL.createObjectURL(file)
    };

    setMessages(prev => [...prev, imageMessage]);
    setIsLoading(true);

    try {
      // In a real app, you'd upload the image and get analysis
      const mockAnalysis = {
        cropType: 'Tomato',
        healthStatus: 'Healthy',
        confidence: 87,
        recommendations: [
          'Crop appears healthy',
          'Continue current care routine',
          'Monitor for any pest activity'
        ]
      };

      const analysisMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Image Analysis Results:\n\n🌱 Crop Type: ${mockAnalysis.cropType}\n✅ Health Status: ${mockAnalysis.healthStatus}\n📊 Confidence: ${mockAnalysis.confidence}%\n\nRecommendations:\n${mockAnalysis.recommendations.map(r => `• ${r}`).join('\n')}`,
        timestamp: new Date(),
        isAnalysis: true
      };

      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      toast.error('Failed to analyze image');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('Voice recognition failed');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.type === 'user' 
            ? 'bg-green-600 text-white' 
            : message.isError 
              ? 'bg-red-100 text-red-600'
              : 'bg-blue-100 text-blue-600'
        }`}>
          {message.type === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${
          message.type === 'user'
            ? 'bg-green-600 text-white'
            : message.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          {message.image && (
            <img 
              src={message.image} 
              alt="Uploaded" 
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          
          <p className="whitespace-pre-line">{message.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${
              message.type === 'user' ? 'text-green-100' : 'text-gray-500'
            }`}>
              {formatTimestamp(message.timestamp)}
            </span>
            
            {message.language && message.language !== 'en' && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {message.language.toUpperCase()}
              </span>
            )}
          </div>

          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-600 font-medium">Suggestions:</p>
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="block w-full text-left text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded border transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Farming Assistant</h1>
                <p className="text-gray-600">Get instant help with your farming questions</p>
              </div>
            </div>

            {/* Language Selector */}
            {capabilities && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {capabilities.languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask me anything about farming..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
                      disabled={isLoading}
                    />
                    
                    {/* Voice Input Button */}
                    <button
                      onClick={startVoiceRecognition}
                      disabled={isLoading || isListening}
                      className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                        isListening 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Image Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Quick Suggestions</h3>
              </div>
              <div className="space-y-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            {capabilities && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">I can help with</h3>
                </div>
                <div className="space-y-3">
                  {capabilities.topics.slice(0, 3).map((topic, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-800 text-sm">{topic.category}</h4>
                      <ul className="text-xs text-gray-600 mt-1 space-y-1">
                        {topic.topics.slice(0, 3).map((item, itemIndex) => (
                          <li key={itemIndex}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent History */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Recent Topics</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => sendMessage('Weather forecast for this week')}
                  className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Weather forecast
                </button>
                <button
                  onClick={() => sendMessage('Best fertilizer for wheat')}
                  className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Fertilizer advice
                </button>
                <button
                  onClick={() => sendMessage('Current market prices')}
                  className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Market prices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
