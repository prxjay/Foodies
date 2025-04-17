import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const foodItemsCollection = collection(db, 'foodItems');

export const addFoodItem = async (foodItem) => {
  try {
    const docRef = await addDoc(foodItemsCollection, foodItem);
    return docRef.id;
  } catch (error) {
    console.error('Error adding food item:', error);
    throw error;
  }
};

export const updateFoodItem = async (id, updatedData) => {
  try {
    const foodItemRef = doc(db, 'foodItems', id);
    await updateDoc(foodItemRef, updatedData);
  } catch (error) {
    console.error('Error updating food item:', error);
    throw error;
  }
};

export const deleteFoodItem = async (id) => {
  try {
    const foodItemRef = doc(db, 'foodItems', id);
    await deleteDoc(foodItemRef);
  } catch (error) {
    console.error('Error deleting food item:', error);
    throw error;
  }
};

export const getAllFoodItems = async () => {
  try {
    const querySnapshot = await getDocs(foodItemsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting food items:', error);
    throw error;
  }
};