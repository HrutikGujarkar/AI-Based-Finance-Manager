from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.firebase import db

class AnalyticsRepository:
    def __init__(self):
        self.db = db
        # Mock data for when Firebase is not available
        self.mock_data = {
            'categories': [
                {'category': 'Food', 'amount': 8500, 'transactionCount': 18},
                {'category': 'Transport', 'amount': 4500, 'transactionCount': 12},
                {'category': 'Shopping', 'amount': 6200, 'transactionCount': 8},
                {'category': 'Bills', 'amount': 3500, 'transactionCount': 4},
                {'category': 'Entertainment', 'amount': 2150, 'transactionCount': 3}
            ]
        }
    
    def get_summary(self, user_id: str, period: str = "month") -> Dict[str, Any]:
        """Get spending summary for a period"""
        if not self.db:
            # Return mock data
            return {
                'period': period,
                'totalSpent': 24850,
                'currency': 'INR',
                'transactionCount': 45,
                'averageTransaction': 552.22,
                'averageDaily': 828.33,
                'monthOverMonthChange': 8.4,
                'budgetUtilization': {
                    'totalBudget': 35000,
                    'totalSpent': 24850,
                    'percentageUsed': 71
                }
            }
        
        # Firebase implementation would go here
        return {}
    
    def get_category_breakdown(self, user_id: str, period: str = "month") -> List[Dict[str, Any]]:
        """Get spending by category"""
        if not self.db:
            return self.mock_data['categories']
        
        # Firebase implementation would go here
        return []

analytics_repository = AnalyticsRepository()
