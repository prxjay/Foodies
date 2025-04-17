import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase';

const ordersCollection = collection(db, 'orders');

export const createOrder = async (orderData, token) => {
  try {
    console.log('Creating order with data:', orderData);
    
    // Validate required fields
    const requiredFields = ['userAddress', 'phoneNumber', 'email', 'orderedItems', 'amount', 'paymentMethod', 'paymentStatus'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate orderedItems
    if (!Array.isArray(orderData.orderedItems) || orderData.orderedItems.length === 0) {
      throw new Error('Ordered items must be a non-empty array');
    }

    // Validate each ordered item
    orderData.orderedItems.forEach((item, index) => {
      const requiredItemFields = ['foodId', 'quantity', 'price', 'name'];
      const missingItemFields = requiredItemFields.filter(field => !item[field]);
      
      if (missingItemFields.length > 0) {
        throw new Error(`Item ${index + 1} is missing required fields: ${missingItemFields.join(', ')}`);
      }
    });

    // Get current user's UID
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be logged in to place an order');
    }

    // Create a clean order object with all required fields
    const cleanOrderData = {
      userAddress: String(orderData.userAddress || ''),
      phoneNumber: String(orderData.phoneNumber || ''),
      email: String(orderData.email || ''),
      orderedItems: orderData.orderedItems.map(item => ({
        foodId: String(item.foodId || ''),
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        category: String(item.category || ''),
        imageUrl: String(item.imageUrl || ''),
        description: String(item.description || ''),
        name: String(item.name || '')
      })),
      amount: Number(orderData.amount || 0),
      paymentMethod: String(orderData.paymentMethod || ''),
      paymentStatus: String(orderData.paymentStatus || ''),
      orderStatus: 'Food Preparing', // Changed from 'Preparing' to match admin panel
      createdAt: new Date().toISOString(),
      userId: currentUser.uid // Using the actual user's UID instead of token
    };

    console.log('Saving order to Firestore:', cleanOrderData);
    const docRef = await addDoc(ordersCollection, cleanOrderData);
    console.log('Order created with ID:', docRef.id);

    return {
      id: docRef.id,
      ...cleanOrderData
    };
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    console.log('Fetching orders for user:', userId);
    const q = query(ordersCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Found orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    console.log('Fetching all orders');
    const querySnapshot = await getDocs(ordersCollection);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Found all orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
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

export const updatePaymentStatus = async (orderId, newStatus) => {
  try {
    console.log('Updating payment status:', { orderId, newStatus });
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus: newStatus,
      updatedAt: new Date().toISOString()
    });
    console.log('Payment status updated successfully');
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId, token) => {
  try {
    // Implement order deletion if needed
    console.log('Order deletion not implemented yet');
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData, token) => {
  try {
    // Implement payment verification if needed
    console.log('Payment verification not implemented yet');
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};