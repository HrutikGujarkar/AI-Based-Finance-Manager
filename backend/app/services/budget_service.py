from typing import List, Dict, Any
from app.repositories.budget_repository import budget_repository

class BudgetService:
    def __init__(self):
        self.repository = budget_repository
    
    def create_budget(self, user_id: str, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new budget with validation"""
        if budget_data.get('amount', 0) <= 0:
            raise ValueError("Budget amount must be positive")
        
        budget_id = self.repository.create_budget(user_id, budget_data)
        
        return {"budgetId": budget_id, **budget_data}
    
    def get_budgets(self, user_id: str, is_active: bool = True) -> List[Dict[str, Any]]:
        """Get budgets with optional filter"""
        return self.repository.get_budgets(user_id, is_active)
    
    def update_budget(self, user_id: str, budget_id: str, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a budget"""
        existing = self.repository.get_budgets(user_id)
        budget = next((b for b in existing if b.get('budgetId') == budget_id), None)
        if not budget:
            raise ValueError("Budget not found")
        
        if budget_data.get('amount', 0) <= 0:
            raise ValueError("Budget amount must be positive")
        
        self.repository.update_budget(user_id, budget_id, budget_data)
        return {"budgetId": budget_id, **budget_data}
    
    def delete_budget(self, user_id: str, budget_id: str) -> bool:
        """Delete a budget"""
        existing = self.repository.get_budgets(user_id)
        budget = next((b for b in existing if b.get('budgetId') == budget_id), None)
        if not budget:
            raise ValueError("Budget not found")
        
        return self.repository.delete_budget(user_id, budget_id)

budget_service = BudgetService()
