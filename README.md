# 🌱 Smart Farming Assistant - AI-Powered Farming Platform

**Live Website**: https://smartfarming2024.github.io/smart-farming-assistant

A comprehensive AI-powered farming platform with unique features like Hindi Voice Assistant, AR Crop Scanner, and real-time disease detection.

## 🌟 Features

### User-Side Features

#### 🧑‍🌾 For Farmers
- **Crop Health Monitoring**: Upload images for AI-powered disease detection
- **Weather Updates**: Real-time weather forecasts and agricultural insights
- **AI Crop Advisor**: Personalized farming recommendations
- **Smart Irrigation**: Water usage optimization tips
- **Market Price Updates**: Real-time mandi rates and buyer connections
- **Community Forum**: Ask questions and share knowledge
- **Learning Resources**: Access farming tutorials and guides
- **Multilingual Chatbot**: Get instant help in multiple Indian languages

#### 🛒 For Sellers
- **Product Listings**: Sell agricultural products, tools, and equipment
- **Inventory Management**: Track stock and manage orders
- **Buyer Communication**: Direct contact with potential buyers
- **Sales Analytics**: Track performance and revenue

#### 👨‍🏫 For Advisors
- **Expert Consultation**: Provide professional farming advice
- **Knowledge Sharing**: Contribute to community discussions
- **Specialization Showcase**: Highlight areas of expertise

### Admin-Side Features

#### 📊 Dashboard & Analytics
- **User Management**: Manage farmers, sellers, and advisors
- **Content Moderation**: Approve/reject products and forum posts
- **System Analytics**: Track platform usage and performance
- **Revenue Tracking**: Monitor marketplace transactions

#### 🛡️ Security & Compliance
- **Role-based Access Control**: Secure user permissions
- **Content Approval System**: Ensure quality and safety
- **User Verification**: Verify authentic users
- **System Health Monitoring**: Track performance metrics

## 🚀 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Axios** for API integrations
- **Socket.io** for real-time features

### Frontend
- **React.js** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Query** for data management
- **React Hook Form** for form handling

### APIs & Integrations
- **OpenWeatherMap API** for weather data
- **AI/ML Services** for crop disease detection
- **Payment Gateway** (Razorpay/Stripe) for transactions
- **Email Services** for notifications

## 📁 Project Structure

```
smart-farming-assistant/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── middleware/             # Custom middleware
├── uploads/                # File uploads directory
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-farming-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-farming
   JWT_SECRET=your_jwt_secret_key
   WEATHER_API_KEY=your_openweather_api_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Create upload directories**
   ```bash
   mkdir -p uploads/crops uploads/products uploads/forum
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### API Keys Required

1. **OpenWeatherMap API**
   - Sign up at https://openweathermap.org/api
   - Get your free API key
   - Add to `.env` as `WEATHER_API_KEY`

2. **Email Service**
   - Configure SMTP settings for email notifications
   - For Gmail, use app-specific passwords

3. **Payment Gateway** (Optional)
   - Razorpay or Stripe for marketplace transactions
   - Add credentials to `.env`

### Database Setup

1. **MongoDB Local Installation**
   ```bash
   # Install MongoDB Community Edition
   # Start MongoDB service
   mongod --dbpath /path/to/your/db
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/atlas
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

## 👥 User Roles & Permissions

### Farmer
- Create and manage crop records
- Upload crop images for analysis
- Access weather and market data
- Participate in community forum
- Use AI chatbot for assistance

### Seller
- List products in marketplace
- Manage inventory and orders
- Communicate with buyers
- Access sales analytics

### Advisor
- Provide expert consultation
- Share knowledge in forum
- Offer specialized services

### Admin
- Manage all users and content
- Approve/reject listings
- Monitor system health
- Access analytics dashboard

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Crops
- `GET /api/crops` - Get user's crops
- `POST /api/crops` - Create new crop
- `POST /api/crops/:id/images` - Upload crop image
- `POST /api/crops/:id/sensor-data` - Add sensor data

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/insights` - Agricultural insights

### Marketplace
- `GET /api/market/products` - Get products
- `POST /api/market/products` - Create product
- `GET /api/market/categories` - Get categories

### Forum
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create post
- `POST /api/forum/posts/:id/replies` - Add reply

### Admin
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/pending` - Pending approvals
- `PUT /api/admin/products/:id/approve` - Approve product

## 🎨 UI/UX Features

### Design System
- **Modern & Clean**: Tailwind CSS for consistent styling
- **Responsive**: Mobile-first design approach
- **Accessible**: WCAG compliance for all users
- **Intuitive**: User-friendly navigation and interactions

### Key Components
- **Dashboard Cards**: Quick overview of important metrics
- **Data Visualization**: Charts and graphs for analytics
- **Image Upload**: Drag-and-drop file uploads
- **Real-time Updates**: Live data refresh
- **Multi-language Support**: Localization ready

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- File upload security

### Privacy
- GDPR compliance ready
- Data encryption
- Secure API endpoints
- User consent management

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with essential features

## 🚀 Deployment

### Production Build

1. **Build frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment**
   ```bash
   NODE_ENV=production
   ```

3. **Start production server**
   ```bash
   npm start
   ```

### Deployment Options

1. **Heroku**
   - Easy deployment with Git integration
   - Add MongoDB Atlas for database

2. **DigitalOcean**
   - VPS deployment with full control
   - Configure nginx for reverse proxy

3. **Vercel/Netlify**
   - Frontend deployment
   - Separate backend deployment required

## 🧪 Testing

### Running Tests
```bash
# Backend tests
npm test

# Frontend tests
cd client
npm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord/Slack for discussions

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **API Key Issues**
   - Verify API keys are correct
   - Check rate limits and quotas

3. **File Upload Problems**
   - Ensure upload directories exist
   - Check file size limits

## 🔮 Future Enhancements

### Planned Features
- **IoT Integration**: Direct sensor data integration
- **Machine Learning**: Advanced crop prediction models
- **Blockchain**: Supply chain transparency
- **Mobile App**: Native iOS/Android applications
- **Offline Mode**: PWA with offline capabilities

### Roadmap
- **Phase 1**: Core platform features ✅
- **Phase 2**: Advanced AI features 🚧
- **Phase 3**: IoT and hardware integration 📋
- **Phase 4**: Mobile applications 📋
- **Phase 5**: Blockchain integration 📋

## 📊 Performance

### Optimization Features
- **Lazy Loading**: Components and images
- **Caching**: API responses and static assets
- **Compression**: Gzip compression for assets
- **CDN Ready**: Static asset optimization
- **Database Indexing**: Optimized queries

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage pattern analysis
- **Health Checks**: System status monitoring

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data API
- **Tailwind CSS** for the amazing CSS framework
- **React Community** for excellent documentation
- **MongoDB** for flexible database solutions
- **All Contributors** who helped build this platform

---

**Built with ❤️ for the farming community**

*Empowering farmers with technology for a sustainable future*
