import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const voiceAssistantService = {
  // Send voice query to AI
  async sendQuery(query, language = 'hi') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/voice-assistant/query`,
        { query, language },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Voice query error:', error);
      throw error;
    }
  },

  // Get weather via voice
  async getWeatherVoice(lat, lon, language = 'hi') {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/voice-assistant/weather`,
        {
          params: { lat, lon, language },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Weather voice error:', error);
      throw error;
    }
  },

  // Get market prices via voice
  async getMarketPricesVoice(language = 'hi') {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/voice-assistant/market-prices`,
        {
          params: { language },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Market prices voice error:', error);
      throw error;
    }
  },

  // Get crop recommendations
  async getCropRecommendation(season, soilType, rainfall, language = 'hi') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/voice-assistant/crop-recommendation`,
        { season, soilType, rainfall, language },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Crop recommendation error:', error);
      throw error;
    }
  },

  // Analyze crop image
  async analyzeCrop(imageUrl, cropType, language = 'hi') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/voice-assistant/analyze-crop`,
        { imageUrl, cropType, language },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Crop analysis error:', error);
      throw error;
    }
  },

  // Text to speech
  speak(text, language = 'hi') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  },

  // Speech to text
  async listen(language = 'hi') {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject(new Error('Speech Recognition not supported'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log('🎤 Listening...');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  }
};

export default voiceAssistantService;
