# 🚀 Healthcare Management System - Deployment Guide

This guide will walk you through deploying your Healthcare Management System to production using **Render** for the backend and **Vercel** for the frontend.

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ A GitHub account
2. ✅ A Render account (https://render.com)
3. ✅ A Vercel account (https://vercel.com)
4. ✅ MongoDB Atlas account with a cluster set up
5. ✅ Gmail account for sending emails (with App Password enabled)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create a new account
3. Create a new cluster (Free tier is sufficient)
4. Wait for the cluster to be created (takes 3-5 minutes)

### 1.2 Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a user with username: `tchakri_db_user` and password: `chakri2006`
4. Set privileges to **Read and write to any database**
5. Click **Add User**

### 1.3 Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 1.4 Get Connection String

1. Go to **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with `chakri2006`
6. Your connection string should look like:
   ```
   mongodb+srv://tchakri_db_user:chakri2006@cluster0.xxxxx.mongodb.net/healthcare-management?retryWrites=true&w=majority
   ```

---

## 📧 Step 2: Set Up Gmail for Email Notifications

### 2.1 Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to **Security**
3. Enable **2-Step Verification**

### 2.2 Generate App Password

1. In Google Account Security settings
2. Go to **App passwords**
3. Select **Mail** and **Other (Custom name)**
4. Name it "Healthcare Pro"
5. Click **Generate**
6. Copy the 16-character password (save it securely)

---

## 🔧 Step 3: Deploy Backend to Render

### 3.1 Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Healthcare Management System"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/healthcare-management.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Render

1. Go to https://render.com and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `healthcare-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.3 Add Environment Variables

Click **Advanced** and add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://tchakri_db_user:chakri2006@cluster0.xxxxx.mongodb.net/healthcare-management?retryWrites=true&w=majority
JWT_SECRET=healthcare_pro_super_secret_jwt_key_2024_min_32_characters_long_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=HealthCare Pro <noreply@healthcarepro.com>
CLIENT_URL=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
```

**Important**: Replace:
- `cluster0.xxxxx.mongodb.net` with your actual MongoDB Atlas connection string
- `your-email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the App Password from Step 2.2
- `your-app-name.vercel.app` with your Vercel URL (you'll get this in Step 4)

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait for the deployment to complete (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://healthcare-backend.onrender.com`)

---

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Update Environment Variables

1. In your local project, update `client/.env`:

```env
VITE_API_URL=https://healthcare-backend.onrender.com/api
VITE_APP_NAME=HealthCare Pro
VITE_APP_VERSION=1.0.0
```

Replace `healthcare-backend.onrender.com` with your actual Render backend URL.

2. Commit and push changes:

```bash
git add client/.env
git commit -m "Update API URL for production"
git push origin main
```

### 4.2 Deploy on Vercel

1. Go to https://vercel.com and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variables

In the **Environment Variables** section, add:

```
VITE_API_URL=https://healthcare-backend.onrender.com/api
VITE_APP_NAME=HealthCare Pro
VITE_APP_VERSION=1.0.0
```

### 4.4 Deploy

1. Click **Deploy**
2. Wait for deployment to complete (2-5 minutes)
3. Once deployed, you'll get your frontend URL (e.g., `https://healthcare-pro.vercel.app`)

---

## 🔄 Step 5: Update Backend with Frontend URL

### 5.1 Update Render Environment Variables

1. Go back to your Render dashboard
2. Select your `healthcare-backend` service
3. Go to **Environment**
4. Update these variables with your actual Vercel URL:
   ```
   CLIENT_URL=https://healthcare-pro.vercel.app
   FRONTEND_URL=https://healthcare-pro.vercel.app
   ```
5. Click **Save Changes**
6. The service will automatically redeploy

---

## 🌱 Step 6: Seed the Database (Optional but Recommended)

### 6.1 Using Render Shell

1. In your Render dashboard, go to your backend service
2. Click **Shell** tab
3. Run the seeder command:
   ```bash
   npm run seed
   ```

### 6.2 Or Seed Locally

```bash
cd server
node utils/seeder.js
```

This will create:
- 1 Admin account
- 5 Doctor accounts
- 10 Patient accounts
- Sample appointments

---

## ✅ Step 7: Test Your Deployment

### 7.1 Access Your Application

1. Open your Vercel URL in a browser
2. You should see the landing page

### 7.2 Test Login

Use these default credentials (if you seeded the database):

**Admin:**
- Email: `admin@healthcare.com`
- Password: `admin123`

**Doctor:**
- Email: `dr.smith@healthcare.com`
- Password: `doctor123`

**Patient:**
- Email: `patient1@email.com`
- Password: `patient123`

### 7.3 Test Features

1. ✅ Login with different roles
2. ✅ Book an appointment (as patient)
3. ✅ View appointments (as doctor/patient)
4. ✅ Update profile
5. ✅ Change password
6. ✅ Check email notifications

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- **Solution**: Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- **Solution**: Make sure `CLIENT_URL` and `FRONTEND_URL` match your Vercel URL exactly

**Problem**: Email not sending
- **Solution**: 
  - Verify Gmail App Password is correct
  - Check that 2FA is enabled on your Google account
  - Look for email errors in Render logs

### Frontend Issues

**Problem**: API calls failing
- **Solution**: 
  - Check that `VITE_API_URL` is set correctly
  - Verify backend is running on Render
  - Check browser console for CORS errors

**Problem**: Build failing on Vercel
- **Solution**:
  - Ensure `client` is set as root directory
  - Check that all dependencies are in `package.json`
  - Review build logs for specific errors

### Database Issues

**Problem**: Cannot connect to MongoDB
- **Solution**:
  - Verify IP whitelist includes 0.0.0.0/0
  - Check database user credentials
  - Ensure connection string is correct

---

## 🔄 Updating Your Deployment

### Update Backend

```bash
# Make changes to server code
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically redeploy.

### Update Frontend

```bash
# Make changes to client code
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically redeploy.

---

## 📊 Monitoring

### Render Dashboard

- View logs: Go to your service → **Logs** tab
- Monitor performance: Check **Metrics** tab
- View deployments: Check **Events** tab

### Vercel Dashboard

- View deployments: Go to your project → **Deployments**
- Check analytics: **Analytics** tab
- View logs: Click on a deployment → **Function Logs**

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong JWT secrets (32+ characters)
3. ✅ Rotate passwords regularly
4. ✅ Enable MongoDB Atlas IP whitelist in production
5. ✅ Use HTTPS only (Render and Vercel provide this automatically)
6. ✅ Regularly update dependencies
7. ✅ Monitor logs for suspicious activity

---

## 💰 Cost Considerations

### Free Tier Limits

**Render Free Tier:**
- 750 hours/month
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- No spin-down

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared RAM
- Sufficient for development and small production apps

### Upgrading

If you need better performance:
- **Render**: Upgrade to Starter ($7/month) for always-on service
- **Vercel**: Pro plan ($20/month) for more bandwidth
- **MongoDB Atlas**: Upgrade to M10 ($57/month) for dedicated cluster

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render/Vercel logs
3. Check MongoDB Atlas connection
4. Verify all environment variables
5. Test locally first before deploying

---

## 🎉 Congratulations!

Your Healthcare Management System is now live! 🚀

**Next Steps:**
- Customize the branding
- Add more features
- Set up custom domain
- Configure email templates
- Add analytics
- Set up monitoring alerts

---

**Made with ❤️ for better healthcare management**
