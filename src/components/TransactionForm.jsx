import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../actions/transactionActions';
import '../styles/TransactionForm.css';

export default function TransactionForm({ editTx, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ type: 'income', category: '', amount: '', date: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (editTx) setForm(editTx); }, [editTx]);

  const validate = () => {
    const errs = {};
    if (!form.category.trim()) errs.category = 'Enter category';
    if (!form.amount || form.amount <= 0) errs.amount = 'Enter positive amount';
    if (!form.date) errs.date = 'Select date';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const tx = { ...form};
    editTx ? dispatch(updateTransaction(tx)) : dispatch(addTransaction(tx));
    setForm({ type: 'income', category: '', amount: '', date: '' });
    setErrors({});
    onDone && onDone();
  };

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      {errors.category && <span className="error">{errors.category}</span>}
      <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
      {errors.amount && <span className="error">{errors.amount}</span>}
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      {errors.date && <span className="error">{errors.date}</span>}
      <button type="submit">{editTx ? 'Update' : 'Add'}</button>
    </form>
  );
}
