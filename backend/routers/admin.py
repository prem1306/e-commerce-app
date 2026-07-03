from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_admin_user
import models, schemas
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin"])

# ─── Dashboard Stats ────────────────────────────────

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    total_users = db.query(models.User).count()
    total_products = db.query(models.Product).count()
    total_orders = db.query(models.Order).count()
    total_revenue = db.query(models.Order).all()
    revenue = sum(order.total for order in total_revenue)

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": revenue
    }

# ─── Manage Orders ───────────────────────────────────

@router.get("/orders", response_model=List[schemas.OrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    return db.query(models.Order).all()

@router.put("/orders/{order_id}")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    allowed = ["pending", "processing", "shipped", "delivered"]
    if status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")
    
    order.status = status
    db.commit()
    db.refresh(order)
    return {"message": f"Order {order_id} updated to {status}"}

# ─── Manage Users ────────────────────────────────────

@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), admin = Depends(get_admin_user)):
    return db.query(models.User).all()