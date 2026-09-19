import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService } from '../services/budgetService';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'];

export default function AddBudget() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a budget amount greater than zero.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await budgetService.createBudget({ category, amount: numericAmount });
      navigate('/budgets', { replace: true });
    } catch (submitError: any) {
      setError(submitError.response?.data?.detail || submitError.message || 'Unable to create budget');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Budget</h1>
        <p className="text-gray-600">Set a monthly spending limit by category.</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        <div>
          <label htmlFor="budget-category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select id="budget-category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="budget-amount" className="block text-sm font-medium text-gray-700 mb-2">Monthly amount (₹)</label>
          <input id="budget-amount" type="number" min="1" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="10000" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
          <button type="button" onClick={() => navigate('/budgets')} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
