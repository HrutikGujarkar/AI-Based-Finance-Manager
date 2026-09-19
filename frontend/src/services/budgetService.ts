import api from './api';

export interface Budget {
  budgetId: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isActive: boolean;
}

export interface BudgetCreate {
  category: string;
  amount: number;
}

const LOCAL_BUDGETS_KEY = 'financeManagerBudgets';

function getLocalBudgets(): Budget[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_BUDGETS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalBudgets(budgets: Budget[]) {
  localStorage.setItem(LOCAL_BUDGETS_KEY, JSON.stringify(budgets));
}

function withSpent(budget: Omit<Budget, 'spent' | 'remaining' | 'percentageUsed'>): Budget {
  let expenses: Array<{ category: string; amount: number }> = [];
  try {
    expenses = JSON.parse(localStorage.getItem('financeManagerExpenses') || '[]');
  } catch {
    expenses = [];
  }
  const spent = expenses
    .filter((expense) => expense.category === budget.category)
    .reduce((total, expense) => total + Number(expense.amount || 0), 0);
  const percentageUsed = budget.amount ? (spent / budget.amount) * 100 : 0;
  return {
    ...budget,
    spent,
    remaining: budget.amount - spent,
    percentageUsed,
  };
}

function getLocalBudgetsWithSpent() {
  return getLocalBudgets().map(withSpent);
}

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await api.get('/api/v1/budgets');
      return response.data.data;
    } catch {
      return getLocalBudgetsWithSpent();
    }
  },

  async createBudget(budget: BudgetCreate) {
    try {
      const response = await api.post('/api/v1/budgets', budget);
      return response.data;
    } catch {
      const savedBudget = withSpent({
        ...budget,
        budgetId: crypto.randomUUID(),
        isActive: true,
      });
      saveLocalBudgets([...getLocalBudgets(), savedBudget]);
      return { success: true, data: savedBudget };
    }
  },

  async deleteBudget(id: string) {
    try {
      const response = await api.delete(`/api/v1/budgets/${id}`);
      return response.data;
    } catch {
      saveLocalBudgets(getLocalBudgets().filter((budget) => budget.budgetId !== id));
      return { success: true };
    }
  },
};
