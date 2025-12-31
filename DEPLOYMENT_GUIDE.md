# Baby Meal Tracker - Complete Setup & Deployment Guide

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase account created
- [ ] GitHub account (for deployment)
- [ ] Vercel account

## Step-by-Step Setup

### STEP 1: Download and Extract Project Files

The project structure has been created in `/home/claude/baby-meal-tracker-app/`

Download all files from `/mnt/user-data/outputs/` to your local machine.

### STEP 2: Install Dependencies

```bash
cd baby-meal-tracker-app
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase SDK
- Lucide Icons

### STEP 3: Firebase Setup (CRITICAL)

#### 3.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `baby-meal-tracker` (or your choice)
4. Disable Google Analytics (optional, can enable later)
5. Click **"Create project"**

#### 3.2 Enable Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose database location (select closest to you):
   - `us-central` (Iowa) for USA
   - `europe-west` for Europe
   - `asia-south1` for India
5. Click **"Enable"**

#### 3.3 Set Up Security Rules

1. In Firestore Database, click **"Rules"** tab
2. Replace with this (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**⚠️ WARNING**: These rules allow anyone to access your data. For production, add authentication!

#### 3.4 Get Firebase Config

1. In Firebase Console, click the **gear icon** (Project settings)
2. Scroll to **"Your apps"**
3. Click the **web icon** (`</>`)
4. Enter app nickname: `Baby Meal Tracker Web`
5. **Don't check** "Firebase Hosting"
6. Click **"Register app"**
7. **COPY** the `firebaseConfig` object - you'll need these values!

### STEP 4: Configure Environment Variables

1. In your project folder, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Firebase values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
   ```

### STEP 5: Test Locally

```bash
npm run dev
```

Visit: http://localhost:3000

**Test the app**:
1. Add a dish in Tracker tab
2. Check Firebase Console → Firestore Database → Data tab
3. You should see a `meals` collection with today's date as document ID

### STEP 6: Complete Component Files

The main logic is in place. You need to copy the remaining UI components from the original JSX file.

Copy these sections from `/home/claude/baby-meal-tracker.jsx` to create:

**`components/MealCard.tsx`** - Extract the `MealCard` function
**`components/DishItem.tsx`** - Extract the `DishItem` function  
**`components/DishForm.tsx`** - Extract the `DishForm` function
**`components/DashboardView.tsx`** - Extract `DashboardView` and `DayCard` functions
**`components/DishDatabaseView.tsx`** - Extract `DishDatabaseView`, `DishDBItem`, and `DishDBForm` functions

Convert them to TypeScript with proper type annotations.

### STEP 7: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Baby Meal Tracker"

# Create repository on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/baby-meal-tracker.git

# Push
git branch -M main
git push -u origin main
```

### STEP 8: Deploy to Vercel

#### Option A: Via GitHub (Recommended)

1. Go to https://vercel.com
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. After connecting, click **"New Project"**
4. **Import** your `baby-meal-tracker` repository
5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: Leave default
   - **Output Directory**: Leave default

6. **Add Environment Variables**:
   Click **"Environment Variables"** and add all 6 variables from `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   ```

7. Click **"Deploy"**

8. Wait 2-3 minutes for build to complete

9. Your app is live at: `https://your-project.vercel.app` 🎉

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel

# When prompted for environment variables, add them one by one
# Follow the prompts
```

### STEP 9: Update Firebase Settings (Production)

1. Go to Firebase Console → Project Settings
2. Scroll to **"Authorized domains"**
3. Add your Vercel domain: `your-project.vercel.app`

## Database Structure

### Collections Created Automatically:

**`meals`** (Collection)
- Documents keyed by date (e.g., `2025-01-01`)
- Contains meal data for each day

**`dishDatabase`** (Collection)  
- Contains reusable dishes with calorie info
- Auto-generated document IDs

## File Structure Overview

```
baby-meal-tracker-app/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (renders MealTracker)
│   └── globals.css         # Tailwind imports
├── components/
│   ├── MealTracker.tsx     # Main component with state & Firestore
│   ├── TrackerView.tsx     # Daily meal tracker UI
│   ├── MealCard.tsx        # Individual meal card
│   ├── DishItem.tsx        # Dish display/edit
│   ├── DishForm.tsx        # Add dish form
│   ├── DashboardView.tsx   # Analytics view
│   ├── DayCard.tsx         # Expandable day summary
│   ├── DishDatabaseView.tsx # Dish database management
│   └── DishDBItem.tsx      # Database dish item
├── lib/
│   ├── firebase.ts         # Firebase app initialization
│   └── firestore.ts        # All database operations
├── .env.local              # Your Firebase credentials (NEVER commit)
├── .env.local.example      # Template for environment variables
├── .gitignore              # Excludes node_modules, .env.local, etc.
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Common Issues & Solutions

### Issue: "Firebase: No Firebase App '[DEFAULT]' has been created"
**Solution**: Check that `.env.local` variables are set correctly and restart dev server

### Issue: "Permission denied" when writing to Firestore
**Solution**: Update Firestore Rules to allow writes (see Step 3.3)

### Issue: Build fails on Vercel
**Solution**: 
1. Check all environment variables are added in Vercel dashboard
2. Ensure no typos in variable names (must match exactly)
3. Check build logs for specific error

### Issue: Data not saving
**Solution**:
1. Open browser console (F12)
2. Look for Firebase errors
3. Verify Firestore rules allow writes
4. Check network tab for failed requests

## Next Steps After Deployment

### Add Authentication (Recommended for Production)

1. Enable Email/Password or Google Sign-In in Firebase Console
2. Update Firestore rules to require authentication
3. Add login page to Next.js app

### Example production Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own data
    match /meals/{document} {
      allow read, write: if request.auth != null;
    }
    match /dishDatabase/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Custom Domain

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring & Analytics

- **Vercel Analytics**: Enabled by default (see Analytics tab)
- **Firebase Usage**: Monitor in Firebase Console → Usage tab
- **Error Tracking**: Check Vercel Logs and browser console

## Backup Strategy

Firestore data is automatically backed up by Google, but for extra safety:

1. Go to Firebase Console → Firestore → Import/Export
2. Set up scheduled exports to Google Cloud Storage

## Cost Estimates (Free Tiers)

- **Vercel**: 100GB bandwidth/month (plenty for personal use)
- **Firebase**: 
  - 1GB storage
  - 50K reads/day
  - 20K writes/day
  - Should cover single-family use indefinitely

## Support

- GitHub Issues: Open an issue on your repository
- Firebase Support: https://firebase.google.com/support
- Vercel Support: https://vercel.com/support

## Happy Tracking! 🍼📊

Your baby's nutrition data is now safely stored in the cloud and accessible from any device!
