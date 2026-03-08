import axios from "axios";

const API_URL = "http://localhost:4000/api/users"; // backend URL

// signup start
export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// login start
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  // save token to localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// get token
export const getToken = () => localStorage.getItem("token");