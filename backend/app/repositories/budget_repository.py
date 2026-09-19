from typing import List, Optional, Dict, Any
from datetime import datetime
from app.core.firebase import db

class BudgetRepository:
    def __init__(self):
        self.db = db
    
    def create_budget(self, user_id: str, budget_data: Dict[str, Any]) -> str:
        """Create a new budget for a user"""
        if not self.db:
            raise Exception("Firebase not initialized")
        budget_ref = self.db.collection('users').document(user_id).collection('budgets').document()
        budget_data['createdAt'] = datetime.utcnow()
        budget_data['updatedAt'] = datetime.utcnow()
        budget_data['spent'] = 0.0
        budget_data['remaining'] = budget_data['amount']
        budget_data['percentageUsed'] = 0.0
        budget_data['isActive'] = True
        budget_ref.set(budget_data)
        return budget_ref.id
    
    def get_budgets(self, user_id: str, is_active: Optional[bool] = None) -> List[Dict[str, Any]]:
        """Get budgets for a user"""
        if not self.db:
            # Return mock data
            return [
                {
                    'budgetId': 'mock1',
                    'category': 'Food',
                    'amount': 8000,
                    'spent': 3500,
                    'remaining': 4500,
                    'percentageUsed': 43.75,
                    'isActive': True
                },
                {
                    'budgetId': 'mock2',
                    'category': 'Transport',
                    'amount': 5000,
                    'spent': 2800,
                    'remaining': 2200,
                    'percentageUsed': 56.0,
                    'isActive': True
                }
            ]
        
        query = self.db.collection('users').document(user_id).collection('budgets')
        if is_active is not None:
            query = query.where('isActive', '==', is_active)
        
        budgets = query.get()
        return [budget.to_dict() for budget in budgets]
    
    def update_budget(self, user_id: str, budget_id: str, budget_data: Dict[str, Any]) -> bool:
        """Update a budget"""
        if not self.db:
            raise Exception("Firebase not initialized")
        budget_ref = self.db.collection('users').document(user_id).collection('budgets').document(budget_id)
        budget_data['updatedAt'] = datetime.utcnow()
        budget_ref.update(budget_data)
        return True
    
    def delete_budget(self, user_id: str, budget_id: str) -> bool:
        """Delete a budget"""
        if not self.db:
            raise Exception("Firebase not initialized")
        budget_ref = self.db.collection('users').document(user_id).collection('budgets').document(budget_id)
        budget_ref.delete()
        return True

budget_repository = BudgetRepository()
