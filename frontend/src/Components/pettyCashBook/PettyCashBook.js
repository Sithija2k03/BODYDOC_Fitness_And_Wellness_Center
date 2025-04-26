import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PettyCashBook() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    type: 'outflow',
    amount: '',
    description: '',
    category: 'General',
    receipt: null,
  });


  const adminRole = 'admin'; 

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/petty-cash', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newTransaction).forEach(key => {
      formData.append(key, newTransaction[key]);
    });

    try {
      const response = await axios.post('http://localhost:4000/api/petty-cash', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTransactions([response.data.transaction, ...transactions]);
      setNewTransaction({ type: 'outflow', amount: '', description: '', category: 'General', receipt: null });
      setError(null);
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  // Update transaction status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/petty-cash/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTransactions(transactions.map(t => t._id === id ? response.data.transaction : t));
      setError(null);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/petty-cash/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTransactions(transactions.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  // Calculate summary
  const totalInflows = transactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutflows = transactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalInflows - totalOutflows;

  // Prepare pie chart data
  const categories = [...new Set(transactions.filter(t => t.type === 'outflow').map(t => t.category))];
  const categoryAmounts = categories.map(category =>
    transactions
      .filter(t => t.type === 'outflow' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PettyCashStyled>
      <h2>Petty Cash Book</h2>

       {/* Search Bar */}
       <SearchBar>
        <input
          type="text"
          placeholder="Search by description or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {/* Summary Card */}
      <SummaryCard>
        <h3>Summary</h3>
        <div className="summary-details">
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
          <p><strong>Total Inflows:</strong> ${totalInflows.toFixed(2)}</p>
          <p><strong>Total Outflows:</strong> ${totalOutflows.toFixed(2)}</p>
        </div>
        <div className="pie-chart">
          <h4>Expense Categories</h4>
          {categories.length > 0 ? <Pie data={pieData} /> : <p>No expenses to display</p>}
        </div>
      </SummaryCard>

      {/* Add Transaction Form */}
      <Form onSubmit={handleAddTransaction}>
        <h3>Add Transaction</h3>
        <select
          value={newTransaction.type}
          onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category (e.g., Office Supplies)"
          value={newTransaction.category}
          onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setNewTransaction({ ...newTransaction, receipt: e.target.files[0] })}
        />
        <button type="submit">Add Transaction</button>
      </Form>

     

      {/* Transactions Table */}
      <div className="transactions">
        {loading ? (
          <p className="status">Loading transactions...</p>
        ) : error ? (
          <p className="status error">{error}</p>
        ) : filteredTransactions.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Receipt</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      {transaction.receipt ? (
                        <a href={`http://localhost:4000${transaction.receipt}`} target="_blank" rel="noopener noreferrer">
                          View Receipt
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <span className={`status ${transaction.status}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {transaction.status === 'pending' && adminRole === 'senior' && (
                        <div className="actions">
                          <button className="approve" onClick={() => handleStatusChange(transaction._id, 'approved')}>
                            Approve
                          </button>
                          <button className="decline" onClick={() => handleStatusChange(transaction._id, 'rejected')}>
                            Reject
                          </button>
                        </div>
                      )}
                      <button className="delete" onClick={() => handleDelete(transaction._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="status">No transactions found</p>
        )}
      </div>
    </PettyCashStyled>
  );
}

const PettyCashStyled = styled.div`
  padding: 2rem;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .transactions {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .status {
    font-size: 1rem;
    color: #555;
  }

  .status.error {
    color: #e74c3c;
  }

  .table-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  table {
    border-collapse: collapse;
    background: #ffffff;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    width: 100%;
    border: 1px solid #e0e0e0;
  }

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    font-size: 0.9rem;
    color: #333;
  }

  th {
    background: #e0e0e0;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #555;
    letter-spacing: 0.5px;
  }

  th:nth-child(1), td:nth-child(1) { width: 10%; } /* Type */
  th:nth-child(2), td:nth-child(2) { width: 10%; } /* Amount */
  th:nth-child(3), td:nth-child(3) { width: 20%; } /* Description */
  th:nth-child(4), td:nth-child(4) { width: 15%; } /* Category */
  th:nth-child(5), td:nth-child(5) { width: 10%; } /* Date */
  th:nth-child(6), td:nth-child(6) { width: 10%; } /* Receipt */
  th:nth-child(7), td:nth-child(7) { width: 10%; } /* Status */
  th:nth-child(8), td:nth-child(8) { width: 15%; } /* Actions */

  tbody tr:hover {
    background: #f9f9f9;
    transition: background 0.2s ease;
  }

  tbody tr:nth-child(even) {
    background: #f5f5f5;
  }

  .status {
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
  }

  .status.pending {
    color: #f39c12;
    background: #fff3cd;
  }

  .status.approved {
    color: #28a745;
    background: #e6f4ea;
  }

  .status.rejected {
    color: #dc3545;
    background: #f8d7da;
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
  }

  .approve, .decline, .delete {
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    color: white;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .approve {
    background: #28a745;
  }

  .approve:hover {
    background: #218838;
  }

  .decline {
    background: #dc3545;
  }

  .decline:hover {
    background: #c82333;
  }

  .delete {
    background: #6c757d;
  }

  .delete:hover {
    background: #5a6268;
  }
`;

const SummaryCard = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  .summary-details {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .summary-details p {
    font-size: 1rem;
    color: #333;
  }

  .pie-chart {
    max-width: 300px;
    margin: 0 auto;
  }

  .pie-chart h4 {
    font-size: 1.2rem;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    width: 100%;
    margin-bottom: 1rem;
  }

  select, input {
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.9rem;
    flex: 1;
    min-width: 200px;
  }

  button {
    padding: 8px 16px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s ease;
  }

  button:hover {
    background: #357abd;
  }
`;

const SearchBar = styled.div`
  margin-bottom: 1.5rem;

  input {
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    width: 100%;
    max-width: 400px;
    font-size: 0.9rem;
  }
`;

export default PettyCashBook;