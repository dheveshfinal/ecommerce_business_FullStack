from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db

router = APIRouter()


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    query = text("SELECT * FROM categories;")
    result = db.execute(query).fetchall()
    categories = [
        {
            "category_id": row.category_id,
            "name": row.name,
            "description": row.description,
        }
        for row in result
    ]
    return categories


# ✅ POST new product details
@router.post("/product_details")
async def admin_product_details(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    seller_id = data.get("user_id")
    category_id = data.get("category_id")
    title = data.get("title")
    description = data.get("description")
    price = data.get("price")
    stock_quantity = data.get("stock_quantity")
    quality_grade = data.get("quality_grade")

    query = text("""
        INSERT INTO products (seller_id, category_id, title, description, price, stock_quantity, quality_grade, status)
        VALUES (:seller_id, :category_id, :title, :description, :price, :stock_quantity, :quality_grade, 'draft')
        RETURNING product_id;
    """)

    result = db.execute(query, {
        "seller_id": seller_id,
        "category_id": category_id,
        "title": title,
        "description": description,
        "price": price,
        "stock_quantity": stock_quantity,
        "quality_grade": quality_grade
    })
    db.commit()

    new_id = result.scalar()

    return {"message": "✅ Product added successfully", "product_id": new_id}


@router.put("/update_product/{productId}")
async def update_details(request: Request, productId: int, db: Session = Depends(get_db)):
    data = await request.json()
    title = data.get("title")
    description = data.get("description")
    price = data.get("price")
    stock_quantity = data.get("stock_quantity")

    query = text("""
        UPDATE products
        SET title = :title,
            description = :description,
            price = :price,
            stock_quantity = :stock_quantity
        WHERE product_id = :productId
    """)

    db.execute(query, {
        "title": title,
        "description": description,
        "price": price,
        "stock_quantity": stock_quantity,
        "productId": productId
    })
    db.commit()

    return {"message": "Product updated successfully"}

@router.delete("/delete_product/{productId}")
def delete_data(productId: int, db: Session = Depends(get_db)):
    query = text("DELETE FROM products WHERE product_id = :productId")
    db.execute(query, {"productId": productId})
    db.commit()

    return {"message": "Product deleted successfully"}

