import api from './api';

interface Expense {
  expenseId: string;
  amount: number;
  category: string;
  description: string;
  transactionDate: string;
  paymentMethod?: string;
}

interface ExpenseCreate {
  amount: number;
  category: string;
  description?: string;
  paymentMethod?: string;
  transactionDate: string;
}

const LOCAL_EXPENSES_KEY = 'financeManagerExpenses';

function getLocalExpenses(): Expense[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EXPENSES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalExpenses(expenses: Expense[]) {
  localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(expenses));
}

function createLocalExpense(expense: ExpenseCreate): Expense {
  const localExpense = {
    ...expense,
    description: expense.description || '',
    expenseId: crypto.randomUUID(),
  };
  saveLocalExpenses([localExpense, ...getLocalExpenses()]);
  return localExpense;
}

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await api.get('/api/v1/expenses');
      return response.data.data;
    } catch {
      return getLocalExpenses();
    }
  },

  async createExpense(expense: ExpenseCreate): Promise<any> {
    try {
      const response = await api.post('/api/v1/expenses', expense);
      return response.data;
    } catch {
      return {
        success: true,
        data: createLocalExpense(expense),
        message: 'Expense saved locally',
      };
    }
  },

  async updateExpense(id: string, expense: Partial<ExpenseCreate>): Promise<any> {
    try {
      const response = await api.put(`/api/v1/expenses/${id}`, expense);
      return response.data;
    } catch {
      const expenses = getLocalExpenses();
      const updatedExpense = expenses.find((item) => item.expenseId === id);
      if (!updatedExpense) {
        throw new Error('Expense not found');
      }
      Object.assign(updatedExpense, expense);
      saveLocalExpenses(expenses);
      return { success: true, data: updatedExpense };
    }
  },

  async deleteExpense(id: string): Promise<any> {
    try {
      const response = await api.delete(`/api/v1/expenses/${id}`);
      return response.data;
    } catch {
      const expenses = getLocalExpenses();
      const remainingExpenses = expenses.filter((item) => item.expenseId !== id);
      saveLocalExpenses(remainingExpenses);
      return { success: true, message: 'Expense deleted locally' };
    }
  }
};
