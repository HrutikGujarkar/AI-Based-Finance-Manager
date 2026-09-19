import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';

interface Expense {
  expenseId: string;
  amount: number;
  category: string;
  description: string;
  transactionDate: string;
  paymentMethod?: string;
}

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError('Failed to load expenses: ' + (err.response?.data?.detail || err.message));
      // Set mock data for demo
      setExpenses([
        {
          expenseId: '1',
          amount: 450,
          category: 'Food',
          description: 'Dinner at restaurant',
          transactionDate: new Date().toISOString(),
          paymentMethod: 'UPI'
        },
        {
          expenseId: '2',
          amount: 250,
          category: 'Transport',
          description: 'Uber ride',
          transactionDate: new Date(Date.now() - 86400000).toISOString(),
          paymentMethod: 'Credit Card'
        },
        {
          expenseId: '3',
          amount: 1200,
          category: 'Shopping',
          description: 'Groceries',
          transactionDate: new Date(Date.now() - 172800000).toISOString(),
          paymentMethod: 'Debit Card'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        loadExpenses();
      } catch (err: any) {
        setError('Failed to delete expense: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage your expenses</p>
        </div>
        <button
          onClick={() => navigate('/add-expense')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Expense
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Expenses</h2>
          </div>
          {expenses.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No expenses yet. Add your first expense!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <li key={expense.expenseId} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600">💰</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600">{expense.category}</p>
                          <p className="text-sm text-gray-900">{expense.description || 'No description'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(expense.transactionDate).toLocaleDateString()} • {expense.paymentMethod || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(expense.expenseId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
