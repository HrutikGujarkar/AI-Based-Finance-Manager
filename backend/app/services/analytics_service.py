from typing import Dict, Any, List
from app.repositories.analytics_repository import analytics_repository

class AnalyticsService:
    def __init__(self):
        self.repository = analytics_repository
    
    def get_summary(self, user_id: str, period: str = "month") -> Dict[str, Any]:
        """Get spending summary"""
        return self.repository.get_summary(user_id, period)
    
    def get_category_breakdown(self, user_id: str, period: str = "month") -> List[Dict[str, Any]]:
        """Get category breakdown with percentages"""
        categories = self.repository.get_category_breakdown(user_id, period)
        total = sum(cat['amount'] for cat in categories)
        
        for category in categories:
            category['percentage'] = (category['amount'] / total * 100) if total > 0 else 0
        
        return categories

analytics_service = AnalyticsService()
