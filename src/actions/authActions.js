// src/actions/authActions.js
import api from '../api';

export const login = (creds) => async (dispatch) => {
  try {
    const { data: { token } } = await api.post('/auth/login', creds);
    localStorage.setItem('token', token);

    const { data: user } = await api.get('/auth/me');
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
    return {success: true, message: 'Login successful'};
  } catch (error) {
    console.error('Login failed:', error);
    dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Login failed' });
    return {success: false, message: error.response?.data?.message || 'Login failed'};
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};

export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { data: user } = await api.get('/auth/me');
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
  } catch (error) {
    console.error('Load user failed:', error);
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Session expired' });
  }
};
