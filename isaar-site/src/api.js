import axios from 'axios';

// ✅ Read the backend URL from the environment
const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const registerUser = async (fullName, email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, {
    fullName,
    email,
    password,
  });
  return res.data;
};
