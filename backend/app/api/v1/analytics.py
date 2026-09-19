from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/summary")
async def get_analytics_summary(
    period: str = "month",
    current_user: dict = Depends(get_current_user)
):
    """Get spending summary analytics"""
    try:
        user_id = current_user["user_id"]
        summary = analytics_service.get_summary(user_id, period)
        return {
            "success": True,
            "data": summary
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/categories")
async def get_category_breakdown(
    period: str = "month",
    current_user: dict = Depends(get_current_user)
):
    """Get spending by category"""
    try:
        user_id = current_user["user_id"]
        categories = analytics_service.get_category_breakdown(user_id, period)
        return {
            "success": True,
            "data": {
                "period": period,
                "categories": categories
            }
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
