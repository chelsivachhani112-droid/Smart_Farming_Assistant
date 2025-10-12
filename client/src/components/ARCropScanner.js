import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, Eye, Brain, Zap, CheckCircle, AlertTriangle, X, BarChart3 } from 'lucide-react';

const ARCropScanner = ({ isOpen, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock AI analysis results
  const mockAnalysisResults = [
    {
      disease: 'Healthy Crop',
      confidence: 95,
      status: 'healthy',
      recommendations: [
        'फसल बिल्कुल स्वस्थ है! 🌱',
        'नियमित पानी देते रहें',
        'Organic fertilizer का इस्तेमाल करें',
        '15 दिन बाद फिर से check करें'
      ],
      nutrients: {
        nitrogen: 85,
        phosphorus: 78,
        potassium: 92
      }
    },
    {
      disease: 'Leaf Blight',
      confidence: 87,
      status: 'diseased',
      recommendations: [
        'तुरंत fungicide spray करें 🚨',
        'Infected leaves को हटा दें',
        'Copper-based solution का इस्तेमाल करें',
        '3 दिन बाद फिर से check करें'
      ],
      nutrients: {
        nitrogen: 45,
        phosphorus: 52,
        potassium: 38
      }
    },
    {
      disease: 'Nutrient Deficiency',
      confidence: 92,
      status: 'warning',
      recommendations: [
        'Nitrogen की कमी है 📊',
        'Urea fertilizer डालें',
        'Compost का इस्तेमाल करें',
        '1 सप्ताह बाद improvement देखें'
      ],
      nutrients: {
        nitrogen: 35,
        phosphorus: 65,
        potassium: 70
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access नहीं मिल सका। Permission check करें!');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const captureAndAnalyze = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    
    // Capture frame from video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simulate AI analysis with delay
    setTimeout(() => {
      const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'diseased': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-6 h-6" />;
      case 'warning': return <AlertTriangle className="w-6 h-6" />;
      case 'diseased': return <X className="w-6 h-6" />;
      default: return <Eye className="w-6 h-6" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Eye className="w-8 h-8" />
                  AR Crop Scanner
                </h2>
                <p className="text-green-100">AI से फसल की सेहत जांचें</p>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!scanResult ? (
              <div className="space-y-6">
                {/* Camera View */}
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-white"
                      >
                        <Brain className="w-16 h-16" />
                      </motion.div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                        <div className="text-lg font-semibold">AI Analysis चल रहा है...</div>
                        <div className="text-sm opacity-80">कृपया wait करें</div>
                      </div>
                    </div>
                  )}

                  {/* Scan Frame */}
                  <div className="absolute inset-4 border-4 border-green-400 rounded-2xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-4">
                  <div className="text-lg font-semibold text-gray-800">
                    📱 फसल को camera के सामने रखें
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Clear lighting में photo लें</div>
                    <div>• Leaves को focus में रखें</div>
                    <div>• 2-3 feet की distance रखें</div>
                  </div>
                </div>

                {/* Scan Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureAndAnalyze}
                    disabled={isScanning}
                    className={`${
                      isScanning 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                    } text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto`}
                  >
                    {isScanning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Scan className="w-6 h-6" />
                        </motion.div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6" />
                        🔍 Scan करें
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Results View */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className={`${getStatusColor(scanResult.status)} rounded-2xl p-6`}>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(scanResult.status)}
                    <div>
                      <h3 className="text-2xl font-bold">{scanResult.disease}</h3>
                      <p className="text-lg">Confidence: {scanResult.confidence}%</p>
                    </div>
                  </div>
                </div>

                {/* Nutrient Analysis */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Nutrient Analysis
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(scanResult.nutrients).map(([nutrient, value]) => (
                      <div key={nutrient} className="text-center">
                        <div className="text-sm font-semibold text-gray-600 mb-2 capitalize">
                          {nutrient}
                        </div>
                        <div className="relative w-16 h-16 mx-auto">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#e5e7eb"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke={value > 70 ? "#10b981" : value > 50 ? "#f59e0b" : "#ef4444"}
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${value * 1.76} 176`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{value}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-3">
                    {scanResult.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 bg-white rounded-lg p-3"
                      >
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="text-gray-800">{rec}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScanResult(null)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold"
                  >
                    🔄 फिर से Scan करें
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Save results logic here
                      alert('Results saved! Dashboard में देख सकते हैं।');
                    }}
                    className="flex-1 bg-white border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold"
                  >
                    💾 Save Results
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ARCropScanner;
