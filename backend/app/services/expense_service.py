from typing import List, Optional, Dict, Any
from datetime import datetime
from app.repositories.expense_repository import expense_repository
from app.core.models import ExpenseCreate, ExpenseUpdate

class ExpenseService:
    def __init__(self):
        self.repository = expense_repository
    
    def create_expense(self, user_id: str, expense_data: ExpenseCreate) -> Dict[str, Any]:
        """Create a new expense with validation"""
        if expense_data.amount <= 0:
            raise ValueError("Amount must be positive")
        
        expense_dict = expense_data.dict()
        expense_id = self.repository.create_expense(user_id, expense_dict)
        
        return {"expenseId": expense_id, **expense_dict}
    
    def get_expense(self, user_id: str, expense_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific expense"""
        expense = self.repository.get_expense(user_id, expense_id)
        if expense:
            expense['expenseId'] = expense_id
        return expense
    
    def get_expenses(self, user_id: str, **filters) -> List[Dict[str, Any]]:
        """Get expenses with filters"""
        return self.repository.get_expenses(user_id, **filters)
    
    def update_expense(self, user_id: str, expense_id: str, expense_data: ExpenseUpdate) -> Dict[str, Any]:
        """Update an expense"""
        existing = self.repository.get_expense(user_id, expense_id)
        if not existing:
            raise ValueError("Expense not found")
        
        update_dict = expense_data.dict(exclude_unset=True)
        if 'amount' in update_dict and update_dict['amount'] <= 0:
            raise ValueError("Amount must be positive")
        
        self.repository.update_expense(user_id, expense_id, update_dict)
        return {"expenseId": expense_id, **update_dict}
    
    def delete_expense(self, user_id: str, expense_id: str) -> bool:
        """Delete an expense"""
        existing = self.repository.get_expense(user_id, expense_id)
        if not existing:
            raise ValueError("Expense not found")
        
        return self.repository.delete_expense(user_id, expense_id)

expense_service = ExpenseService()
