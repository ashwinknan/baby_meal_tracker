import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Dish {
  name: string;
  before: number;
  after: number;
  id?: number;
}

export interface Meal {
  time: string;
  dishes: Dish[];
}

export interface DayMeals {
  meal1: Meal;
  meal2: Meal;
  meal3: Meal;
  meal4: Meal;
}

export interface DishDBItem {
  id?: string;
  name: string;
  caloriesPer100g: number | null;
}

// Collections
const MEALS_COLLECTION = 'meals';
const DISH_DB_COLLECTION = 'dishDatabase';

// ============ MEALS CRUD ============

export const saveMealsForDate = async (date: string, meals: DayMeals): Promise<void> => {
  try {
    const docRef = doc(db, MEALS_COLLECTION, date);
    await setDoc(docRef, {
      date,
      meals,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving meals:', error);
    throw error;
  }
};

export const getMealsForDate = async (date: string): Promise<DayMeals | null> => {
  try {
    const docRef = doc(db, MEALS_COLLECTION, date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().meals as DayMeals;
    }
    return null;
  } catch (error) {
    console.error('Error getting meals:', error);
    throw error;
  }
};

export const getMealsForDateRange = async (
  startDate: string,
  endDate: string
): Promise<{ date: string; meals: DayMeals }[]> => {
  try {
    const mealsRef = collection(db, MEALS_COLLECTION);
    const q = query(
      mealsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    const results: { date: string; meals: DayMeals }[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        date: data.date,
        meals: data.meals as DayMeals,
      });
    });
    
    // Sort by date
    results.sort((a, b) => a.date.localeCompare(b.date));
    
    return results;
  } catch (error) {
    console.error('Error getting meals for date range:', error);
    throw error;
  }
};

// ============ DISH DATABASE CRUD ============

export const getAllDishes = async (): Promise<DishDBItem[]> => {
  try {
    const dishesRef = collection(db, DISH_DB_COLLECTION);
    const querySnapshot = await getDocs(dishesRef);
    
    const dishes: DishDBItem[] = [];
    querySnapshot.forEach((doc) => {
      dishes.push({
        id: doc.id,
        ...doc.data(),
      } as DishDBItem);
    });
    
    // Sort alphabetically by name
    dishes.sort((a, b) => a.name.localeCompare(b.name));
    
    return dishes;
  } catch (error) {
    console.error('Error getting dishes:', error);
    throw error;
  }
};

export const addDish = async (dish: Omit<DishDBItem, 'id'>): Promise<string> => {
  try {
    const dishesRef = collection(db, DISH_DB_COLLECTION);
    const newDocRef = doc(dishesRef);
    
    await setDoc(newDocRef, {
      name: dish.name,
      caloriesPer100g: dish.caloriesPer100g,
      createdAt: Timestamp.now(),
    });
    
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding dish:', error);
    throw error;
  }
};

export const updateDish = async (dishId: string, dish: Partial<DishDBItem>): Promise<void> => {
  try {
    const docRef = doc(db, DISH_DB_COLLECTION, dishId);
    await setDoc(docRef, {
      ...dish,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating dish:', error);
    throw error;
  }
};

export const deleteDish = async (dishId: string): Promise<void> => {
  try {
    const docRef = doc(db, DISH_DB_COLLECTION, dishId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
};
