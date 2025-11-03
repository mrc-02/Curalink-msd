# 🏥 HealthCare Pro - Healthcare Management System

A modern, full-stack healthcare management system built with React, Node.js, Express, and MongoDB. This comprehensive platform connects patients with healthcare professionals, enabling seamless appointment booking, medical record management, and more.

![Healthcare Pro](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200)

## ✨ Features

### For Patients
- 📅 **Easy Appointment Booking** - Schedule appointments with top doctors
- 📋 **Digital Health Records** - Access medical records anytime, anywhere
- 💊 **Prescription Management** - View and download prescriptions
- 💳 **Billing & Payments** - Track medical expenses and payments
- 📊 **Health Dashboard** - Monitor vital signs and health metrics

### For Doctors
- 👥 **Patient Management** - Manage patient information and history
- 📆 **Schedule Management** - Set availability and manage appointments
- 💼 **Prescription Writing** - Create and manage prescriptions
- 📈 **Analytics Dashboard** - Track performance metrics
- 💬 **Patient Communication** - Communicate with patients securely

### For Administrators
- 📊 **Comprehensive Dashboard** - Overview of entire system
- 👨‍⚕️ **Doctor Management** - Add, edit, and manage doctor profiles
- 👤 **Patient Management** - Oversee patient registrations
- 💰 **Revenue Analytics** - Track financial performance
- ⚙️ **System Settings** - Configure system parameters

## 🚀 Technology Stack

### Frontend
- **React 18+** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage (ready)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Git

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/healthcare-management.git
cd healthcare-management
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/healthcare-management

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Optional: Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 6. Seed the Database (Optional but Recommended)

This will create sample data including admin, doctors, and patients:
```bash
cd server
npm run seed
```

### 7. Start the Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👤 Default Login Credentials

After seeding the database, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthcare.com | admin123 |
| Doctor | dr.smith@healthcare.com | doctor123 |
| Patient | patient1@email.com | patient123 |

## 📁 Project Structure
```
healthcare-management-system/
├── client/                    # Frontend React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # Common UI components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── appointments/
│   │   │   └── patients/
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `PUT /api/doctors/:id` - Update doctor
- `GET /api/doctors/:id/availability` - Get doctor availability
- `PUT /api/doctors/:id/availability` - Update availability

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `PUT /api/patients/:id` - Update patient

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update status
- `DELETE /api/appointments/:id` - Delete appointment

### Dashboard
- `GET /api/dashboard/admin/stats` - Admin statistics
- `GET /api/dashboard/doctor/stats` - Doctor statistics
- `GET /api/dashboard/patient/stats` - Patient statistics

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional healthcare-themed interface
- **Responsive Layout** - Works on desktop, tablet, and mobile devices
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Charts** - Recharts for data visualization
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Glassmorphism** - Modern glass-effect cards
- **Gradient Backgrounds** - Beautiful color transitions

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **HTTP-Only Cookies** - Secure cookie storage
- **Role-Based Access** - Authorization middleware
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the production bundle:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables on your hosting platform
2. Push code to your repository
3. Configure build command: `npm install`
4. Configure start command: `npm start`

### Database Deployment

Use MongoDB Atlas for cloud database:
1. Create account at mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 📝 Development Guidelines

### Code Style
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to repository
git push origin feature/your-feature-name
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- Unsplash for healthcare images
- Tailwind CSS team for the amazing framework
- React and Node.js communities

## 📞 Support

For support, email support@healthcarepro.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time chat between doctors and patients
- [ ] Video consultation integration
- [ ] Mobile applications (React Native)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment gateway integration
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] PDF report generation

---

**Made with ❤️ for better healthcare management**