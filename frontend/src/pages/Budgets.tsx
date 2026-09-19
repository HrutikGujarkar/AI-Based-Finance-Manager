import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService } from '../services/budgetService';
import type { Budget } from '../services/budgetService';

export default function Budgets() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setBudgets(await budgetService.getBudgets());
    } catch (err: any) {
      setError('Failed to load budgets: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.deleteBudget(id);
        loadBudgets();
      } catch (err: any) {
        setError('Failed to delete budget: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'bg-red-500', text: 'text-red-700', label: 'Over Budget' };
    if (percentage >= 90) return { color: 'bg-orange-500', text: 'text-orange-700', label: 'Warning' };
    if (percentage >= 75) return { color: 'bg-yellow-500', text: 'text-yellow-700', label: 'Caution' };
    return { color: 'bg-green-500', text: 'text-green-700', label: 'On Track' };
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Manage your spending budgets</p>
        </div>
        <button
          onClick={() => navigate('/add-budget')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Budget
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
          <p className="mt-4 text-gray-600">Loading budgets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget.percentageUsed);
            return (
              <div key={budget.budgetId} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500">Monthly Budget</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${status.color} text-white`}>
                    {status.label}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Spent: ₹{budget.spent.toLocaleString()}</span>
                    <span className="text-gray-600">₹{budget.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${status.color} h-3 rounded-full transition-all`}
                      style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={status.text}>{budget.percentageUsed.toFixed(1)}%</span>
                    <span className="text-gray-500">₹{budget.remaining.toLocaleString()} remaining</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit-budget/${budget.budgetId}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.budgetId)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
