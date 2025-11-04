# ⚡ Quick Start Guide - Healthcare Management System

Get your Healthcare Management System up and running in minutes!

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Step 1: Clone & Install

```bash
# Navigate to project directory
cd healthcare-management-system

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

#### Server Configuration

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://tchakri_db_user:chakri2006@cluster0.t82bevd.mongodb.net/healthcare-management?retryWrites=true&w=majority

JWT_SECRET=healthcare_pro_super_secret_jwt_key_2024_min_32_characters_long_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Gmail configuration (optional for development)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=HealthCare Pro <noreply@healthcarepro.com>

FRONTEND_URL=http://localhost:5173
```

#### Client Configuration

Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=HealthCare Pro
VITE_APP_VERSION=1.0.0
```

### Step 3: Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates:
- 1 Admin account
- 5 Doctors
- 10 Patients
- Sample appointments

### Step 4: Start Development Servers

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

### Step 5: Access Application

Open your browser and go to: **http://localhost:5173**

---

## 🔑 Default Login Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@healthcare.com | admin123 |
| **Doctor** | dr.smith@healthcare.com | doctor123 |
| **Patient** | patient1@email.com | patient123 |

---

## 🎯 What You Can Do Now

### As a Patient:
1. ✅ Browse available doctors
2. ✅ Book appointments
3. ✅ View appointment history
4. ✅ Cancel appointments
5. ✅ Update profile
6. ✅ Change password

### As a Doctor:
1. ✅ View all appointments
2. ✅ Confirm/reject appointments
3. ✅ Mark appointments as completed
4. ✅ View patient details
5. ✅ Update profile
6. ✅ Manage schedule

### As an Admin:
1. ✅ View system statistics
2. ✅ Manage users
3. ✅ View analytics
4. ✅ System settings

---

## 🌐 Production Deployment

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy Backend to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Set root directory to `server`
   - Add environment variables
   - Deploy

3. **Deploy Frontend to Vercel**
   - Go to https://vercel.com
   - Import GitHub repo
   - Set root directory to `client`
   - Add environment variables
   - Deploy

4. **Update URLs**
   - Update `CLIENT_URL` in Render with Vercel URL
   - Update `VITE_API_URL` in Vercel with Render URL
   - Redeploy both services

---

## 🔧 Troubleshooting

### Backend won't start
- ✅ Check MongoDB connection string
- ✅ Verify all environment variables are set
- ✅ Ensure port 5000 is not in use

### Frontend won't start
- ✅ Check `VITE_API_URL` is correct
- ✅ Ensure port 5173 is not in use
- ✅ Run `npm install` again

### Login not working
- ✅ Check backend is running
- ✅ Verify CORS configuration
- ✅ Check browser console for errors
- ✅ Ensure database is seeded

### CORS errors
- ✅ Verify `CLIENT_URL` matches frontend URL
- ✅ Check backend CORS configuration
- ✅ Ensure credentials are enabled

---

## 📚 Project Structure

```
healthcare-management-system/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Database & email config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error handling
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
├── client/                # Frontend (React + Vite)
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React Context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── vite.config.js    # Vite configuration
│
├── DEPLOYMENT.md         # Deployment guide
├── FIXES_APPLIED.md      # List of fixes
├── QUICKSTART.md         # This file
└── README.md             # Main documentation
```

---

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Nodemailer

---

## 📞 Need Help?

1. Check **[DEPLOYMENT.md](./DEPLOYMENT.md)** for deployment issues
2. Check **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** for implemented features
3. Review **[README.md](./README.md)** for full documentation
4. Check server logs for backend errors
5. Check browser console for frontend errors

---

## ✨ Next Steps

1. ✅ Customize branding and colors
2. ✅ Add your own logo
3. ✅ Configure email service
4. ✅ Set up custom domain
5. ✅ Add more features
6. ✅ Deploy to production

---

**Happy Coding! 🚀**

Made with ❤️ for better healthcare management
