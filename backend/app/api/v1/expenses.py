from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.core.models import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.services.expense_service import expense_service
from app.core.security import get_current_user, verify_ownership

router = APIRouter()

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new expense"""
    try:
        user_id = current_user["user_id"]
        result = expense_service.create_expense(user_id, expense_data)
        return {
            "success": True,
            "data": result,
            "message": "Expense created successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("", response_model=dict)
async def get_expenses(
    limit: int = 20,
    offset: int = 0,
    category: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Get user's expenses with optional filters"""
    try:
        user_id = current_user["user_id"]
        filters = {"limit": limit, "offset": offset}
        if category:
            filters["category"] = category
        
        expenses = expense_service.get_expenses(user_id, **filters)
        return {
            "success": True,
            "data": expenses,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": len(expenses)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{expense_id}", response_model=dict)
async def get_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific expense by ID"""
    try:
        user_id = current_user["user_id"]
        expense = expense_service.get_expense(user_id, expense_id)
        
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        
        return {
            "success": True,
            "data": expense
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{expense_id}", response_model=dict)
async def update_expense(
    expense_id: str,
    expense_data: ExpenseUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing expense"""
    try:
        user_id = current_user["user_id"]
        result = expense_service.update_expense(user_id, expense_id, expense_data)
        return {
            "success": True,
            "data": result,
            "message": "Expense updated successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{expense_id}", response_model=dict)
async def delete_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an expense"""
    try:
        user_id = current_user["user_id"]
        expense_service.delete_expense(user_id, expense_id)
        return {
            "success": True,
            "message": "Expense deleted successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
