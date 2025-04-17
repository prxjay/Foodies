import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/contants";
import { useNavigate, Link } from "react-router-dom";
import {
  createOrder,
  deleteOrder,
  verifyPayment,
} from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../../components/StripePayment/StripePayment';
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51R8FnyH4Hfp4qbVG0pSRuNKr9hkfXp5j3hw44zVEzVgtYlNZjZO6lEzGkTyPsvr1AJ4dqf8KbRGmNdUqIjHV5HIj00S2iigSuA');

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Load Stripe asynchronously
    const loadStripe = async () => {
      try {
        const stripeModule = await import('@stripe/stripe-js');
        const stripe = await stripeModule.loadStripe('pk_test_51R8FnyH4Hfp4qbVG0pSRuNKr9hkfXp5j3hw44zVEzVgtYlNZjZO6lEzGkTyPsvr1AJ4dqf8KbRGmNdUqIjHV5HIj00S2iigSuA');
        setStripeLoaded(true);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        toast.error('Payment system is currently unavailable. Please try again later.');
      }
    };

    if (paymentMethod === 'stripe') {
      loadStripe();
    }
  }, [paymentMethod]);

  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "Tamil Nadu",
    city: "",
    zip: "",
    landmark: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phoneNumber', 'address', 'city', 'zip'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!data.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (data.phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleStripePayment = async (orderId) => {
    try {
      const stripeModule = await import('@stripe/stripe-js');
      const stripe = await stripeModule.loadStripe('pk_test_51R8FnyH4Hfp4qbVG0pSRuNKr9hkfXp5j3hw44zVEzVgtYlNZjZO6lEzGkTyPsvr1AJ4dqf8KbRGmNdUqIjHV5HIj00S2iigSuA');
      
      // Create a checkout session on your server
      const response = await fetch('http://localhost:8080/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: orderData.amount,
          currency: 'inr',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error('Payment system is currently unavailable. Please try again later.');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const { total } = calculateCartTotals(cartItems, quantities);

    const orderData = {
      userAddress: `${data.name}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber.toString(),
      email: data.email,
      orderedItems: cartItems.map((item) => {
        const quantity = quantities[item.id] || 0;
        const price = item.price || 0;
        return {
          foodId: item.id.toString(),
          quantity: Number(quantity),
          price: Number((price * quantity).toFixed(2)),
          category: item.category || '',
          imageUrl: item.imageUrl || '',
          description: item.description || '',
          name: item.name || ''
        };
      }),
      amount: Number(total.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid'
    };

    try {
      const response = await createOrder(orderData, token);
      if (response.id) {
        if (paymentMethod === 'cod') {
          await Swal.fire({
            title: 'Order Placed Successfully!',
            text: 'Your order has been placed and is being prepared.',
            icon: 'success',
            confirmButtonText: 'View Orders',
            showCancelButton: true,
            cancelButtonText: 'Continue Shopping',
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/myorders');
            } else {
              navigate('/');
            }
          });
          await clearCartItems(token);
          setQuantities({});
        } else {
          await handleStripePayment(response.id);
        }
      } else {
        toast.error('Unable to place order. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Unable to place order. Please try again.');
      console.error('Order error:', error);
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount, //Convert to paise
      currency: "INR",
      name: "Food Land",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: verifyPaymentHandler,
      prefill: {
        name: `${data.name}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: deleteOrderHandler,
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPaymentHandler = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };
    try {
      const success = await verifyPayment(paymentData, token);
      if (success) {
        toast.success("Payment successful.");
        await clearCartItems(token);
        navigate("/myorders");
      } else {
        toast.error("Payment failed. Please try again.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      await deleteOrder(orderId, token);
    } catch (error) {
      toast.error("Something went wrong. Contact support.");
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const orderedItems = foodList
        .filter((food) => quantities[food.id] > 0)
        .map((food) => ({
          foodId: food.id,
          quantity: quantities[food.id],
          price: food.price,
          name: food.name,
          category: food.category,
          imageUrl: food.imageUrl,
          description: food.description,
        }));

      const orderData = {
        ...data,
        orderedItems,
        amount: calculateCartTotals(foodList.filter(food => quantities[food.id] > 0), quantities).total,
        paymentMethod: 'card',
        paymentStatus: 'paid',
      };

      await createOrder(orderData, token);
      toast.success('Order placed successfully!');
      navigate('/myorders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Place Your Order</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={onSubmitHandler} className="shadow-sm p-4 rounded bg-white border">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={data.email}
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text">+91</span>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={onChangeHandler}
                  required
                  maxLength="10"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={data.address}
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="landmark" className="form-label">Nearest Landmark (Optional)</label>
              <input
                type="text"
                className="form-control"
                id="landmark"
                name="landmark"
                value={data.landmark}
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <select
                className="form-control"
                id="city"
                name="city"
                value={data.city}
                onChange={onChangeHandler}
                required
              >
                <option value="">Select City</option>
                <option value="Vellore">Vellore</option>
                <option value="Katpadi">Katpadi</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                value={data.state}
                readOnly
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="zip" className="form-label">ZIP Code</label>
              <input
                type="text"
                className="form-control"
                id="zip"
                name="zip"
                value={data.zip}
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <div className="border rounded p-2 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery
                  </label>
                </div>
              </div>
              <div className="border rounded p-2 mb-2 position-relative">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="stripe"
                    value="stripe"
                    disabled
                  />
                  <label className="form-check-label text-muted" htmlFor="stripe">
                    Stripe <span className="badge bg-secondary ms-2">currently unavailable</span>
                  </label>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
            >
              Place Order
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="shadow-sm p-4 rounded bg-white border">
            <h5 className="card-title">Order Summary</h5>
            {foodList.filter(food => quantities[food.id] > 0).map((food) => (
              <div key={food.id} className="d-flex justify-content-between mb-2">
                <span>{food.name} x {quantities[food.id]}</span>
                <span>₹{(food.price * quantities[food.id]).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{calculateCartTotals(foodList.filter(food => quantities[food.id] > 0), quantities).subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Tax</span>
              <span>₹{calculateCartTotals(foodList.filter(food => quantities[food.id] > 0), quantities).tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping</span>
              <span>₹{calculateCartTotals(foodList.filter(food => quantities[food.id] > 0), quantities).shipping.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong>₹{calculateCartTotals(foodList.filter(food => quantities[food.id] > 0), quantities).total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="text-start mb-4 mt-4">
        <Link to="/cart" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default PlaceOrder;
