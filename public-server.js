const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes (if needed)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Farming Assistant API is running!',
    timestamp: new Date().toISOString(),
    features: [
      '🧠 AI Farm Brain - Hindi Voice Assistant',
      '👁️ X-Ray Vision Scanner - Disease Detection', 
      '🛰️ Space Weather Prophet - Satellite Data',
      '🎮 Virtual Farm Game - 3D Learning',
      '🌊 Smart Water Wizard - IoT Integration',
      '📈 Market Price Prophet - AI Predictions'
    ]
  });
});

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🌱 ==========================================
   Smart Farming Assistant Server Running!
🌱 ==========================================

🚀 Server URL: http://localhost:${PORT}
🌐 Public Access: http://0.0.0.0:${PORT}
📱 Mobile Access: http://[YOUR-IP]:${PORT}

🎯 Features Available:
   • 🧠 AI Farm Brain (Hindi Voice)
   • 👁️ Disease Scanner
   • 🛰️ Satellite Weather
   • 🎮 Virtual Farm Game
   • 🌊 Smart Irrigation
   • 📈 Price Predictor

💡 To access from other devices:
   1. Find your IP: ipconfig (Windows) / ifconfig (Mac/Linux)
   2. Use: http://[YOUR-IP]:${PORT}
   3. Make sure firewall allows port ${PORT}

🔥 Ready to revolutionize farming! 🚜
  `);
});

module.exports = app;
