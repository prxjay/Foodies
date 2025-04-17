import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updatePaymentStatus } from '../../service/orderService';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        if (orderId) {
          await updatePaymentStatus(orderId, 'paid');
          toast.success('Payment successful! Your order has been placed.');
          navigate('/myorders');
        } else {
          toast.error('Invalid order ID');
          navigate('/');
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Error processing payment. Please contact support.');
        navigate('/');
      }
    };

    handlePaymentSuccess();
  }, [orderId, navigate]);

  return (
    <div className="container py-5 text-center">
      <h1>Processing Payment...</h1>
      <p>Please wait while we process your payment.</p>
    </div>
  );
};

export default PaymentSuccess; 