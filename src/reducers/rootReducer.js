import { combineReducers } from 'redux';
import authReducer from './authReducer';
import transactionReducer from './transactionReducer';
import budgetReducer from './budgetReducer';

export default combineReducers({
  auth: authReducer,
  transactions: transactionReducer,
  budget: budgetReducer
});