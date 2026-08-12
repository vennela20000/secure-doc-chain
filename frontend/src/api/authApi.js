import axiosClient from './axiosClient';

// Each function returns response.data directly, so calling code
// doesn't need to know or care about axios's response wrapper shape.

export async function loginUser(username, password) {
  const response = await axiosClient.post('/api/auth/login', { username, password });
  return response.data;
}

export async function registerUser(fullName, username, email, password) {
  const response = await axiosClient.post('/api/auth/register', {
    fullName,
    username,
    email,
    password
  });
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await axiosClient.get('/api/users/me');
  return response.data;
}