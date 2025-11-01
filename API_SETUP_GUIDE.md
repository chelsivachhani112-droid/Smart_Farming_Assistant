# 🌐 Smart Farming Assistant - API Setup Guide

This guide will help you set up all the APIs needed for the Smart Farming Assistant to work with full features.

---

## 📋 Table of Contents

1. [Weather API](#weather-api)
2. [Email Service](#email-service)
3. [Payment Gateway](#payment-gateway)
4. [AI/ML Services](#aiml-services)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)

---

## 🌤️ Weather API

### OpenWeatherMap (Free Tier Available)

**Purpose**: Get real-time weather data, forecasts, and alerts for farming decisions.

**Steps**:
1. Go to: https://openweathermap.org/api
2. Click **Sign Up** (free tier available)
3. Create account and verify email
4. Go to **API Keys** tab
5. Copy your **API Key**
6. Add to `.env`:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

**Features Unlocked**:
- ✅ Current weather data
- ✅ 5-day weather forecast
- ✅ Weather alerts
- ✅ Agricultural insights

**Free Tier Limits**: 60 calls/minute, 1,000,000 calls/month

---

## 📧 Email Service

### Gmail SMTP (Recommended)

**Purpose**: Send notifications, password resets, and alerts to users.

**Steps**:
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App passwords** (search for it)
4. Select **Mail** and **Windows Computer**
5. Google will generate a 16-character password
6. Copy and add to `.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=16_character_password_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

**Features Unlocked**:
- ✅ User registration emails
- ✅ Password reset emails
- ✅ Weather alerts
- ✅ Market price notifications

---

## 💳 Payment Gateway

### Razorpay (Recommended for India)

**Purpose**: Handle payments for marketplace transactions.

**Steps**:
1. Go to: https://razorpay.com
2. Sign up with email
3. Verify email and phone
4. Go to **Settings** → **API Keys**
5. Copy **Key ID** and **Key Secret**
6. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

**Features Unlocked**:
- ✅ Marketplace payments
- ✅ Seller payouts
- ✅ Transaction history
- ✅ Refund management

**Free Tier**: No setup fee, 2% + ₹3 per transaction

---

## 🤖 AI/ML Services

### OpenAI (For Chatbot)

**Purpose**: Power the intelligent farming chatbot with AI responses.

**Steps**:
1. Go to: https://platform.openai.com
2. Sign up and verify email
3. Go to **API Keys**
4. Click **Create new secret key**
5. Copy the key
6. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your_api_key_here
   ```

**Features Unlocked**:
- ✅ Intelligent chatbot responses
- ✅ Natural language understanding
- ✅ Personalized farming advice
- ✅ Multilingual support

**Pricing**: Pay-as-you-go (starts at $0.0005 per 1K tokens)

---

### Google Cloud Vision (For Image Analysis)

**Purpose**: Analyze crop images for disease detection.

**Steps**:
1. Go to: https://cloud.google.com/vision
2. Click **Get started**
3. Create a new project
4. Enable **Vision API**
5. Create a **Service Account**
6. Download JSON key file
7. Add to `.env`:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_API_KEY=your_api_key
   ```

**Features Unlocked**:
- ✅ Crop disease detection
- ✅ Pest identification
- ✅ Plant health analysis
- ✅ Yield prediction

**Free Tier**: 1,000 requests/month

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud Database - Recommended)

**Purpose**: Store all user data, crops, products, and transactions.

**Steps**:
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (free tier available)
3. Create account and verify email
4. Click **Create a Cluster**
5. Choose **Free Tier** (M0)
6. Select region (ap-south-1 for India)
7. Create cluster (takes 2-3 minutes)
8. Go to **Database Access** → **Add New Database User**
9. Create username and password
10. Go to **Network Access** → **Add IP Address**
11. Click **Allow Access from Anywhere** (for development)
12. Go to **Clusters** → **Connect**
13. Copy **Connection String**
14. Replace `<username>` and `<password>` with your credentials
15. Add to `.env`:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-farming
    ```

**Features Unlocked**:
- ✅ User authentication
- ✅ Crop management
- ✅ Marketplace
- ✅ Forum discussions
- ✅ Transaction history

**Free Tier**: 512 MB storage, 100 concurrent connections

---

## 🔐 Environment Variables

### Complete `.env` Setup

Copy the `.env.example` file and rename to `.env`:

```bash
cp .env.example .env
```

Fill in all the values:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-farming

# JWT
JWT_SECRET=your_very_long_random_secret_key_here

# Weather
WEATHER_API_KEY=your_openweathermap_key

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Payment
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AI
OPENAI_API_KEY=sk-your_openai_key

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_API_KEY=your_google_key
```

---

## ✅ Testing APIs

### Test Weather API
```bash
curl -X GET "http://localhost:5000/api/weather/current?lat=28.6139&lon=77.2090" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Chatbot
```bash
curl -X POST "http://localhost:5000/api/chatbot/message" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What crops should I plant?"}'
```

### Test Market
```bash
curl -X GET "http://localhost:5000/api/market/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚀 Deployment with APIs

### On Netlify

1. Go to your Netlify project settings
2. Go to **Build & Deploy** → **Environment**
3. Add all environment variables from `.env`
4. Redeploy the site

### On Render

1. Go to your Render project
2. Go to **Environment**
3. Add all environment variables
4. Redeploy

### On Vercel

1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Add all variables
4. Redeploy

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Weather API not working**
- Check if API key is correct
- Verify API key is enabled in OpenWeatherMap dashboard
- Check rate limits

**2. Email not sending**
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled
- Allow "Less secure apps" if needed

**3. Payment gateway errors**
- Verify Razorpay keys are correct
- Check if test mode is enabled
- Verify merchant account is activated

**4. Database connection error**
- Check MongoDB URI is correct
- Verify IP address is whitelisted
- Check username and password

---

## 🎯 Next Steps

1. ✅ Set up all APIs as per this guide
2. ✅ Add environment variables to `.env`
3. ✅ Test each API locally
4. ✅ Deploy to production
5. ✅ Monitor API usage and costs

---

**Your Smart Farming Assistant is now fully powered with APIs!** 🌾🚀
