const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const verificationCodes = {}; // In-memory store for email verification

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Send Verification Code
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

// 2. Register User
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
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [fullName, email, hashedPassword]
    );

    delete verificationCodes[email];
    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'defaultSecret', {
      expiresIn: '1d',
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 4. Enroll in Course (Free or Paid — prevent duplicate)
exports.enrollCourse = async (req, res) => {
  const { userId, courseName, price } = req.body;

  if (!userId || !courseName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_name = ?',
      [userId, courseName]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Already enrolled in this course' });
    }

    await db.query(
      'INSERT INTO enrollments (user_id, course_name, price) VALUES (?, ?, ?)',
      [userId, courseName, price ?? 0.0]
    );

    return res.status(201).json({ success: true, message: 'Course enrolled successfully' });
  } catch (err) {
    console.error('Enrollment Error:', err);
    return res.status(500).json({ success: false, message: 'Enrollment failed' });
  }
};

// 5. Get Enrolled Courses by User ID
// 5. Get Enrolled Courses for a User (With Details)
exports.getUserCourses = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        e.course_name,
        e.price,
        e.enrolled_at,
        c.description,
        c.image_url
      FROM enrollments e
      JOIN courses c ON e.course_name = c.title
      WHERE e.user_id = ?
    `, [userId]);

    res.json({ success: true, courses: rows });
  } catch (err) {
    console.error('Fetch user courses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};


// ✅ Exported function definition (no '/send-otp' here!)
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db.query('UPDATE users SET reset_otp = ?, reset_otp_expires = ? WHERE email = ?', [
      otp,
      expires,
      email,
    ]);

    await transporter.sendMail({
      from: `"ISAR Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `<h3>OTP: ${otp}</h3><p>This OTP is valid for 10 minutes.</p>`,
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()',
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
};


