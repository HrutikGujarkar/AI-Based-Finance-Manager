import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface AnalyticsData {
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  averageDaily: number;
  monthOverMonthChange: number;
  budgetUtilization: {
    totalBudget: number;
    totalSpent: number;
    percentageUsed: number;
  };
}

interface SavedExpense {
  amount: number;
  category: string;
}

function getLocalAnalytics(): { analytics: AnalyticsData; categories: CategoryData[] } {
  let expenses: SavedExpense[] = [];
  let budgets: Array<{ amount: number }> = [];
  try {
    expenses = JSON.parse(localStorage.getItem('financeManagerExpenses') || '[]');
    budgets = JSON.parse(localStorage.getItem('financeManagerBudgets') || '[]');
  } catch {
    expenses = [];
    budgets = [];
  }

  const totalSpent = expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
  const totalBudget = budgets.reduce((total, budget) => total + Number(budget.amount || 0), 0);
  const categoryTotals = expenses.reduce<Record<string, { amount: number; transactionCount: number }>>(
    (totals, expense) => {
      const category = totals[expense.category] || { amount: 0, transactionCount: 0 };
      category.amount += Number(expense.amount || 0);
      category.transactionCount += 1;
      totals[expense.category] = category;
      return totals;
    },
    {},
  );

  const categories = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    amount: data.amount,
    transactionCount: data.transactionCount,
    percentage: totalSpent ? (data.amount / totalSpent) * 100 : 0,
  }));

  return {
    analytics: {
      totalSpent,
      transactionCount: expenses.length,
      averageTransaction: expenses.length ? totalSpent / expenses.length : 0,
      averageDaily: totalSpent / 30,
      monthOverMonthChange: 0,
      budgetUtilization: {
        totalBudget,
        totalSpent,
        percentageUsed: totalBudget ? (totalSpent / totalBudget) * 100 : 0,
      },
    },
    categories,
  };
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const localAnalytics = getLocalAnalytics();
      const hasLocalData = localStorage.getItem('financeManagerExpenses') !== null ||
        localStorage.getItem('financeManagerBudgets') !== null;
      if (hasLocalData) {
        setAnalytics(localAnalytics.analytics);
        setCategories(localAnalytics.categories);
        setError('');
        return;
      }
      
      // Load summary
      const summaryResponse = await api.get('/api/v1/analytics/summary');
      if (summaryResponse.data.success) {
        setAnalytics(summaryResponse.data.data);
      }

      // Load categories
      const categoriesResponse = await api.get('/api/v1/analytics/categories');
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.categories);
      }
    } catch (err: any) {
      const localAnalytics = getLocalAnalytics();
      setAnalytics(localAnalytics.analytics);
      setCategories(localAnalytics.categories);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-600">Overview of your spending and financial health</p>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600">₹</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{analytics?.totalSpent?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Change</p>
              <p className={`text-2xl font-semibold ${(analytics?.monthOverMonthChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(analytics?.monthOverMonthChange ?? 0) >= 0 ? '+' : ''}{analytics?.monthOverMonthChange?.toFixed(1) || '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Daily</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{analytics?.averageDaily?.toFixed(0) || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Budget Used</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.budgetUtilization?.percentageUsed?.toFixed(0) || '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Budget</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ₹{analytics?.budgetUtilization?.totalBudget?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Budget Spent</p>
          <p className="mt-2 text-2xl font-semibold text-orange-600">
            ₹{analytics?.budgetUtilization?.totalSpent?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Budget Remaining</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            ₹{Math.max(0, (analytics?.budgetUtilization?.totalBudget || 0) - (analytics?.budgetUtilization?.totalSpent || 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Spending by Category</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm text-gray-500">₹{category.amount.toLocaleString()} ({category.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-expense"
              className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">➕</div>
                <h3 className="font-medium text-gray-900">Add Expense</h3>
                <p className="text-sm text-gray-500">Record a new expense</p>
              </div>
            </Link>
            <Link
              to="/expenses"
              className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-medium text-gray-900">View Expenses</h3>
                <p className="text-sm text-gray-500">See all transactions</p>
              </div>
            </Link>
            <Link
              to="/add-budget"
              className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-medium text-gray-900">Add Budget</h3>
                <p className="text-sm text-gray-500">Set a monthly spending limit</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
