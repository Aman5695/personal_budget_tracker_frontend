// src/actions/transactionActions.js
import api from '../api'
export const fetchTransactions = () => async dispatch => {
  const { data } = await api.get('/transactions')
  dispatch({ type: 'SET_TX_LIST', payload: data })
}
export const addTransaction = tx => async dispatch => {
  const { data } = await api.post('/transactions', tx)
  dispatch({ type: 'ADD_TX', payload: data })
}
export const updateTransaction = tx => async dispatch => {
  const { data } = await api.put(`/transactions/${tx._id}`, tx)
  dispatch({ type: 'UPDATE_TX', payload: data })
}
export const deleteTransaction = id => async dispatch => {
  await api.delete(`/transactions/${id}`)
  dispatch({ type: 'DELETE_TX', payload: id })
}
