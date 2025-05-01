// src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions'
import { fetchTransactions } from './actions/transactionActions'
import { fetchBudget } from './actions/budgetActions'
import App from './App'
import './styles/App.css'

store.dispatch(loadUser())
store.dispatch(fetchTransactions())
store.dispatch(fetchBudget())

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
