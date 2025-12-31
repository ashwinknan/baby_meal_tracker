# Baby Meal Tracker

A mobile-friendly web app to track your baby's meals, calorie intake, and food database built with Next.js, React, TypeScript, Tailwind CSS, and Firebase Firestore.

## Features

- **📅 Daily Meal Tracker**: Track 4 meals per day with multiple dishes per meal
- **📊 Dashboard**: View calorie consumption over custom date ranges (up to 30 days)
- **📚 Dish Database**: Maintain a database of dishes with calorie information
- **📱 Mobile-Friendly**: Optimized for one-handed use
- **💾 Cloud Storage**: All data synced to Firebase Firestore
- **✏️ Easy Editing**: Quick edit and delete functionality for all entries

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is sufficient)
- Vercel account (free tier is sufficient)
- Git installed

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd baby-meal-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Firestore Database:
   - Click "Firestore Database" in the left menu
   - Click "Create database"
   - Start in **production mode**
   - Choose a location close to you
4. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (`</>`)
   - Register your app
   - Copy the config object

### 4. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 5. Set Up Firestore Security Rules

In Firebase Console, go to Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all read/write for development
    // TODO: Add authentication and restrict access
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow anyone to read/write. For production, implement Firebase Authentication and restrict access.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - Framework Preset: Next.js (auto-detected)
     - Root Directory: `./`
     - Build Command: `npm run build` (default)
   - Add Environment Variables:
     - Click "Environment Variables"
     - Add all variables from `.env.local`
   - Click "Deploy"

3. **Your app will be live at**: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts and add environment variables when asked
```

## Project Structure

```
baby-meal-tracker-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── MealTracker.tsx     # Main component
│   ├── TrackerView.tsx     # Daily tracker view
│   ├── DashboardView.tsx   # Analytics dashboard
│   └── DishDatabaseView.tsx # Dish management
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   └── firestore.ts        # Firestore operations
├── .env.local.example      # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## Firestore Data Structure

### Collections

**`meals` collection**:
```javascript
{
  // Document ID is the date (YYYY-MM-DD)
  "2025-01-01": {
    date: "2025-01-01",
    meals: {
      meal1: {
        time: "08:00",
        dishes: [
          {
            id: 1704067200000,
            name: "Rice porridge",
            before: 100,  // grams
            after: 20     // grams
          }
        ]
      },
      meal2: { ... },
      meal3: { ... },
      meal4: { ... }
    },
    updatedAt: Timestamp
  }
}
```

**`dishDatabase` collection**:
```javascript
{
  // Auto-generated document ID
  "abc123": {
    name: "Rice porridge",
    caloriesPer100g: 85,
    createdAt: Timestamp
  }
}
```

## Usage

### Adding a Meal
1. Select date in Tracker tab
2. Click "+ Add Dish" under desired meal
3. Enter dish name, before weight, and after weight
4. Click "Add"
5. Data auto-saves to Firestore

### Viewing History
1. Go to Dashboard tab
2. Select date range (up to 30 days)
3. View average calories and daily breakdown
4. Tap any day to expand and see details

### Managing Dish Database
1. Go to Dish DB tab
2. Click "+ Add Dish"
3. Enter dish name and optional calories per 100g
4. Edit or delete existing dishes as needed

## Customization

### Changing Calorie Calculation
Edit the `calculateCalories` function in `components/MealTracker.tsx`:
```typescript
const calculateCalories = (grams: number) => {
  return Math.round(grams * 1.2); // Adjust multiplier
};
```

### Adding Authentication
1. Enable Firebase Authentication in Console
2. Update Firestore security rules
3. Add auth logic to components

## Future Enhancements

- [ ] User authentication
- [ ] Multiple baby profiles
- [ ] Export data to CSV/PDF
- [ ] Photo uploads for dishes
- [ ] Growth tracking charts
- [ ] Meal templates/favorites
- [ ] Nutritional information beyond calories
- [ ] Sharing reports with pediatrician

## Troubleshooting

**Build fails on Vercel**:
- Check all environment variables are set correctly
- Ensure Firebase credentials are valid
- Check build logs for specific errors

**Data not saving**:
- Check browser console for errors
- Verify Firestore rules allow writes
- Confirm environment variables are loaded

**Can't connect to Firebase**:
- Verify `.env.local` variables match Firebase config exactly
- Check Firebase project is active
- Ensure billing is enabled if using paid features

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
