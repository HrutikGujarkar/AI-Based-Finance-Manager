from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    currency: str = "INR"

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    userId: str
    name: str
    email: str
    currency: str
    role: str
    createdAt: datetime
    updatedAt: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = None

class ExpenseBase(BaseModel):
    amount: float
    currency: str = "INR"
    category: str
    subcategory: Optional[str] = None
    merchant: Optional[str] = None
    description: Optional[str] = None
    paymentMethod: Optional[str] = None
    transactionDate: datetime

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    expenseId: str
    userId: str
    aiCategorized: bool = False
    aiConfidence: float = 0.0
    isAnomaly: bool = False
    createdAt: datetime
    updatedAt: datetime

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    merchant: Optional[str] = None
    description: Optional[str] = None
    paymentMethod: Optional[str] = None

class BudgetBase(BaseModel):
    category: str
    amount: float
    currency: str = "INR"
    period: str = "monthly"
    startDate: datetime
    endDate: datetime
    alertThreshold: float = 0.75

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    budgetId: str
    userId: str
    spent: float = 0.0
    remaining: float = 0.0
    percentageUsed: float = 0.0
    isActive: bool = True
    createdAt: datetime
    updatedAt: datetime

class BudgetUpdate(BaseModel):
    amount: Optional[float] = None
    alertThreshold: Optional[float] = None
    isActive: Optional[bool] = None

class GoalBase(BaseModel):
    name: str
    targetAmount: float
    currency: str = "INR"
    targetDate: datetime
    category: str = "Savings"

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    goalId: str
    userId: str
    currentAmount: float = 0.0
    status: str = "active"
    progress: float = 0.0
    remaining: float = 0.0
    monthlyContribution: float = 0.0
    createdAt: datetime
    updatedAt: datetime

class GoalUpdate(BaseModel):
    currentAmount: Optional[float] = None
    status: Optional[str] = None

class AnalyticsSummary(BaseModel):
    period: str
    totalSpent: float
    currency: str
    transactionCount: int
    averageTransaction: float
    averageDaily: float
    monthOverMonthChange: float
    budgetUtilization: dict

class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    transactionCount: int

class AnalyticsResponse(BaseModel):
    period: str
    categories: List[CategoryBreakdown]
