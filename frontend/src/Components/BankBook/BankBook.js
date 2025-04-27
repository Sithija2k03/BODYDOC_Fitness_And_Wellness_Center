import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function BankBook() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    type: 'deposit',
    amount: '',
    description: '',
    category: 'General',
    bankAccount: 'Main Account',
    receipt: null,
  });

  const adminRole = 'admin'; // Adjust based on your auth system

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/bank', {
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
      const response = await axios.post('http://localhost:4000/api/bank', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTransactions([response.data.transaction, ...transactions]);
      setNewTransaction({ type: 'deposit', amount: '', description: '', category: 'General', bankAccount: 'Main Account', receipt: null });
      setError(null);
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  // Update transaction status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/bank/${id}/status`, { status }, {
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
      await axios.delete(`http://localhost:4000/api/bank/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTransactions(transactions.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  // Calculate summary
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalDeposits - totalWithdrawals;

  // Filter transactions
  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.bankAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate PDF Bank Statement
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Bank Statement - BODYDOC Fitness', 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Deposits: $${totalDeposits.toFixed(2)}`, 20, 40);
    doc.text(`Total Withdrawals: $${totalWithdrawals.toFixed(2)}`, 20, 50);
    doc.text(`Balance: $${balance.toFixed(2)}`, 20, 60);

    doc.setFontSize(14);
    doc.text('Transactions:', 20, 80);

    let y = 90;
    filteredTransactions.forEach((t, index) => {
      if (y > 270) { // Add new page if content exceeds page height
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${t.type.charAt(0).toUpperCase() + t.type.slice(1)}: $${t.amount.toFixed(2)}`, 20, y);
      doc.text(`   Description: ${t.description}`, 20, y + 5);
      doc.text(`   Category: ${t.category}`, 20, y + 10);
      doc.text(`   Bank Account: ${t.bankAccount}`, 20, y + 15);
      doc.text(`   Date: ${new Date(t.date).toLocaleDateString()}`, 20, y + 20);
      doc.text(`   Status: ${t.status.charAt(0).toUpperCase() + t.status.slice(1)}`, 20, y + 25);
      y += 35;
    });

    doc.save('bank-statement.pdf');
  };

  return (
    <BankBookStyled>
      <h2>Bank Book</h2>

      {/* Search Bar */}
      <SearchBar>
        <input
          type="text"
          placeholder="Search by description, category, or bank account..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {/* Summary Card */}
      <SummaryCard>
        <h3>Summary</h3>
        <div className="summary-details">
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
          <p><strong>Total Deposits:</strong> ${totalDeposits.toFixed(2)}</p>
          <p><strong>Total Withdrawals:</strong> ${totalWithdrawals.toFixed(2)}</p>
        </div>
        <button className="generate-pdf" onClick={generatePDF}>Generate PDF Statement</button>
      </SummaryCard>

      {/* Add Transaction Form */}
      <Form onSubmit={handleAddTransaction}>
        <h3>Add Transaction</h3>
        <select
          value={newTransaction.type}
          onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
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
        <select
          value={newTransaction.category}
          onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
        >
          <option value="General">General</option>
          <option value="Membership Fees">Membership Fees</option>
          <option value="Equipment Purchase">Equipment Purchase</option>
          <option value="Staff Salaries">Staff Salaries</option>
          <option value="Utilities">Utilities</option>
          <option value="Marketing">Marketing</option>
          <option value="Event Expenses">Event Expenses</option>
          <option value="Loan Repayment">Loan Repayment</option>
          <option value="Tax Payments">Tax Payments</option>
        </select>
        <select
          value={newTransaction.bankAccount}
          onChange={e => setNewTransaction({ ...newTransaction, bankAccount: e.target.value })}
        >
          <option value="Main Account">Main Account</option>
          <option value="Savings Account">Savings Account</option>
          <option value="Payroll Account">Payroll Account</option>
          <option value="Expense Account">Expense Account</option>
        </select>
        <input
          type="file"
          accept="image/*,.pdf"
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
                  <th>Bank Account</th>
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
                    <td>{transaction.bankAccount}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      {transaction.receipt ? (
                        transaction.receipt.endsWith('.pdf') ? (
                          <embed
                            src={`http://localhost:5000${transaction.receipt}`}
                            type="application/pdf"
                            width="100px"
                            height="100px"
                          />
                        ) : (
                          <img
                            src={`http://localhost:5000${transaction.receipt}`}
                            alt="Receipt"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        )
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
    </BankBookStyled>
  );
}

const BankBookStyled = styled.div`
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
  th:nth-child(5), td:nth-child(5) { width: 15%; } /* Bank Account */
  th:nth-child(6), td:nth-child(6) { width: 10%; } /* Date */
  th:nth-child(7), td:nth-child(7) { width: 10%; } /* Receipt */
  th:nth-child(8), td:nth-child(8) { width: 10%; } /* Status */
  th:nth-child(9), td:nth-child(9) { width: 15%; } /* Actions */

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

  .generate-pdf {
    padding: 8px 16px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s ease;
  }

  .generate-pdf:hover {
    background: #357abd;
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

export default BankBook;