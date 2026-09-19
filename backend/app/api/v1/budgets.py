from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.core.security import get_current_user
from app.services.budget_service import budget_service

router = APIRouter()

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Create a new budget"""
    try:
        user_id = current_user["user_id"]
        result = budget_service.create_budget(user_id, budget_data)
        return {
            "success": True,
            "data": result,
            "message": "Budget created successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("", response_model=dict)
async def get_budgets(
    is_active: bool = True,
    current_user: dict = Depends(get_current_user)
):
    """Get user's budgets"""
    try:
        user_id = current_user["user_id"]
        budgets = budget_service.get_budgets(user_id, is_active)
        return {
            "success": True,
            "data": budgets
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{budget_id}", response_model=dict)
async def get_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific budget by ID"""
    try:
        user_id = current_user["user_id"]
        budgets = budget_service.get_budgets(user_id)
        budget = next((b for b in budgets if b.get('budgetId') == budget_id), None)
        
        if not budget:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
        
        return {
            "success": True,
            "data": budget
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{budget_id}", response_model=dict)
async def update_budget(
    budget_id: str,
    budget_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing budget"""
    try:
        user_id = current_user["user_id"]
        result = budget_service.update_budget(user_id, budget_id, budget_data)
        return {
            "success": True,
            "data": result,
            "message": "Budget updated successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{budget_id}", response_model=dict)
async def delete_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a budget"""
    try:
        user_id = current_user["user_id"]
        budget_service.delete_budget(user_id, budget_id)
        return {
            "success": True,
            "message": "Budget deleted successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
