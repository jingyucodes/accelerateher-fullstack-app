# 🚀 AccelerateHer - AI-Powered Learning Platform

> Empowering women to accelerate their tech careers through personalized learning paths and AI-driven mentorship.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

## 🌟 Overview

AccelerateHer is a modern, full-stack learning management system designed specifically to help women transition into and advance in technology careers. The platform combines AI-powered profile creation, personalized learning paths, and community-driven support to create an engaging learning experience.

## ✨ Key Features

### 🤖 **AI-Powered Profile Creation**
- Conversational profile setup using Google Gemini AI
- Natural language processing for learning preferences
- Intelligent learning path recommendations

### 🔔 **Smart Notification System** *(New!)*
- YouTube-style notification bell with learning reminders
- Personalized notifications based on user preferences
- Four types of intelligent alerts:
  - 📚 Today's module reminders
  - ⏰ Weekly progress tracking
  - 🎯 Learning path progress updates
  - 🔥 Learning streak celebrations

### 📊 **Learning Analytics**
- Real-time progress tracking
- Weekly and monthly learning analytics
- Streak tracking and learning velocity metrics
- Module completion statistics

### 🎓 **Personalized Learning Paths**
- **Cloud Computing**: AWS, Azure, Cloud Concepts
- **Python Programming**: Fundamentals, Data Structures, OOP
- **Web Development**: HTML/CSS/JS, React, Node.js
- Dynamic module unlocking based on progress

### 💬 **Community Forum**
- Topic-based discussions (Python, Cloud, Career, etc.)
- Peer support and knowledge sharing
- Real-time community interactions

### 🎯 **Interactive Learning Modules**
- Video-based content with YouTube integration
- Reference materials and topic breakdowns
- Progress tracking with locked/unlocked system

## 🏗️ Tech Stack

### **Frontend**
- **React 19.1.0** - Modern UI with concurrent features
- **Vite 6.3.5** - Fast development and building
- **React Router 7.6.0** - Client-side routing
- **CSS3** - Custom styling with modern design patterns

### **Backend**
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Motor** - Async MongoDB driver
- **JWT Authentication** - Secure user authentication
- **bcrypt** - Password hashing

### **AI Integration**
- **Google Gemini AI** - Conversational profile creation
- **Natural Language Processing** - Smart learning recommendations

### **DevOps & Tools**
- **Git** - Version control
- **GitHub** - Repository hosting
- **Vite HMR** - Hot module replacement for development

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (Local or Atlas)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/jingyucodes/accelerateher-fullstack-app.git
cd accelerateher-fullstack-app
```

### 2. Backend Setup
```bash
cd accelerateher-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn motor pymongo python-jose[cryptography] passlib[bcrypt] python-dotenv google-generativeai

# Create .env file (NEVER commit this file to git!)
touch .env  # Create your .env file
```

> ⚠️ **SECURITY WARNING**: Never commit `.env` files containing real credentials to git! Always use placeholder values in documentation.

**Backend Environment Variables (.env):**
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
DATABASE_NAME=accelerateher_db
SECRET_KEY=your-super-secure-random-secret-key-here
GEMINI_API_KEY=your-google-gemini-api-key-here
```

### 3. Frontend Setup
```bash
cd ../accelerateher-frontend

# Install dependencies
npm install

# Create .env file for frontend
echo "VITE_GEMINI_API_KEY=your_google_gemini_api_key" > .env
```

### 4. Run the Application

**Start Backend (Terminal 1):**
```bash
cd accelerateher-backend
uvicorn main:app --reload --port 8000
```

**Start Frontend (Terminal 2):**
```bash
cd accelerateher-frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
accelerateher-fullstack-app/
├── accelerateher-backend/          # FastAPI Backend
│   ├── main.py                     # Main application file
│   ├── models.py                   # Pydantic models
│   ├── database.py                 # MongoDB connection
│   └── .env                        # Environment variables
├── accelerateher-frontend/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   ├── NotificationBell.jsx # Notification system
│   │   │   └── LearningAnalytics.jsx # Analytics dashboard
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── UserProfileContext.jsx # User profile state
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx   # Main dashboard
│   │   │   ├── UserProfilePage.jsx # AI profile creation
│   │   │   ├── ModulePage.jsx      # Learning modules
│   │   │   └── ForumPage.jsx       # Community forum
│   │   └── data/
│   │       └── mockData.jsx        # Sample data
│   └── package.json
└── README.md
```

## 🎯 Core User Journey

1. **🔐 Authentication**: Secure signup/login with JWT tokens
2. **🤖 AI Profile Setup**: Conversational profile creation using Gemini AI
3. **📚 Learning Path Assignment**: AI determines personalized learning track
4. **📊 Dashboard**: View progress, notifications, and learning analytics
5. **🎓 Module Learning**: Complete video-based learning modules
6. **💬 Community Engagement**: Participate in topic-based forums
7. **🔔 Smart Notifications**: Receive personalized learning reminders

## 🔔 Notification System Features

The notification bell system provides intelligent learning reminders:

- **📚 Module Reminders**: "Complete 'Python Fundamentals' today to stay on track!"
- **⏰ Weekly Goals**: "5 hours remaining to reach your 10h weekly goal"
- **🎯 Progress Updates**: "3 modules remaining in 'Cloud Computing Course'"
- **🔥 Streak Celebrations**: "Amazing! You're on a 7-day learning streak!"

**Smart Behavior:**
- Respects user notification preferences (`Yes`/`No`)
- Updates dynamically based on real progress data
- One-click navigation to relevant learning content
- Mark-as-read functionality with persistent state

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface inspired by leading platforms
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **YouTube-style Notifications**: Familiar interaction patterns
- **Smooth Animations**: Slide-down effects and hover states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🧪 Development Features

- **Hot Module Replacement (HMR)**: Instant updates during development
- **TypeScript Ready**: Easy migration to TypeScript if needed
- **Component-based Architecture**: Reusable React components
- **Context API**: Centralized state management
- **Async/Await**: Modern JavaScript patterns throughout

## 📊 Learning Paths Available

### ☁️ **Cloud Computing Track**
- Introduction to Cloud Concepts
- AWS Core Services (EC2, S3, VPC, IAM)
- Azure Fundamentals (AZ-900 prep)

### 🐍 **Python Programming Track**
- Python Fundamentals & Syntax
- Data Structures & Algorithms
- Object-Oriented Programming

### 🌐 **Web Development Track**
- HTML, CSS, JavaScript Fundamentals
- React.js Framework
- Backend Development with Node.js

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Advanced Analytics**: ML-powered learning insights
- [ ] **Live Mentorship**: Real-time video mentoring sessions
- [ ] **Gamification**: Points, badges, and leaderboards
- [ ] **Certificate System**: Blockchain-verified course certificates
- [ ] **Enterprise Features**: Team management and corporate training

## 🛠️ API Documentation

The backend provides a comprehensive REST API. Full documentation is available at:
`http://localhost:8000/docs` (when running locally)

### Key Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/profile/{user_id}` - Get user profile
- `PUT /api/profile/{user_id}` - Update user profile
- `GET /api/forum/posts` - Get forum posts
- `POST /api/analytics/track-module-progress` - Track learning progress

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
DATABASE_NAME=accelerateher_db
SECRET_KEY=<generate-a-secure-random-string>
ALGORITHM=HS256  
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env):**
```env
VITE_GEMINI_API_KEY=<your-google-gemini-api-key>
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Jingyu** - *Lead Developer* - [@jingyucodes](https://github.com/jingyucodes)

## 🙏 Acknowledgments

- Google Gemini AI for conversational AI capabilities
- MongoDB for flexible data storage
- FastAPI community for excellent documentation
- React team for the amazing framework
- All the women in tech who inspire this project

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

**🚀 Ready to accelerate your tech career? [Get started now!](https://github.com/jingyucodes/accelerateher-fullstack-app)** 