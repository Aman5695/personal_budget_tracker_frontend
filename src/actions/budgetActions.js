// src/actions/budgetActions.js
import api from '../api'
export const fetchBudget = () => async dispatch => {
  const { data: { monthlyBudget } } = await api.get('/budget')
  dispatch({ type: 'SET_BUDGET', payload: monthlyBudget })
}
export const setBudget = amount => async dispatch => {
  const { data: { monthlyBudget } } = await api.post('/budget', { amount })
  dispatch({ type: 'SET_BUDGET', payload: monthlyBudget })
}
