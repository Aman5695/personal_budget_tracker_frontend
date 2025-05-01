// src/components/TransactionOverview.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../actions/transactionActions';
import '../styles/TransactionOverview.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';


export default function TransactionOverview({ data, filters, onFilterChange, onEdit }) {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pages = Math.ceil(data.length / pageSize) || 1;
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);


  return (
    <div className="tx-overview">
      <h2>Transactions</h2>
      <div className="tx-filters">
        <div>
          <label>From:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => { onFilterChange('dateFrom', e.target.value); setPage(1); }}
          />
        </div>
        <div>
          <label>To:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => { onFilterChange('dateTo', e.target.value); setPage(1); }}
          />
        </div>
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => { onFilterChange('category', e.target.value); setPage(1); }}
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={filters.amountMin}
          onChange={(e) => { onFilterChange('amountMin', e.target.value); setPage(1); }}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filters.amountMax}
          onChange={(e) => { onFilterChange('amountMax', e.target.value); setPage(1); }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filters.length > 0 && filters.map((tx) => (
            
            <tr key={tx._id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>{tx.category}</td>
              <td>{tx.amount}</td>
              <td className='actions'>
                <Tooltip title="Edit" arrow>
                  <EditIcon className='edit icon' onClick={() => onEdit(tx)}></EditIcon>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <DeleteIcon className='delete icon' onClick={() => dispatch(deleteTransaction(tx._id))}></DeleteIcon>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
        <span>{page} / {pages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, pages))} disabled={page === pages}>Next</button>
      </div>
    </div>
  );
}
