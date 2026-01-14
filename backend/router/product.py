from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db

router = APIRouter()

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    query = text("""
        SELECT category_id, name
        FROM categories
        ORDER BY name
    """)
    result = db.execute(query).fetchall()
    return {"categories": [{"category_id": r.category_id, "name": r.name} for r in result]}


@router.get("/products")
async def get_products(
    request: Request,
    category_id: int = Query(None, description="Optional category filter"),
    db: Session = Depends(get_db)
):
    base_query = """
        SELECT 
            p.product_id,
            p.title,
            p.description,
            p.price,
            p.quality_grade,
            p.category_id,
            pi.image_url,
            pi.is_primary
        FROM products p
        JOIN product_images pi ON p.product_id = pi.product_id
    """
    
    if category_id:
        base_query += f" WHERE p.category_id = :category_id"
    base_query += " ORDER BY p.product_id, pi.is_primary DESC"
    
    result = db.execute(text(base_query), {"category_id": category_id} if category_id else {})
    rows = result.fetchall()

    products_dict = {}
    for row in rows:
        pid = row.product_id
        if pid not in products_dict:
            products_dict[pid] = {
                "product_id": pid,
                "title": row.title,
                "description": row.description,
                "price": row.price,
                "quality_grade": row.quality_grade,
                "category_id": row.category_id,
                "images": []
            }
        image_url = f"/{row.image_url}" if not row.image_url.startswith("/") else row.image_url
        products_dict[pid]["images"].append({
            "url": image_url,
            "is_primary": row.is_primary
        })

    return {
        "message": "Products fetched successfully",
        "products": list(products_dict.values())
    }
