import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../service/orderService";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Orders = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Set up real-time listener for orders
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(orders);
      console.log('Orders updated:', orders);
    }, (error) => {
      console.error('Error fetching orders:', error);
      toast.error("Unable to display the orders. Please try again.");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const updateStatus = async (event, orderId) => {
    try {
      await updateOrderStatus(orderId, event.target.value);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>Order Items</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Items Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      {order.orderedItems.map((item, index) => (
                        <span key={index}>
                          {item.name} x {item.quantity}
                          {index < order.orderedItems.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{order.userAddress}</td>
                  <td>&#x20B9;{order.amount.toFixed(2)}</td>
                  <td>{order.orderedItems.length}</td>
                  <td>
                    <select
                      className="form-control"
                      onChange={(event) => updateStatus(event, order.id)}
                      value={order.orderStatus}
                    >
                      <option value="Food Preparing">Food Preparing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
