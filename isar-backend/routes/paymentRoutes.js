const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

require('dotenv').config();

const router = express.Router();

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ 1. Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  console.log('📦 Create Order Request - Amount:', amount);

  if (!amount) {
    return res.status(400).json({ success: false, error: 'Amount is required' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    });

    console.log('✅ Razorpay Order Created:', order);
    res.json({ success: true, order });
  } catch (err) {
    console.error('🔴 Razorpay Order Error:', err);
    res.status(500).json({ success: false, error: 'Order creation failed' });
  }
});

// ✅ 2. Verify Razorpay Payment
router.post('/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user_id,
    userId,
    course_name,
    courseName,
    amount,
    currency,
    status,
    payment_date,
    receipt_id
  } = req.body;

  const finalUserId = user_id || userId;
  const finalCourseName = course_name || courseName;

  console.log('🧾 Payment Verification Request Received:');
  console.log({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user_id: finalUserId,
    course_name: finalCourseName,
    amount,
    currency,
    status,
    payment_date,
  });

  if (!finalCourseName) {
    console.error("❌ Missing course_name or courseName in request body");
    return res.status(400).json({ success: false, error: "Missing course_name" });
  }

  try {
    // ✅ Handle manual/test orders
    if (razorpay_order_id.startsWith('order_manual_')) {
      console.log("🧪 Manual order detected, skipping signature verification");

      const newPayment = new Payment({
        user_id: finalUserId,
        course_name: finalCourseName,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        currency,
        status,
        payment_date,
        receipt_id,
      });

      await newPayment.save();
      console.log("✅ Manual payment saved to DB");
      return res.json({ success: true, message: 'Manual payment stored successfully' });
    }

    // ✅ Signature verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log('🔐 Signature Check:');
    console.log({ expectedSignature, providedSignature: razorpay_signature });

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Signature Mismatch - Possible Tampering Detected');
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // ✅ Get course from DB
    const courseDoc = await Course.findOne({ title: finalCourseName });
    if (!courseDoc) {
      console.error('❌ Course not found in DB:', finalCourseName);
      return res.status(400).json({ success: false, error: 'Course not found in database' });
    }

    console.log('📘 Course Found:', courseDoc.title);

    // ✅ Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      user_id: finalUserId,
      course_name: finalCourseName,
    });

    if (!existingEnrollment) {
      await Enrollment.create({
        user_id: finalUserId,
        course_name: finalCourseName,
        price: amount,
      });
      console.log('✅ User enrolled to course:', courseDoc.title);
    } else {
      console.log('ℹ️ User already enrolled in this course');
    }

    // ✅ Generate next receipt_id
    const latestPayment = await Payment.findOne().sort({ receipt_id: -1 });
    const nextReceiptId = latestPayment?.receipt_id ? latestPayment.receipt_id + 1 : 100000;
    console.log('🧾 Next Receipt ID:', nextReceiptId);

    // ✅ Save payment
    const newPayment = new Payment({
      user_id: finalUserId,
      course_name: finalCourseName,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      status: 'paid',
      receipt_id: nextReceiptId,
      payment_date: new Date(payment_date) || new Date(),
    });

    await newPayment.save();
    console.log('💾 Payment saved in DB:', newPayment);

    res.json({
      success: true,
      message: 'Payment verified and saved successfully',
      receipt_id: nextReceiptId,
    });

  } catch (err) {
    console.error('🔴 Payment Verification Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error during payment verification',
    });
  }
});
// your existing POST routes above...

// ✅ new GET route for admin payments:
router.get('/admin/payments', async (req, res) => {
  // ... same code as above ...
});

// ✅ keep exporting your router:
module.exports = router;

