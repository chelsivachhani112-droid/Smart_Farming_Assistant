import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Hindi responses for farming queries
  const hindiResponses = {
    'फसल': 'आपकी फसल की सेहत के लिए मैं यहाँ हूँ! कौन सी फसल के बारे में जानना चाहते हैं?',
    'बीमारी': 'फसल में बीमारी का पता लगाने के लिए फोटो अपलोड करें। मैं तुरंत बताऊंगा!',
    'मौसम': 'आज का मौसम देखने के लिए Weather सेक्शन में जाएं। Satellite से live data मिलता है!',
    'पानी': 'पानी की बचत के लिए Smart Irrigation system का इस्तेमाल करें। IoT sensors लगवाएं!',
    'बाजार': 'Market Price section में जाकर आज के भाव देखें। AI से future price भी predict कर सकते हैं!',
    'खाद': 'Soil test करवाकर सही खाद का चुनाव करें। Organic farming बेहतर है!',
    'बीज': 'Quality seeds के लिए Marketplace देखें। Certified seeds ही खरीदें!',
    'default': 'नमस्ते किसान भाई! मैं आपका AI साथी हूँ। फसल, मौसम, बाजार - कुछ भी पूछें!'
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'hi-IN'; // Hindi language
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command) => {
    let responseText = hindiResponses.default;
    
    // Check for keywords in the command
    Object.keys(hindiResponses).forEach(keyword => {
      if (command.toLowerCase().includes(keyword.toLowerCase()) && keyword !== 'default') {
        responseText = hindiResponses[keyword];
      }
    });
    
    setResponse(responseText);
    speakResponse(responseText);
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 shadow-2xl"
      >
        <div className="flex flex-col items-center space-y-2">
          {/* Voice Control Buttons */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-white text-green-600 hover:bg-green-50'
              } transition-all duration-300`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isSpeaking ? stopSpeaking : () => speakResponse(response || hindiResponses.default)}
              className={`p-3 rounded-full ${
                isSpeaking 
                  ? 'bg-orange-500 animate-bounce' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } transition-all duration-300`}
            >
              {isSpeaking ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Status Indicator */}
          <AnimatePresence>
            {(isListening || isSpeaking) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-lg p-2 text-xs font-semibold text-center min-w-[120px]"
              >
                {isListening && (
                  <div className="text-red-600">
                    🎤 सुन रहा हूँ...
                  </div>
                )}
                {isSpeaking && (
                  <div className="text-blue-600">
                    🗣️ बोल रहा हूँ...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Voice Chat Bubble */}
      <AnimatePresence>
        {(transcript || response) && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="absolute bottom-20 right-0 bg-white rounded-2xl p-4 shadow-2xl max-w-xs border-2 border-green-200"
          >
            {transcript && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">आपने कहा:</div>
                <div className="text-sm font-medium text-gray-800 bg-gray-100 rounded-lg p-2">
                  "{transcript}"
                </div>
              </div>
            )}
            
            {response && (
              <div>
                <div className="text-xs text-green-600 mb-1 font-semibold">AI का जवाब:</div>
                <div className="text-sm text-green-800 bg-green-50 rounded-lg p-2">
                  {response}
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setTranscript('');
                setResponse('');
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Tooltip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute -top-16 right-0 bg-black text-white text-xs rounded-lg p-2 max-w-xs"
      >
        🎤 Hindi में बोलें: "फसल", "मौसम", "बाजार"
        <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
      </motion.div>
    </div>
  );
};

export default VoiceAssistant;
