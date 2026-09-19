from typing import List, Optional, Dict, Any
from datetime import datetime
from app.core.firebase import db

class ExpenseRepository:
    def __init__(self):
        self.db = db
    
    def create_expense(self, user_id: str, expense_data: Dict[str, Any]) -> str:
        """Create a new expense for a user"""
        if not self.db:
            raise Exception("Firebase not initialized")
        expense_ref = self.db.collection('users').document(user_id).collection('expenses').document()
        expense_data['createdAt'] = datetime.utcnow()
        expense_data['updatedAt'] = datetime.utcnow()
        expense_ref.set(expense_data)
        return expense_ref.id
    
    def get_expense(self, user_id: str, expense_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific expense by ID"""
        if not self.db:
            raise Exception("Firebase not initialized")
        expense_ref = self.db.collection('users').document(user_id).collection('expenses').document(expense_id)
        expense = expense_ref.get()
        if expense.exists:
            return expense.to_dict()
        return None
    
    def get_expenses(self, user_id: str, limit: int = 20, offset: int = 0, 
                     category: Optional[str] = None, 
                     start_date: Optional[datetime] = None,
                     end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Get expenses for a user with optional filters"""
        if not self.db:
            raise Exception("Firebase not initialized")
        query = self.db.collection('users').document(user_id).collection('expenses')
        
        if category:
            query = query.where('category', '==', category)
        
        if start_date:
            query = query.where('transactionDate', '>=', start_date)
        
        if end_date:
            query = query.where('transactionDate', '<=', end_date)
        
        query = query.order_by('transactionDate', direction='DESCENDING').limit(limit)
        
        expenses = query.get()
        return [
            {"expenseId": expense.id, **expense.to_dict()}
            for expense in expenses
        ]
    
    def update_expense(self, user_id: str, expense_id: str, expense_data: Dict[str, Any]) -> bool:
        """Update an existing expense"""
        if not self.db:
            raise Exception("Firebase not initialized")
        expense_ref = self.db.collection('users').document(user_id).collection('expenses').document(expense_id)
        expense_data['updatedAt'] = datetime.utcnow()
        expense_ref.update(expense_data)
        return True
    
    def delete_expense(self, user_id: str, expense_id: str) -> bool:
        """Delete an expense"""
        if not self.db:
            raise Exception("Firebase not initialized")
        expense_ref = self.db.collection('users').document(user_id).collection('expenses').document(expense_id)
        expense_ref.delete()
        return True

expense_repository = ExpenseRepository()
