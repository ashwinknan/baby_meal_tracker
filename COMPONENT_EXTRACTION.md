# Quick Component Extraction Guide

Since I've created the TypeScript/Next.js structure, you need to extract the remaining UI components from the original JSX file.

## Files to Create (from baby-meal-tracker.jsx)

### 1. components/MealCard.tsx
Extract lines ~241-307 (the MealCard function)
Convert to TypeScript with these types:
```typescript
interface Dish {
  id: number;
  name: string;
  before: number;
  after: number;
}

interface Meal {
  time: string;
  dishes: Dish[];
}

interface MealCardProps {
  mealType: string;
  mealData: Meal;
  onAddDish: (dish: Omit<Dish, 'id'>) => void;
  onUpdateDish: (dishId: number, dish: Partial<Dish>) => void;
  onDeleteDish: (dishId: number) => void;
  onUpdateTime: (time: string) => void;
  showAddDish: boolean;
  setShowAddDish: (mealType: string | null) => void;
  editingDish: number | null;
  setEditingDish: (dishId: number | null) => void;
}

export function MealCard({ ...props }: MealCardProps) {
  // paste component code here
}
```

### 2. components/DishItem.tsx  
Extract lines ~309-363 (DishItem function)

### 3. components/DishForm.tsx
Extract lines ~365-405 (DishForm function)

### 4. components/DashboardView.tsx
Extract lines ~407-523 (DashboardView function)

### 5. components/DayCard.tsx
Extract lines ~525-587 (DayCard function)

### 6. components/DishDatabaseView.tsx
Extract lines ~589-700 (DishDatabaseView, DishDBItem, DishDBForm functions)

## Or Use Simpler Approach

Just copy the entire baby-meal-tracker.jsx content into components/AllViews.tsx and import what you need.

The Firestore integration in lib/firestore.ts handles all the backend logic!

## Test Checklist

After creating components:

1. `npm run dev` - should compile without errors
2. Add a meal - should save to Firestore
3. Refresh page - should load saved data
4. Add to dish DB - should persist
5. View dashboard - should show historical data
