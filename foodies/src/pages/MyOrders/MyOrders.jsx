import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Set up real-time listener for user's orders
    const ordersCollection = collection(db, 'orders');
    const q = query(
      ordersCollection,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(userOrders);
      console.log('Orders updated:', userOrders);
    }, (error) => {
      console.error('Error fetching orders:', error);
      toast.error("Unable to load your orders. Please try again.");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Preparing':
        return 'status-preparing';
      case 'Out for delivery':
        return 'status-delivering';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id.slice(0, 8)}</span>
                <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-details">
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.orderedItems.map((item, index) => (
                      <li key={index}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-info">
                  <p><strong>Total Amount:</strong> ₹{order.amount.toFixed(2)}</p>
                  <p><strong>Delivery Address:</strong> {order.userAddress}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
