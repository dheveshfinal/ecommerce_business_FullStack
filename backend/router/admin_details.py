from fastapi import APIRouter, Depends, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

router = APIRouter()

@router.get("/add_image/{user_id}")
def get_products(request: Request, user_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT product_id, title, description, price, stock_quantity
        FROM products
        WHERE seller_id = :user_id
    """)

    result = db.execute(query, {"user_id": user_id}).fetchall()

    details = [
        {
            "id": row.product_id,
            "title": row.title,
            "description": row.description,
            "price": row.price,
            "stock_quantity": row.stock_quantity
        }
        for row in result
    ]
    return details

