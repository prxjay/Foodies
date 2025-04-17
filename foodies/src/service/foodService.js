import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const foodItemsCollection = collection(db, 'foodItems');

export const fetchFoodList = async () => {
    try {
        const querySnapshot = await getDocs(foodItemsCollection);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching food list:', error);
        throw error;
    }
};

export const fetchFoodDetails = async (id) => {
    try {
        const docRef = doc(db, 'foodItems', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            throw new Error('Food item not found');
        }
    } catch (error) {
        console.error('Error fetching food details:', error);
        throw error;
    }
};