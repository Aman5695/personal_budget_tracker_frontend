// src/components/LoginPage.js
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../actions/authActions'
import '../styles/LoginPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [f, setF] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const handle = async e => {
    e.preventDefault()
    const response = await dispatch(login(f))
    if(response.success){
        toast.success(response.message, {
          position: "top-right",
          autoClose: 2000,
        });
    }else{
        toast.error(response.message, {
          position: "top-right",
          autoClose: 2000,
        });
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handle}>
        <h2>Login</h2>
        <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Username" />
        <input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <ToastContainer />
    </div>
  )
}
