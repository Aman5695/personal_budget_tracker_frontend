import React from 'react';
import { useSelector } from 'react-redux';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const user = useSelector(state => state.auth.user);
  return user ? <Dashboard /> : <LoginPage />;
}