const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose'); // ⬅️ Add this


require('dotenv').config();

const verificationCodes = {}; // In-memory store for email verification

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ 1. Send Verification Code
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = {
    code,
    timestamp: Date.now(),
  };

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ISAR Email Verification Code',
      text: `Your ISAR registration verification code is: ${code}`,
    });

    return res.json({ success: true, message: 'Verification code sent to your email' });
  } catch (err) {
    console.error('Email Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send verification email' });
  }
};

// ✅ 2. Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, code } = req.body;

  if (!fullName || !email || !password || !code) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const entry = verificationCodes[email];
  if (!entry || entry.code !== code || Date.now() - entry.timestamp > 5 * 60 * 1000) {
    return res.status(401).json({ success: false, message: 'Invalid or expired verification code' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name: fullName, email, password: hashedPassword });
    await newUser.save();

    delete verificationCodes[email];
    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ 3. Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecret', {
      expiresIn: '1d',
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ✅ 4. Enroll in Course (prevent duplicate)
exports.enrollCourse = async (req, res) => {
  const { userId, courseName, price } = req.body;

  if (!userId || !courseName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const existing = await Enrollment.findOne({ user_id: userId, course_name: courseName });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already enrolled in this course' });
    }

    const newEnrollment = new Enrollment({
      user_id: userId,
      course_name: courseName,
      price: price ?? 0.0,
    });

    await newEnrollment.save();
    return res.status(201).json({ success: true, message: 'Course enrolled successfully' });
  } catch (err) {
    console.error('Enrollment Error:', err);
    return res.status(500).json({ success: false, message: 'Enrollment failed' });
  }
};

// ✅ 5. Get Enrolled Courses for a User (With Details)
// ✅ 5. Get Enrolled Courses for a User (With Payment Details)
exports.getUserCourses = async (req, res) => {
  const userId = req.params.id;

  try {
    const enrollments = await Enrollment.find({ user_id: userId }).lean();

    const courses = await Promise.all(enrollments.map(async (e) => {
      const courseDoc = await Course.findOne({ course_name: e.course_name });
      const payment = await Payment.findOne({
  user_id: new mongoose.Types.ObjectId(userId),
  title: e.course_name,
});

      return {
        course_name: e.course_name,
        price: e.price,
        enrolled_at: e.enrolled_at,
        description: courseDoc?.description || '',
        image_url: courseDoc?.image_url || '',

        // Payment Info for Receipt
        receipt_id: payment?.receipt_id || null,
        razorpay_order_id: payment?.razorpay_order_id || null,
        razorpay_payment_id: payment?.razorpay_payment_id || null,
      };
    }));

    res.json({ success: true, courses });
  } catch (err) {
    console.error('Fetch user courses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};


// ✅ 6. Send OTP for Password Reset
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.reset_otp = otp;
    user.reset_otp_expires = expires;
    await user.save();

    await transporter.sendMail({
      from: `"ISAR Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `<h3>OTP: ${otp}</h3><p>This OTP is valid for 10 minutes.</p>`,
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
};

// ✅ 7. Reset Password with OTP
exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({
      email,
      reset_otp: otp,
      reset_otp_expires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.reset_otp = null;
    user.reset_otp_expires = null;

    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
};
const Payment = require('../models/Payment'); // Add this at the top if not already
