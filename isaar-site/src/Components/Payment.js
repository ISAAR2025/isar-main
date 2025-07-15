import React, { useEffect, useState } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { generateReceiptPDF } from '../utils/generateReceipt';

const Payment = () => {
  const [courseData, setCourseData] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [finalPrice, setFinalPrice] = useState(null);
  const [finalDiscount, setFinalDiscount] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [gstAmount, setGstAmount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('selectedCourse'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (!storedData) {
      navigate('/services');
    } else if (!user) {
      navigate('/login');
    } else {
      setCourseData(storedData);
    }
  }, [navigate]);

  if (!courseData) return null;

  const { course, price, discount, image, description } = courseData;

  const calculatePrice = () => {
    let bonusDiscount = 0;

    if (coupon.trim().toUpperCase() === 'ISAR10') {
      bonusDiscount = 10;
      alert('Coupon ISAR10 applied (10% OFF)');
    } else {
      bonusDiscount = Math.floor(Math.random() * 6) + 5; // 5–10%
      alert(` Discount Applied: ${bonusDiscount}%`);
    }

    const totalDiscount = discount + bonusDiscount;
    const discounted = price - (price * totalDiscount) / 100;

    const gst = (discounted * 2.5) / 100;
    const finalAmount = discounted + gst;

    setFinalDiscount(totalDiscount);
    setAppliedDiscount(bonusDiscount);
    setGstAmount(gst);
    setFinalPrice(finalAmount);
    setDiscountApplied(true);

    alert(
      `✅ GST (2.5%) added: ₹${gst.toFixed(2)}\nTotal Payable: ₹${finalAmount.toFixed(2)}`
    );
  };

  const loadRazorpay = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (finalPrice === null) {
      alert('Please apply discount first!');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = async () => {
      try {
        const orderRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalPrice }),
        });

        const { success, order } = await orderRes.json();
        if (!success) return alert('Order creation failed');

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
          amount: order.amount,
          currency: 'INR',
          name: 'ISAR',
          description: `Payment for ${course}`,
          order_id: order.id,
          handler: async function (response) {
            console.log('🧾 Verifying Payment with:', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verifyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                course_name: course,
                amount: finalPrice,
                currency: 'INR',
                status: 'paid',
                payment_date: new Date().toISOString(),
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('✅ Payment successful and course enrolled!');

              generateReceiptPDF({
                user: {
                  fullName: user.fullName,
                  email: user.email,
                },
                course: {
                  name: course,
                },
                payment: {
                  amount: finalPrice,
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  date: new Date().toISOString(),
                },
              });

              navigate('/dashboard');
            } else {
              alert('❌ Payment verification failed');
              console.error('❌ Backend Response:', verifyData);
            }
          },
          prefill: {
            name: user.fullName,
            email: user.email,
          },
          theme: {
            color: '#2B72FB',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error('Payment Error:', error);
        alert('Something went wrong during payment.');
      }
    };

    if (!course) {
      console.error('❌ course is undefined');
      alert('Something went wrong, please try again.');
      return;
    }

    script.onerror = () => {
      alert('Failed to load Razorpay SDK');
    };

    document.body.appendChild(script);
  };

  const themeClass = {
    'Young Learners': 'theme-junior',
    'Junior High': 'theme-young',
    'Senior High': 'theme-senior',
    'Advanced Training': 'theme-advanced',
  }[course];

  return (
    <div className={`payment-container ${themeClass}`}>
      <div className="course-card">
        <h2>{course}</h2>
        <img src={image} alt={course} className="course-image" />
        <p className="description">{description}</p>
        <p><strong>Original Price:</strong> ₹{price}</p>
        <p><strong>Base Course Discount:</strong> {discount}%</p>

        {appliedDiscount !== null && (
          <>
            <p><strong>{coupon.trim().toUpperCase() === 'ISAR10' ? 'Coupon Discount' : 'Lucky Discount'}:</strong> {appliedDiscount}%</p>
            <p><strong>Total Discount:</strong> {finalDiscount}%</p>
            <p><strong>GST (2.5%):</strong> ₹{gstAmount.toFixed(2)}</p>
            <p><strong>Final Price (incl. GST):</strong> ₹{finalPrice.toFixed(2)}</p>
          </>
        )}

        <input
          type="text"
          placeholder="Enter coupon code (optional)"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="coupon-input"
          disabled={discountApplied}
        />

        <button
          onClick={calculatePrice}
          className="apply-btn"
          disabled={discountApplied}
        >
          {discountApplied ? '✅ Discount Applied' : 'Apply Discount'}
        </button>

        <button
          className="pay-btn"
          onClick={loadRazorpay}
          disabled={finalPrice === null}
        >
          Pay ₹{finalPrice !== null ? finalPrice.toFixed(2) : '...'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
