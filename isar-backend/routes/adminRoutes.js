const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

// ✅ Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, reset_otp: 0, reset_otp_expires: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// ✅ Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    console.error('Courses fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
});

// ✅ Get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ enrolled_at: -1 });
    const formatted = enrollments.map(e => ({
      id: e._id,
      user_id: e.user_id?.toString() || null,
      course_name: e.course_name,
      price: e.price,
      enrolled_at: e.enrolled_at
    }));
    res.json({ success: true, enrollments: formatted });
  } catch (err) {
    console.error('Enrollment fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching enrollments' });
  }
});

// ✅ Get all payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user_id', 'name email')
      .sort({ payment_date: -1 });

    const formatted = payments.map(p => ({
      id: p._id,
      receipt_id: p.receipt_id,
      amount: p.amount,
      status: p.status,
      payment_date: p.payment_date,
      user_name: p.user_id?.name || 'N/A',
      email: p.user_id?.email || '',
      course_title: p.course_name || 'N/A',
    }));

    res.json({ success: true, payments: formatted });
  } catch (err) {
    console.error('🔴 Admin payment fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

// ✅ Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const total_users = await User.countDocuments();
    const total_enrollments = await Enrollment.countDocuments();
    const total_payments = await Payment.countDocuments();

    res.json({
      success: true,
      stats: {
        total_users,
        total_enrollments,
        total_payments,
      },
    });
  } catch (err) {
    console.error('Stats fetch error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;
