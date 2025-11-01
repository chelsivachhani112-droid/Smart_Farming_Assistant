const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cropRoutes = require('./routes/crops');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const forumRoutes = require('./routes/forum');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');
const voiceAssistantRoutes = require('./routes/voice-assistant');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  skip: (req, res) => process.env.NODE_ENV !== 'production', // Skip in development
  handler: (req, res) => res.status(429).json({ message: 'Too many requests' })
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/voice-assistant', voiceAssistantRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// MongoDB connection (non-blocking - frontend will still load)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-farming', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.log('⚠️ MongoDB connection error (frontend will still work):', err.message);
  console.log('💡 To enable backend features, set MONGODB_URI in .env file');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
