import { db } from '../firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';

const ordersCollection = collection(db, 'orders');

export const fetchAllOrders = async () => {
  try {
    console.log('Fetching all orders from Firestore');
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Found orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log('Updating order status:', { orderId, newStatus });
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      orderStatus: newStatus,
      updatedAt: new Date().toISOString()
    });
    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 